const TARIFA = 12000;
let recaudaciones = [];
let calculando = false;

function dinero(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

function iniciarSesion() {
  let usuario = document.getElementById("usuario").value;
  let clave = document.getElementById("contrasena").value;
  let error = document.getElementById("errorLogin");

  if (usuario === "Cinecali" && clave === "Estrenos") {
    error.innerHTML = "";
    document.getElementById("login").classList.add("oculto");
    document.getElementById("panel").classList.remove("oculto");
    dibujarGrafica();
  } else {
    error.innerHTML = "Usuario o contraseña incorrectos. Revisa los datos e intenta de nuevo.";
  }
}

function volverAlLogin() {
  document.getElementById("panel").classList.add("oculto");
  document.getElementById("login").classList.remove("oculto");
  document.getElementById("usuario").value = "";
  document.getElementById("contrasena").value = "";
  document.getElementById("errorLogin").innerHTML = "";
}

function calcularYRegistrar() {
  if (calculando) { return; }

  let pelicula = document.getElementById("pelicula").value;
  let sala = document.getElementById("sala").value;
  let boletas = parseInt(document.getElementById("boletas").value);
  let precio = parseInt(document.getElementById("precio").value);
  let mensaje = document.getElementById("mensaje");

  if (pelicula === "" || sala === "" || isNaN(boletas) || isNaN(precio)) {
    mensaje.className = "error";
    mensaje.innerHTML = "Completa todos los campos antes de calcular.";
    return;
  }
  if (boletas <= 0 || precio <= 0) {
    mensaje.className = "error";
    mensaje.innerHTML = "Las boletas y el precio deben ser mayores que cero.";
    return;
  }
  mensaje.innerHTML = "";

  calculando = true;
  let segundos = 2;
  document.getElementById("reloj").classList.add("girando");
  document.getElementById("estadoReloj").innerHTML = "Calculando recaudación... " + segundos;
  document.getElementById("resTotal").innerHTML = "$ -- COP";

  let temporizador = setInterval(function () {
    segundos = segundos - 1;
    if (segundos > 0) {
      document.getElementById("estadoReloj").innerHTML = "Calculando recaudación... " + segundos;
    } else {
      clearInterval(temporizador);

      let total = boletas * precio;

      document.getElementById("resPelicula").innerHTML = pelicula;
      document.getElementById("resSala").innerHTML = sala;
      document.getElementById("resBoletas").innerHTML = boletas;
      document.getElementById("resTotal").innerHTML = dinero(total) + " COP";
      document.getElementById("reloj").classList.remove("girando");
      document.getElementById("estadoReloj").innerHTML = "Listo";

      recaudaciones.push(total);
      dibujarGrafica();
      calculando = false;

      setTimeout(continuarRegistro, 300);
    }
  }, 1000);
}

function continuarRegistro() {
  let mensaje = document.getElementById("mensaje");

  if (recaudaciones.length === 0) {
    mensaje.className = "error";
    mensaje.innerHTML = "Primero calcula y registra una función.";
    return;
  }

  let clave = prompt("Ingrese la clave para continuar registrando:");

  if (clave === "CINE") {

    document.getElementById("pelicula").value = "";
    document.getElementById("sala").value = "";
    document.getElementById("boletas").value = "";
    document.getElementById("precio").value = TARIFA;
    mensaje.className = "ok";
    mensaje.innerHTML = "Campos limpios. Ya puedes registrar otra función.";
  } else {

    alert("Clave incorrecta. Será devuelto al inicio de sesión.");
    mensaje.innerHTML = "";
    volverAlLogin();
  }
}

function cambiarAsiento() {
  let actual = document.getElementById("asientoActual").value;
  let nuevo = document.getElementById("asientoNuevo").value;
  let hora = document.getElementById("horaCambio").value;
  let mensaje = document.getElementById("mensajeAsiento");

  if (actual === "" || nuevo === "" || hora === "") {
    mensaje.innerHTML = "Completa el asiento actual, el nuevo y la hora del cambio.";
    return;
  }
  mensaje.innerHTML = "";

  let partes = hora.split(":");
  let minutos = parseInt(partes[0]) * 60 + parseInt(partes[1]);

  let recargo = 0;
  if (minutos >= 15 * 60 && minutos <= 18 * 60) {
    recargo = TARIFA * 0.05;
  }
  let totalAsiento = TARIFA + recargo;

  document.getElementById("resCambio").innerHTML = actual + " a " + nuevo + " (" + hora + ")";
  document.getElementById("resBase").innerHTML = dinero(TARIFA);
  document.getElementById("resRecargo").innerHTML = dinero(recargo);
  document.getElementById("resTotalAsiento").innerHTML = dinero(totalAsiento);
}

function mostrarFoto() {
  let archivo = document.getElementById("archivoFoto").files[0];
  if (!archivo) { return; }

  let lector = new FileReader();
  lector.onload = function (evento) {
    document.getElementById("vistaFoto").src = evento.target.result;
    document.getElementById("vistaFoto").classList.remove("oculto");
    document.getElementById("textoFoto").classList.add("oculto");
  };
  lector.readAsDataURL(archivo);
}

function dibujarGrafica() {
  let canvas = document.getElementById("grafica");
  let ctx = canvas.getContext("2d");
  let ancho = canvas.width;
  let alto = canvas.height;

  ctx.clearRect(0, 0, ancho, alto);

  let izq = 95, der = 25, arriba = 25, abajo = 40;
  let areaAncho = ancho - izq - der;
  let areaAlto = alto - arriba - abajo;

  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#C9B8A6";

  if (recaudaciones.length === 0) {
    ctx.fillText("Aún no hay funciones registradas", ancho / 2, alto / 2);
    return;
  }

  let maximo = 0;
  for (let i = 0; i < recaudaciones.length; i++) {
    if (recaudaciones[i] > maximo) { maximo = recaudaciones[i]; }
  }
  maximo = maximo * 1.2;

  ctx.strokeStyle = "#4A2A35";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    let y = arriba + areaAlto - (areaAlto * i / 4);
    ctx.beginPath();
    ctx.moveTo(izq, y);
    ctx.lineTo(ancho - der, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(dinero(Math.round(maximo * i / 4)), izq - 8, y + 4);
  }

  let puntosX = [];
  let puntosY = [];
  for (let i = 0; i < recaudaciones.length; i++) {
    let x;
    if (recaudaciones.length === 1) {
      x = izq + areaAncho / 2;
    } else {
      x = izq + (areaAncho * i / (recaudaciones.length - 1));
    }
    let y = arriba + areaAlto - (recaudaciones[i] / maximo * areaAlto);
    puntosX.push(x);
    puntosY.push(y);
  }

  ctx.strokeStyle = "#FFC94A";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < puntosX.length; i++) {
    if (i === 0) { ctx.moveTo(puntosX[i], puntosY[i]); }
    else { ctx.lineTo(puntosX[i], puntosY[i]); }
  }
  ctx.stroke();

  for (let i = 0; i < puntosX.length; i++) {
    ctx.fillStyle = "#FFC94A";
    ctx.beginPath();
    ctx.arc(puntosX[i], puntosY[i], 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#F6EBD9";
    ctx.textAlign = "center";
    ctx.fillText("F" + (i + 1), puntosX[i], alto - 15);
  }
}

dibujarGrafica();