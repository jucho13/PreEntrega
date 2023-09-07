import express from "express";
import productRouter from "../routes/products.router.js";
import cartRouter from "../routes/carts.router.js";
import { __dirname } from "../utils.js";
import viewRouter from "../routes/views.router.js";
import RTPRouter from "../routes/realtimeproducts.router.js";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import productService from '../managers/productManager.js'
import mongoose from "mongoose";
import sessionsRouter from '../routes/sessions.router.js'
import userRouter from '../routes/user.router.js'

// dependencias para las sessions
import session from 'express-session';
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'

const app=express();

const PORT=8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/public"));
//config HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//rutas
app.use("/",productRouter);
app.use("/",cartRouter);
app.use('/', viewRouter);
app.use('/',RTPRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/user',userRouter);
// instanciamos socket.io
const httpServer = app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});
// seteo direccion mongo
const MONGO_URL= 'mongodb://127.0.0.1:27017/Ecommerce?retryWrites=true&w=majority';
export const socketServer = new Server(httpServer);

// abrimos el canal de comunicacion

const pmanager=new productService();

socketServer.on('connection',async (socket) => {
  console.log('Nuevo cliente conectado');
  const productLista=await pmanager.getAllL();
  // let productos=JSON.stringify(productLista);
  socket.emit('all-products', productLista); 
  socket.on('addProduct', async data => {
    console.log(`lo que regresa de add product es ${data.title}${data.description}${data.price}${data.thumbnail}${data.code}${data.stock}${data.status}${data.id}`);
    const prodCreado=await pmanager.save(data.title,data.description,data.price,data.thumbnail,data.code,data.stock,data.status,data.id=0);
    const updatedProducts = await pmanager.getAllL(); // Obtener la lista actualizada de productos
    socket.emit('productosupdated', updatedProducts);
  });
  socket.on("deleteProduct", async (id) => {
    console.log("ID del producto a eliminar:", id);
    const op=  await pmanager.delete(id);
    console.log(`Operacion ${op}`);
    const updatedProducts = await pmanager.getAllL();
    socketServer.emit("productosupdated", updatedProducts);
  });
  
  socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
  });
});

// SESSIONS 
app.use(session({
  //ttl: Time to live in seconds,
  //retries: Reintentos para que el servidor lea el archivo del storage.
  //path: Ruta a donde se buscará el archivo del session store.

  // Usando --> session-file-store
  // store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),


  // Usando --> connect-mongo
  store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60
  }),


  secret: "coderS3cr3t",
  resave: false, //guarda en memoria
  saveUninitialized: true, //lo guarda a penas se crea
}));




const connectMongoDB = async () => {
  try {
      await mongoose.connect(MONGO_URL);
      console.log("Conectado con exito a MongoDB usando Moongose.");
  } catch (error) {
      console.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
  }
};
connectMongoDB();




