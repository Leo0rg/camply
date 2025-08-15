const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

// Загрузка переменных окружения из корневой папки
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" })); // Ограничение размера JSON
app.use(cookieParser()); // Для работы с cookies

// Настройка сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET || "camply-super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
    },
  }),
);

// Защита от XSS-атак
const helmet = require("helmet");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Защита от NoSQL инъекций
app.use(mongoSanitize());

// Ограничение количества запросов для защиты от DDoS-атак
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message:
    "Слишком много запросов с вашего IP, пожалуйста, повторите попытку позже",
});
app.use("/api/", limiter);

// Проверка Content-Type для защиты от атак
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (
      req.headers["content-type"] !== "application/json" &&
      !req.headers["content-type"]?.includes("multipart/form-data")
    ) {
      return res.status(400).json({ message: "Неподдерживаемый тип контента" });
    }
  }
  next();
});

// Статическая папка для загруженных файлов - сначала проверяем клиентскую папку, потом серверную
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "client", "public", "uploads")),
);
// Запасной вариант - серверная папка
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Добавляем маршрут для проверки наличия файлов
app.get("/check-uploads", (req, res) => {
  try {
    const serverUploadsPath = path.join(__dirname, "uploads");
    const clientUploadsPath = path.join(
      __dirname,
      "..",
      "client",
      "public",
      "uploads",
    );

    const serverFiles = fs.existsSync(serverUploadsPath)
      ? fs.readdirSync(serverUploadsPath)
      : [];
    const clientFiles = fs.existsSync(clientUploadsPath)
      ? fs.readdirSync(clientUploadsPath)
      : [];

    res.json({
      serverUploadsPath,
      clientUploadsPath,
      serverFiles,
      clientFiles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршруты
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/orders"));

// Базовый маршрут для проверки API
app.get("/", (req, res) => {
  res.send("API работает");
});

// Обработка ошибок
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`${process.env.MONGO_URI}`);
});
