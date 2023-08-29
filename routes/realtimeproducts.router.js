import {Router} from "express";
import { socketServer } from "../src/app.js";
import productService from "../managers/productManager.js";

const router = Router();

const pmanager= new productService();



router.get("/realtimeproducts",async(req,res)=>{
    // const productos = await pmanager.productList(); 
    // res.render('realTimeProducts');
    res.render('realTimeProducts');
 })
  



export default router;


 