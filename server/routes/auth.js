const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Валидация входных данных
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Все поля обязательны для заполнения');
    }
    
    // Проверка формата email с помощью регулярного выражения
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Введите корректный email адрес');
    }
    
    // Проверка надежности пароля
    if (password.length < 6) {
      res.status(400);
      throw new Error('Пароль должен содержать минимум 6 символов');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Пользователь уже существует');
    }

    // Первый зарегистрированный пользователь становится администратором
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // Экранирование входных данных для защиты от XSS
    const sanitizedName = name.replace(/[<>]/g, '');
    
    const user = await User.create({
      name: sanitizedName,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Неверные данные пользователя');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Авторизация пользователя & получение токена
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Валидация входных данных
    if (!email || !password) {
      res.status(400);
      throw new Error('Все поля обязательны для заполнения');
    }

    // Ограничение попыток входа (простая реализация)
    // В реальном проекте лучше использовать Redis для хранения счетчика попыток
    const loginAttempts = req.session?.loginAttempts || 0;
    if (loginAttempts >= 5) {
      res.status(429);
      throw new Error('Слишком много попыток входа. Попробуйте позже.');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Сброс счетчика попыток при успешном входе
      if (req.session) {
        req.session.loginAttempts = 0;
      }
      
      // Успешный вход - генерируем токен
      const token = generateToken(user._id);
      
      // Устанавливаем secure cookie с токеном для дополнительной защиты
      res.cookie('token', token, {
        httpOnly: true, // Недоступен для JavaScript
        secure: process.env.NODE_ENV === 'production', // Только по HTTPS в продакшене
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        sameSite: 'strict' // Защита от CSRF
      });
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token, // Также отправляем токен в ответе для совместимости
      });
    } else {
      // Увеличиваем счетчик попыток при неудачном входе
      if (req.session) {
        req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
      }
      
      res.status(401);
      throw new Error('Неверный email или пароль');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Получение профиля пользователя
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
      });
    } else {
      res.status(404);
      throw new Error('Пользователь не найден');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
});

module.exports = router; 