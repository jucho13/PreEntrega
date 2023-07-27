import express from "express";
import { Router } from "express";

import {Container} from "../managers/cartManager.js";
const CartService = new Container();
import {ProductManager} from "../managers/productManager.js";
const ProductService = new ProductManager();

const router = express.Router();

router.post('/api/cart', async (req, res) => {
  try {
    const result = await CartService.create();
    res.send(result);
}
  catch (error) {
    res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
}})
router.delete('/api/cart/:id', (req, res) => {
  let param = req.params.id
  if (isNaN(param)) return (res.status(400).send({ error: "No es un numero" }))
  let id = parseInt(param)
  CartService.deleteById(id).then(result => res.send(result))
})
router.post('/api/cart/:id/products', async (req, res) => {
  let param = req.params.id;
  let productsId = req.body;
  let realProducts = [];
  if (isNaN(param)) return (res.status(400).send({ error: "No es un numero" }));
  let id = parseInt(param);
  console.log(`Cart ID= ${param}`);
  console.log(`Products ID= ${productsId}`);
  await Promise.all(productsId.map(async (products) => {
      console.log(products);
      let verifier = await ProductService.getProductsbyID(products);
      console.log(verifier);
      if (!verifier.error) {
          realProducts.push(products);
      }
  }))
  let carritoCompleto=await CartService.addProduct(id, realProducts);
  res.send(carritoCompleto);
})
router.get('/api/cart/:id/products', async (req, res) => {
  let param = req.params.id;
  if (isNaN(param)) return (res.status(400).send({ error: "No es un numero" }));
  let id = parseInt(param);
  let cart = await CartService.getById(id);
  let productsId = cart.products;
  let cartProducts = [];
  await Promise.all(productsId.map(async (products) => {
      let newProduct = await ProductService.getProductsbyID(products);
      cartProducts.push(newProduct);
  }))
  res.send(cartProducts);
})
router.delete('/api/cart/:id/products/:id_prod', (req, res) => {
  let cartIdParam = req.params.id;
  let prodIdParam = req.params.id_prod;
  if (isNaN(cartIdParam || prodIdParam)) return (res.status(400).send({ error: "No es un numero" }));
  let cartId = parseInt(cartIdParam);
  let prodId = parseInt(prodIdParam);
  let result= CartService.deleteProduct(cartId, prodId);
  res.send("Producto Borrado");
})
export default router;