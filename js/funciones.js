//Funcion para generar la interfaz de productos con jQuery
function productosUI(productos, id) {
  $(id).empty();
  for (const producto of productos) {
    $(id).append(`<div class="card card2 style="width: 18rem;">
     <img src="${producto.imagen}" class="card-img-top" alt="..." width="120px" height="230px">
     <div class="card-body">
       <h5 class="card-title">${producto.nombre}</h5>
       <p class="card-text">$ ${producto.precio}</p>
       <span class="badge badge-warning">${producto.categoria} </span>
       <a href="#" id='${producto.id}' class="btn btn-light btn-compra">COMPRAR</a>
      </div>
   </div>`);
  }
  $('.btn-compra').on("click", comprarProducto);

}
//MANEJADOR DE COMPRA DE PRODUCTOS
function comprarProducto(e) {
  //PREVENIR REFRESCO AL PRESIONAR ENLACES
  e.preventDefault();
  //OBTENER ID DEL BOTON PRESIONADO
  const idProducto = e.target.id;
  //BUSCAR PRIMERO EL OBJETO EN EL CARRITO (SI FUE SELECCIONADO);
  const seleccionado = carrito.find(p => p.id == idProducto);
  //SI NO SE ENCONTRO BUSCAR EN ARRAY DE PRODUCTOS
  if (seleccionado == undefined) {
    carrito.push(productos.find(p => p.id == idProducto));
  } else {
    //SI SE ENCONTRO AGREGAR UN CANTIDAD
    seleccionado.agregarCantidad(1);
  }
  //---------Almacenamiento en localstorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  //GENERAR SALIDA PRODUCTO
  carritoUI(carrito);
  $('.btn-compra').on("click", modalBtnCompra);
}
//FUNCION PARA RENDERIZAR LA INTERFAZ DEL CARRITO
function carritoUI(productos) {
  //CAMBIAR INTERIOR DEL INDICADOR DE CANTIDAD DE PRODUCTOS;
  $('#carritoCantidad').html(productos.length);
  //VACIAR EL INTERIOR DEL CUERPO DEL CARRITO;
  $('#carritoProductos').empty();
  for (const producto of productos) {
    $('#carritoProductos').append(registroCarrito(producto));
  }
  $("#carritoCantidad").append(actualizarPrecio);
  //----------Agrego eventos a los botones de agregar, restar y eliminar
  $('.btn-delete').on('click', eliminarCarrito);
  $('.btn-add').on('click', agregarCarrito);
  $('.btn-sub').on('click', restarCarrito);
  //Agrego un boton confirmar al carrito
  $('#carritoProductos').append(`<button id="btnConfirmar" class="btn-confirm">Confirmar compra</button>`);
  //Agrego el evento click al boton confirmar
  $("#btnConfirmar").on("click", enviarCompra)
  // $("#btnConfirmar").on("click",actualizarPrecio)
  $("#btnConfirmar").on("click", modalFinal)
  document.getElementById("btnConfirmar").addEventListener('click', () => {
    localStorage.clear()
    carrito.length = 0
  })
}
//FUNCION PARA GENERAR LA ESTRUCTURA DEL REGISTO HTML
function registroCarrito(producto) {
  return `<tr>
  <td><img src="${producto.imagen}" class="card-img-top" alt="..." width="60px" height="100px"></td>
  <td> ${producto.nombre} </td>
  <td><span class="badge badge-warning">$ ${producto.precio}</span></td>
  <td><span class="badge badge-dark">${producto.cantidad}</span></td>
  <td><span class="badge badge-warning"> $ ${producto.subtotal()}</span></td>
  <td><button id="${producto.id}" class="btn-add btn btn-dark">+</button></td> 
  <td><button id="${producto.id}" class="btn-sub btn btn-dark">-</button></td>  
  <td><i style="padding: 10px 12px;" id="${producto.id}" class="fas fa-trash-alt btn btn-warning btn-delete"></i></td>         
  </tr>`

}
//Funcion Eliminar
function eliminarCarrito(event) {
  //Uso event.stopPropagation() para que no se cierre la interfaz de carrito cuando hago click
  event.stopPropagation();
  //Filtro todos los productos menos el precionado para "eliminarlo"
  //Para hacer esto carrito debe ser declarado con let
  carrito = carrito.filter(producto => producto.id != event.target.id);
  //Vuelvo a generar la interfaz de carrito actualizada
  carritoUI(carrito);
  //Almaceno en el storage el carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));


}

