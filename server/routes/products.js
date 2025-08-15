const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Сохраняем и в серверную папку uploads, и в клиентскую для разработки
    const serverPath = path.join(__dirname, '..', 'uploads');
    const clientPath = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
    
    // Создаем директории, если они не существуют
    if (!fs.existsSync(serverPath)) {
      fs.mkdirSync(serverPath, { recursive: true });
    }
    if (!fs.existsSync(clientPath)) {
      fs.mkdirSync(clientPath, { recursive: true });
    }
    
    cb(null, serverPath);
  },
  filename(req, file, cb) {
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
    
    // Копируем файл в клиентскую папку для разработки сразу после сохранения
    // Не используем req.on('end'), так как он может не сработать должным образом
    setTimeout(() => {
      const serverPath = path.join(__dirname, '..', 'uploads', fileName);
      const clientPath = path.join(__dirname, '..', '..', 'client', 'public', 'uploads', fileName);
      
      // Проверяем, существует ли файл на сервере
      if (fs.existsSync(serverPath)) {
        fs.copyFile(serverPath, clientPath, (err) => {
          if (err) {
            console.error('Ошибка копирования файла:', err);
          } else {
            console.log(`Файл успешно скопирован в ${clientPath}`);
          }
        });
      } else {
        console.error(`Файл ${serverPath} не найден для копирования`);
      }
    }, 500); // Небольшая задержка для уверенности, что файл сохранен
  },
});

// Проверка типа файла
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Только изображения!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Загрузка изображения
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Файл не был загружен' });
  }
  
  // Формируем путь для фронтенда, который начинается с /uploads
  // Это важно, чтобы путь был относительным и работал как на сервере, так и на клиенте
  const relativePath = `/uploads/${req.file.filename}`;
  console.log('Файл загружен, возвращаем путь:', relativePath);
  
  res.send(relativePath);
});

// @desc    Получить все товары
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Получить топ рекомендуемых товаров по рейтингу
// @route   GET /api/products/top
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Добавить отзыв к товару
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Вы уже оставляли отзыв' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Отзыв добавлен' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Получить товар по ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Товар не найден');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Создать товар
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Обновить товар
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Товар не найден');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Удалить товар
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Товар удален' });
    } else {
      res.status(404);
      throw new Error('Товар не найден');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

module.exports = router; 