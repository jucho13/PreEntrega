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

app.get("/", async (req, res) => {
    try {
      const productsResult = await productsRouter(req, res);
      res.render("home", { products: productsResult });
    } catch (error) {
      res.status(500).send("Error al renderizar");
    }
  });
  
  // Ruta para productos en tiempo real
  app.get('/realtimeproducts', async (req, res) => {
    try {
      res.render('realTimeProducts');
    } catch (error) {
      res.status(500).send('Error al renderizar');
    }
  });
  

const httpServer=app.listen(PORT,()=>{
    console.log("Server is working ");
})

// declaramos el router
app.use('/', viewRouter);

// instanciamos socket.io

const socketServer= new Server(httpServer);

// abrimos el canal de comunicacion

socketServer.on('connection', async (socket) => {
    try {
      const productsResult = await ProductManager.productList();
      socket.emit('realtimeproducts', productsResult);
    } catch (error) {
      console.error('Error', error);
    }
  });