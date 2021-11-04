
//Utilizo el metodo HIDE para ocultar todo lo que esta en el div productosContenedor
$('#productosContenedor').hide();

//FUNCION QUE SE EJECUTA CUANDO SE CARGA TODA LAS IMAGENES DE LA APLICACION
window.addEventListener('load',()=>{
    //ELIMINAR ELEMENTO DEL DOM
    $('#indicadorCarga').remove();
    //MOSTRAR ELEMENTO CON UN FADE
    $('#productosContenedor').fadeIn("slow",()=>{ console.log('ANIMACION FINALIZADA')});
    
})


//------------Obtencion de datos de forma asincrona(AJAX)
//1° realizamos una llamada asincrona para traer los datos de un JSON
$.get("data/productos.json",function (datos, estado) {
    console.log(datos);
    console.log(estado);
    //Usamos un if para preguntar si la llama fue exitosa
    if (estado == "success") {    
        //Transformamos los objetos de tipo "objeto" a tipo "producto"    
        for (const literal of datos) {
            productos.push(new Producto(literal.id, literal.nombre, literal.precio, 1, literal.imagen, literal.categoria,literal.cantidad));
                        
        }
        //GENERAR INTERFAZ DE PRODUCTOS CON UNA FUNCION
        productosUI(productos, '#productosContenedor');
        
    }else{
        console.log('No cargaron los datos');
    }
    
});
//-----------Recuperacion de datos del carrito desde el localStorage
$(document).ready(function () {
    //1° Pregunto si existe la clave "carrito" en el local storage
    if("carrito" in localStorage){
        //2° si existe obtengo esos datos en un array y los paso a objetos con JSON.parse()
        const datos= JSON.parse(localStorage.getItem('carrito'));
        //3° Transformamos los objetos de tipo "objeto" a tipo "producto" 
        for (const literal of datos) {
            carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.cantidad, literal.imagen));
        }
        //4° Volvemos a generar la interfaz carrito
        carritoUI(carrito);
    }    
});



  $(window).on('load',function () {    
    $("#espera").remove(); 
    // AGREGO FADEIN PARA QUE SE MUESTREN LOS PRODUCTOS OCULTOS 
    $('#productosContenedor').fadeIn(2000, 
        //Agrego una funcion callback
        function () {console.log("Funcionalidad Callback")
        
    });
  });
  
  
  //   //Ejemplo de encadenamiento de animaciones
//Funcion para crear la interfaz fel select de categorias
  selectUI(categorias,"#selectCategoria");
  //Asocio en evento change al select
  $("#selectCategoria").on("change", buscarCategoria)
  
