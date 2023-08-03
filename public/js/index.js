const socket = io();

socket.emit('mensajeKey', "Hola desde el cliente");


socket.on("realtimeproducts", (data) => {
  const realTimeProducts = document.getProductsbyID("realTimeProducts");
  realTimeProducts.innerHTML += `${JSON.stringify(data)}`;
});