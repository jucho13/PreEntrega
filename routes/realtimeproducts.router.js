import express  from "express";
import {ProductManager} from "../managers/productManager.js";
const router = express.Router();

const pmanager= new ProductManager();



router.get("/realtimeproducts",async(req,res)=>{
    let products=await pmanager.productList();
    res.render("realTimeProducts",{products});
 })
  



export default router;


 