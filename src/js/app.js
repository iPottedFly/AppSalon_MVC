let paso = 1;
const pasoInit = 1;
const pasoEnd = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
   iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Carga la sección 1 en cuanto carga la web.
    tabs(); // Cambia la seccion cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador.
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend.
    idCliente();
    nombreCliente(); // Guardar nombre del cliente.
    seleccionarFecha(); // Guardar la fecha de la cita.
    seleccionarHora(); // Guardar la hora de la cita.
    mostrarResumen(); // Revisar resumen de cita.
}

function mostrarSeccion() {

    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con el paso.
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    // Quitar class actual al TAB anterior
    const tabAnterior =  document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el TAB actual.
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });

}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function (){
       if(paso <= pasoInit) return;
       paso--;
       botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function (){
        if(paso >= pasoEnd) return;
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI() {
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
       const {id, nombre, precio} = servicio;

       const nombreServicio = document.createElement('P');
       nombreServicio.classList.add('nombre-servicio');
       nombreServicio.textContent = nombre;

       const precioServicio = document.createElement('P');
       precioServicio.classList.add('precio-servicio');
       precioServicio.textContent = `$${precio}`;

       const servicioDiv = document.createElement('DIV');
       servicioDiv.classList.add('servicio');
       servicioDiv.dataset.idServicio = id;
       servicioDiv.onclick = function (){
           seleccionarServicio(servicio);
       }

       servicioDiv.appendChild(nombreServicio);
       servicioDiv.appendChild(precioServicio);

       document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if ( servicios.some( agregado => agregado.id === id )) {
        // Si ya esta agregado, Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e){
        const dia = new Date(e.target.value).getUTCDay();
        if ( [6,0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {
       const horaCita = e.target.value;
       const hora = horaCita.split(":")[0];
       if (hora < 10 || hora > 19) {
           mostrarAlerta('Hora no valida', 'error', '.formulario');
       } else {
           cita.hora = e.target.value;
       }
    });
}


function mostrarAlerta(mensaje, tipo, elemento, timeout = true){

    // Previene que se generen multiples alertas.
    const prevent = document.querySelector('.alerta');
    if(prevent) {
        prevent.remove();
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (timeout) {
        setTimeout(() => {
            alerta.remove();
        }, 3500);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar contenido de Resumen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de servicios, Fecha u Hora.', 'error', '.contenido-resumen', false);
        return;
    }

    const { nombre, fecha, hora, servicios} = cita;

    // Heading para servicios
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios.';
    resumen.appendChild(headingServicios);

    // Mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre} = servicio;
       const contenedorServicio = document.createElement('DIV');
       contenedorServicio.classList.add('contenedor-servicio');

       const textoServicio = document.createElement('P');
       textoServicio.textContent = nombre;

       const precioServicio = document.createElement('P');
       precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

       contenedorServicio.appendChild(textoServicio);
       contenedorServicio.appendChild(precioServicio);

       resumen.appendChild(contenedorServicio);
    });

    // Formatear el div de resumen.
    const space = document.createElement('P');
    space.textContent = '';
    const headingDatos = document.createElement('H3');
    headingDatos.textContent = 'Resumen de Cita';
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year,mes, dia));
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para crear cita.
    const reserva = document.createElement('BUTTON');
    reserva.classList.add('boton');
    reserva.textContent = 'Reservar Cita';
    reserva.onclick = reservarCita;


    resumen.appendChild(space);
    resumen.appendChild(headingDatos);
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(reserva);
}

async function reservarCita() {
    const { nombre, fecha, hora, servicios, id } = cita;
    const idServicios = servicios.map(servicio => servicio.id);

    const data = new FormData();
    data.append('fecha', fecha);
    data.append('hora', hora);
    data.append('usuarioid', id);
    data.append('servicios', idServicios);

    try {
        // Peticion hacia la API.
        const url = '/api/citas';

        const response = await fetch(url, {
            method: 'POST',
            body: data
        });

        const resultado = await response.json();
        if (resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: "Cita Creada",
                text: "Tu cita ha sido creada correctamente.",
                button: 'OK'
            }).then( () => {
                window.location.reload();
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error en la cita",
            text: "Hubo un error al guardar la cita"
        });
    }
}