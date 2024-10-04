import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { passportConfig } from './config/passport.js';

// Importar rutas
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import authRouter from './routes/auth.router.js';
import viewsRouter from './routes/views.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

// Conectar a MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Configuración de Handlebars
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicialización de Passport
passportConfig(passport);
app.use(passport.initialize());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', authRouter);
app.use('/', viewsRouter);

// Configuración de WebSocket con Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export { app, io };
