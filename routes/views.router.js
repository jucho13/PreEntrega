import express  from "express";
import {ProductManager} from "../managers/productManager.js";
const router = express.Router();

const pmanager= new ProductManager();



router.get("/",async(req,res)=>{
    const listaproductos=await pmanager.productList();
    // console.log(`Lista recibida por views.router ${listaproductos}`);
    res.render("home",{listaproductos});
  })
  



export default router;