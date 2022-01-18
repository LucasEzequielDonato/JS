/* Lo que pienso hacer para el proyecto final es un calculador de
 de gastos de ingresos para alquilar una propiedad */

// Clase Propiedad que almacena toda la informacion de una propiedad.
class Propiedad {
    constructor (direccion, alquiler, duracion, comision, cantAumentos, aumento) {
        this.direccion = direccion;
        this.alquiler = alquiler;
        this.duracion = duracion;
        this.comision = comision;
        this.cantAumentos = cantAumentos;
        this.aumento = aumento;
    }

    // Metodo para agregar el valor del alquiler en los distintos periodos a la propiedad.
    agregarValorAlquileres (valorAlquileres) {
        this.valorAlquileres = valorAlquileres;
    }

    // Metodo para agregar el valor de depocito a la propiedad.
    agregarValorDepocito (depocito) {
        this.depocito = depocito;
    }

    // Metodo para almacenar la propiedad a la lista de propiedades.
    agregarPropiedadAPropiedades () {
        propiedades.push(this);
    }

}

//Se verifica si existe o no alguna carga previa de propiedades.
const localStorageProperties = localStorage.getItem("propiedades");
const propiedades = localStorageProperties ? JSON.parse(localStorageProperties) : [];
const botonCalcular = document.getElementById("botonCalcular");
const botonMostrar = document.getElementById("botonMostrar");
const botonCerrar = document.getElementById("botonCerrar");
botonCalcular.addEventListener("click", datosFaltantesGestion);
botonMostrar.addEventListener("click", mostrarDatosPropiedad);
botonCerrar.addEventListener("click", cerrarPopup);

// Funcion de ingreso de datos faltantes para realizar el calculo de ingreso.
function datosFaltantesGestion() {
    const direccion = document.getElementById("direccion").value;
    const alquiler = parseInt(document.getElementById("alquiler").value);
    const duracion = parseInt(document.getElementById("duracion").value);
    const aumento = parseInt(document.getElementById("aumento").value);
    const tiempoAumento = parseInt(document.getElementById("tiempoAumento").value);
    const datos = {
        direccion: direccion,
        alquiler: alquiler,
        duracion: duracion,
        aumento: aumento,
        tiempoAumento: tiempoAumento
    };
    validaciones(datos);
}
//Funcion para validar la entrada de datos.
function validaciones(datos){
    if (datos.direccion === "" || datos.alquiler === "" || datos.duracion === "" || datos.aumento === "" || datos.tiempoAumento === "") {
        alert("Un campo o varios estan vacios");
    }
    else {
        const propiedad = propiedades.find(({ direccion }) => direccion === datos.direccion);
        if (propiedad) {
            alert("La propiedad con esa direccion, ya existe");
        }
        else {
            transformaLosDatosEnInformacion(datos);
        }
    }
}

// Funcion para calcular datos necesarios para el calculo de ingreso.
function transformaLosDatosEnInformacion(datos) {
    const duracion = 12 * datos["duracion"];
    const comision = (datos["alquiler"] * duracion) * 0.05;
    const cantidadAumentos = duracion / datos.tiempoAumento;
    const propiedad = new Propiedad (datos.direccion, datos.alquiler, duracion, comision, cantidadAumentos, datos.aumento);
    calcularAlquileres(propiedad);
}

// Funcion para calcular el valor del alquiler cuando se aumenta.
function calcularAlquileres(propiedad) {
    const valorAlquiler = [propiedad.alquiler];
    for (let i = 2; i <= (propiedad.cantAumentos); i++) {
        const valorAlquilerPeriodo = (((valorAlquiler[valorAlquiler.length - 1] * propiedad.aumento) / 100) + valorAlquiler[valorAlquiler.length - 1]);
        valorAlquiler.push(valorAlquilerPeriodo);
    }
    propiedad.agregarValorAlquileres(valorAlquiler);
    calcularDepocito(propiedad);
}
// Funcion para calcular el valor del depocito de un alquiler.
function calcularDepocito(propiedad) {
    const depocito = propiedad.valorAlquileres[propiedad.valorAlquileres.length - 1];
    propiedad.agregarValorDepocito(depocito);
    propiedad.agregarPropiedadAPropiedades();
    almacenarPropiedades(propiedad);
    document.getElementById("direccion").value = "";
    document.getElementById("alquiler").value = "";
    document.getElementById("duracion").value = "";
    document.getElementById("aumento").value = "";
    document.getElementById("tiempoAumento").value = "";
    document.getElementById("direccionAAbuscar").value = propiedad.direccion;
    mostrarDatosPropiedad();
}

// Funcion para almacenar la propiedad en un Array de propiedades.
function almacenarPropiedades() {
    localStorage.setItem("propiedades",JSON.stringify(propiedades));
}

// Funcion para ordenar de menor a mayor y de mayor a menor, las propiedades del Array, segun el valor inicial del alquiler.
function ordenarArray() {
    const propiedades2 = [...propiedades];
    const propiedadesOrdenadasDeMenorAMayor = propiedades2.sort((a,b) => {
        return a.alquiler - b.alquiler;
    });
    console.log(propiedadesOrdenadasDeMenorAMayor);
    const propiedades3 = [...propiedades];
    const propiedadesOrdenadasDeMayorAMenor = propiedades3.sort((a,b) => {
        return b.alquiler - a.alquiler;
    });
    console.log(propiedadesOrdenadasDeMayorAMenor);
}

//Funcion para mostrar los datos de una propiedad en la pantalla.
function mostrarDatosPropiedad() {
    const direccionABuscar = document.getElementById("direccionAAbuscar").value;
    const propiedad = propiedades.find(({ direccion }) => direccion === direccionABuscar);
    if (propiedad) {
        const alquileres = propiedad.valorAlquileres.reduce((acc, alquiler, i) => `${acc}El ${i} periodo, el valor del alquiler sera de $ ${alquiler}.<br/>` , '');
        const mensaje = `La direccion es: ${propiedad.direccion}.<br/>El depocito es de: $${propiedad.depocito}.<br/>La comision es de: $${propiedad.comision}.<br/>${alquileres}`
        document.getElementById("tituloPopup").innerHTML = "DATOS DE LA PROPIEDAD";
        document.getElementById("parrafoInformacion").innerHTML = mensaje;
        mostrarPopup();
        document.getElementById("direccionAAbuscar").value = "";
    }
    else {
        document.getElementById("tituloPopup").innerHTML = "ERROR";
        document.getElementById("parrafoInformacion").innerHTML = "La propiedad no existe.";
        mostrarPopup();
    }
}
function cerrarPopup(){
    const popup = document.getElementById("popup");
    const popupContenedor = document.getElementById("contenedorPopup");
    popupContenedor.style.top = "-100%";
    popup.style.opacity = "0";
    setTimeout(function(){
        document.getElementById("tituloPopup").innerHTML = "";
        document.getElementById("parrafoInformacion").innerHTML = "";
        popup.style.zIndex = "-1";
    }, 500);
}
function mostrarPopup(){
    const popup = document.getElementById("popup");
    const popupContenedor = document.getElementById("contenedorPopup");
    popupContenedor.style.top = "0";
    popup.style.opacity = "1";
    popup.style.zIndex = "100";
}