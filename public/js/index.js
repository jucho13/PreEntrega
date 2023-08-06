// const socket = io();

// socket.on('all-products', dataProd => {
//   console.log(dataProd)
//   const productList = document.getElementById('productList');
//   const arrayProd = dataProd.dataProd;
//   productList.innerHTML = '';



//   // Agregar cada producto a la tabla
//       arrayProd.forEach((product) => {
//           let div = document.createElement('div');
//           div.innerHTML = `
//           <h1>Product: ${product.title}</h1>
//           <h2>Description: ${product.description}</h2>
//           <h2>Price: $${product.price}</h2>
//           <p>Stock: ${product.stock}</p>
//           <p>ID: ${product.id}</p>
          
              
// `

//       productList.appendChild(div);
//   }); 
// });
const socket = io();

socket.on('all-products', dataProd => {
  const productList = document.getElementById('productList');
  const arrayProd = dataProd.dataProd;
  productList.innerHTML = '';

  // Agregar cada producto a la lista
  arrayProd.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
      <h1>Product: ${product.title}</h1>
      <h2>Description: ${product.description}</h2>
      <h2>Price: $${product.price}</h2>
      <p>Stock: ${product.stock}</p>
      <p>ID: ${product.id}</p>
    `;

    productList.appendChild(productDiv);
  });
});
