import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserRepository from '../repository/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';

const router = express.Router();
const userRepository = new UserRepository();

// Middleware de autorización para asegurar que solo los usuarios autenticados accedan a ciertas rutas
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
    }

    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Enviar token como cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });

    // Responder con JSON y redirección
    res.status(200).json({ status: 'success', message: 'User registered successfully', redirectTo: '/home' });
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Datos de login recibidos:', { email, password });

    const user = await userRepository.findByEmail(email);

    if (!user) {
      console.log('Usuario no encontrado con el email:', email);
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Resultado de la comparación de contraseñas:', isMatch);

    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', email);
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    console.log('Token generado después del login:', token);

    // Enviar el token en la cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });

    // Responder con JSON y redirección
    res.status(200).json({ status: 'success', message: 'Login successful', redirectTo: '/home' });
  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
  }
});

// Ruta de logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ status: 'success', message: 'Logout successful' });
});

// Ruta protegida para obtener la sesión actual
router.get('/current', authenticateJWT, (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({ status: 'success', user: userDTO });
});

export default router;
