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
import http from 'http';

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



// declaramos el router
app.use('/', viewRouter);
app.use('/',RTPRouter);
// instanciamos socket.io
const httpServer = app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})

export const socketServer = new Server(httpServer);

// abrimos el canal de comunicacion

const pmanager=new productService();

socketServer.on('connection',async (socket) => {
  console.log('Nuevo cliente conectado');
  const productLista=await pmanager.productList();
  // let productos=JSON.stringify(productLista);
  socket.emit('all-products', productLista); 
  socket.on('addProduct', async data => {
    console.log(`lo que regresa de add product es ${data.title}${data.description}${data.price}${data.thumbnail}${data.code}${data.stock}${data.status}${data.id}`);
    const prodCreado=await pmanager.createProduct(data.title,data.description,data.price,data.thumbnail,data.code,data.stock,data.status,data.id=0);
    const updatedProducts = await pmanager.productList(); // Obtener la lista actualizada de productos
    socket.emit('productosupdated', updatedProducts);
  });
  socket.on("deleteProduct", async (id) => {
    console.log("ID del producto a eliminar:", id);
    const op=  await pmanager.deleteProduct(id);
    console.log(`Operacion ${op}`);
    const updatedProducts = await pmanager.productList();
    socketServer.emit("productosupdated", updatedProducts);
  });
  
  socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
  });
});

const connectMongoDB = async () => {
  try {
      await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce?retryWrites=true&w=majority');
      console.log("Conectado con exito a MongoDB usando Moongose.");
  } catch (error) {
      console.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
  }
};
connectMongoDB();



