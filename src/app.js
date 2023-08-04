import express from "express";
import productRouter from "../routes/products.router.js";
import cartRouter from "../routes/carts.router.js";
import { __dirname } from "../utils.js";
import viewRouter from "../routes/views.router.js";
import RTPRouter from "../routes/realtimeproducts.router.js";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import http from 'http';

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


// declaramos el router
app.use('/', viewRouter);
app.use('/',RTPRouter);
// instanciamos socket.io
const server = http.createServer(app);
const io = new Server(server);

// abrimos el canal de comunicacion

io.on('connection', socket => {
  console.log('Nuevo cliente conectado');
  socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
  });
});


server.listen(PORT,()=>{
    console.log("Server is working ");
})

export function getIO() {
  return io;
}
