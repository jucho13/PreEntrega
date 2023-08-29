import express  from "express";
import productService from "../managers/productManager.js";
// import { Socket } from "socket.io"; // fijarse en products.router.js que ahi estan bien configurados los servers
const router = express.Router();

const pmanager= new productService();
// const io= new Socket();


router.get("/products",async(req,res)=>{
    const listaproductos=await pmanager.getAll();
    console.log(`Lista recibida por views.router ${listaproductos.title}`);
    res.render("home",{listaproductos});
    // io.on('addNewProduct', (prod)=>{
    //     manager.save();

    // })
  })
  



export default router;