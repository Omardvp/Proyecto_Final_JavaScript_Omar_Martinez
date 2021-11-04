//DECLARACIÓN DE CLASE PRODUCTO
class Producto {
    constructor(id, nombre, precio, cantidad, imagen, categoria) {
            this.id = parseInt(id);
            this.nombre = nombre;
            this.precio = parseInt(precio);
            this.cantidad = parseInt(cantidad);
            this.imagen = imagen;
            this.categoria=categoria;
           
            ;
    }
    agregarCantidad(valor){
        this.cantidad += valor; 
    }
    subtotal(){
        return this.cantidad * this.precio;
    }
   
}

