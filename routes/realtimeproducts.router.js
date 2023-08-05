import express  from "express";
import {ProductManager} from "../managers/productManager.js";
const router = express.Router();


const pmanager= new ProductManager();



router.get("/realtimeproducts",async(req,res)=>{
    const productos = await pmanager.productList(); 
    res.render('realTimeProducts');
    // res.render('realTimeProducts',{pList});
 })
  



export default router;


 