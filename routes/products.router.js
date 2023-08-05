import {Router} from "express";
import {ProductManager} from "../managers/productManager.js";

const router = Router();
const manager = new ProductManager();



router.get('/api/products', async (req, res) => {
  try {
    const { limit } = req.query;
    let productsList = await manager.productList(); // Obtener la lista de productos primero

    if (limit) {
      let newProducts = productsList.slice(0, limit); // Recortar la lista si se proporciona el límite
      productsList = newProducts; // Asignar la nueva lista recortada
    }

    res.send({ status: "success", payload: productsList });
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
  }
});

router.post('/api/products', async (req, res) => {
  try {
    //para agregar un nuevo producto colocar id=0 y se autogenera un id
    let productToAdd = req.body;
    console.log(productToAdd);
    if (!('status' in productToAdd)) {
      productToAdd.status = true;
    }
    let status = await manager.createProduct(productToAdd.title,productToAdd.description,productToAdd.price,productToAdd.thumbnail,productToAdd.code,
      productToAdd.stock,productToAdd.status,productToAdd.id);
    res.status(status.code).json({status: status.status})
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
  }
});

router.get('/api/products/:pid', async (req, res) => {
    const {pid} = req.params;
    console.log(`pid: ${pid}`);
    const product = await manager.getProductsbyID(parseInt(pid));
    if(product) {
      res.send({status: "success", payload: product });
    }else {
      res.status(404).json({'error': 'Producto no encontrado'});
    }
});

router.put('/api/products/:pid', async (req, res) => {
    const {pid} = req.params;
    let productToUpdate = req.body;
    let p = await manager.updateProduct(productToUpdate.title,productToUpdate.description,productToUpdate.price,productToUpdate.thumbnail,productToUpdate.code,
      productToUpdate.stock,productToUpdate.status,parseInt(pid));
    if(p) {
        res.send({status: "success", payload: p });
      }else {
        res.status(404).json({'error': 'Producto no encontrado'});
    }
})

router.delete('/api/products/:pid', async (req, res) => {
  const {pid} = req.params;
  let p = await manager.deleteProduct(parseInt(pid));
  if(p) {
    res.send({status: "success", payload: p });
  }else {
    res.status(404).json({'error': 'Producto no encontrado'});
  }
})

export default router;