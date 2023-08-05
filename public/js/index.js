const socketClient = io();

socketClient.on('all-products', dataProd => {
  console.log(dataProd)
  const productList = document.getElementById('productList');
  productList.innerHTML = '';



  // Agregar cada producto a la tabla
      dataProd.forEach((product) => {
          let div = document.createElement('div');
          div.innerHTML = `
          <h1>Product: ${product.title}</h1>
          <h2>Description: ${product.description}</h2>
          <h2>Price: $${product.price}</h2>
          <p>Stock: ${product.stock}</p>
          <p>ID: ${product.id}</p>
          
              
`

      productList.appendChild(div);
  }); 
});