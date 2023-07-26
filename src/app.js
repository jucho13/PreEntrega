import express from "express";
import router from "../routes/products.router.js";
import Router from "../routes/carts.router.js";
const app=express();

const PORT=8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//rutas
app.use("/",router);
app.use("/",Router);


app.listen(PORT,()=>{
    console.log("Server is working ");
})