function agregarCarrito(event) {
  //Uso event.stopPropagation() para que no se cierre la interfaz de carrito cuando hago click
  event.stopPropagation();
  //Uso find para encontrar el producto al que hice click
  let producto = carrito.find(p => p.id == event.target.id);
  //Uso el metodo agregar cantidad
  producto.agregarCantidad(1);
  //Uso (this).parent().children() para acceder a todos los hijos del carrito y poder editarlos
  $(this).parent().parent().children()[3].innerHTML = `<span class="badge badge-dark">${producto.cantidad}</span>`;
  $(this).parent().parent().children()[4].innerHTML = `<span class="badge badge-warning">${producto.subtotal()}</span>`;
  //Almaceno en el storage el carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarPrecio()
}

function restarCarrito(event) {
  //Uso event.stopPropagation() para que no se cierre la interfaz de carrito cuando hago click
  event.stopPropagation();
  //Uso find para encontrar el producto al que hice click
  let producto = carrito.find(p => p.id == event.target.id);
  //Verifico que el numero sea mayor a 1 para restar
  if (producto.cantidad > 1) {
    //Uso el metodo agregar cantidad con -1 para restar
    producto.agregarCantidad(-1);
    //Uso (this).parent().children() para acceder a todos los hijos del carrito y poder editarlos
    $(this).parent().children()[3].innerHTML = `<span class="badge badge-dark">${producto.cantidad}</span>`;
    $(this).parent().children()[4].innerHTML = `<span class="badge badge-warning">${producto.subtotal()}</span>`;
    //Almaceno en el storage el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarPrecio()
  }
};

function enviarCompra() {
  //Hago un envio post
  //Envio la info del carrito  transformada a JSON
  $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(carrito), function (respuesta, estado) {
    console.log(estado);
    console.log(respuesta);
    ///Pregunto si el estado de la operacion fue exitoso
    if (estado == "success") {
      //Vacio el carrito
      $('#carritoProductos').empty();
      //Vacio el numero de productos
      $('#carritoCantidad').html("0");
      actualizarPrecio()
    } else {
      console.log('Los datos no se enviaron correctamente');
    }

  })
}


precioFinal.innerText = "0"

function actualizarPrecio(event) {
  let precioFinal = document.getElementById('precioFinal');
  precioFinal.innerText = carrito.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
}

function selectUI(lista, selector) {
  $(selector).empty();
  for (const categoria of lista) {
    $(selector).append(`<option>${categoria}</option>`);
  }
  $(selector).prepend(`<option selected>TODOS</option>`);
}

function modalBtnCompra(event) {
  Toastify({
    text: "El producto se añadio al carrito",
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "black",
    },
    onClick: function () {}
  }).showToast() = () => {
    event.hideToast();
  }
}

function modalFinal(event) {
  Toastify({
    text: "Gracias por la compra",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "black",
    },
    onClick: function () {}
  }).showToast();
}


function buscarCategoria() {


  //-----------Codigo de filtro con animaciones    
  //Primero guardo en una variable el valor seleccionado en el select
  let valor = this.value;
  //oculto el div de productos con una animacion y agrego una funcion callback para hacer el filtro
  $("#productosContenedor").fadeOut(2000, function () {
    //si la categoria seleccionada es diferente a todos quiere decir que es una categoria existente
    if (valor != "TODOS") {
      //filtro por categoria
      let filtrados = productos.filter(producto => producto.categoria == valor);
      //genero la interfaz solo con los productos filtrados
      productosUI(filtrados, "#productosContenedor");
    } else {
      //si la categoria seleccionada es todos, genero la interfaz con todos los productos
      productosUI(productos, "#productosContenedor");
    }
  }).fadeIn(2000); //endadeno una animacion para mostrar el resultado

}