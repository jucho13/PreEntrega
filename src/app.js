import express from "express";
import productRouter from "../routes/products.router.js";
import cartRouter from "../routes/carts.router.js";
import { __dirname } from "../utils.js";
import viewRouter from "../routes/views.router.js";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import {ProductManager} from "../managers/productManager.js";

const app=express();

const PORT=8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//config HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//rutas
app.use("/",productRouter);
app.use("/",cartRouter);
app.use(express.static(__dirname+ "/public"));



const httpServer=app.listen(PORT,()=>{
    console.log("Server is working ");
})

// declaramos el router
app.use('/', viewRouter);

// instanciamos socket.io

const socketServer= new Server(httpServer);
const p=new ProductManager;
// abrimos el canal de comunicacion

socketServer.on('connection', async (socket) => {
    try {
      const productsResult = await p.productList();
      socket.emit('realtimeproducts', productsResult);
    } catch (error) {
      console.error('Error', error);
    }
  });