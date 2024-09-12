import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import passport from 'passport'; 
import cookieParser from 'cookie-parser';
import { passportConfig } from './config/passport.js';
import createProductsRouter from './routes/products.router.js';
import cartsRouter from './routes/cart.router.js';
import authRouter from './routes/auth.router.js';
import viewsRouter from './routes/views.router.js';
import dotenv from 'dotenv';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passportConfig(passport); 
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', createProductsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/', viewsRouter);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { app, io };
