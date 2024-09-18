// Función para obtener el valor de 'numOptions' desde localStorage
function getNumOptions() {
  return parseInt(localStorage.getItem("numOptions")) || 4;
}

// Función para guardar el valor de 'numOptions' en localStorage
function setNumOptions(numOptions) {
  localStorage.setItem("numOptions", numOptions);
}

var options = ["1", "2", "3", "4"];
// excluir numeros
// var excludedNumbers = ['12','20','14'];
options = Array.from({ length: getNumOptions() }, (_, i) => (i + 1).toString())
// .filter(option => !excludedNumbers.includes(option));;

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;

function updateOptions() {
  var numOptions = parseInt(document.getElementById("numOptions").value);
  if (!isNaN(numOptions) && numOptions > 0) {
    // excluir numeros
    // var excludedNumbers = ['12','20','14'];
    options = Array.from({ length: numOptions }, (_, i) => (i + 1).toString())
    // .filter(option => !excludedNumbers.includes(option));
    arc = Math.PI / (options.length / 2);
    setNumOptions(numOptions);
    drawRouletteWheel();
  } else {
    alert("Por favor, ingresa un número válido mayor que cero.");
  }
}

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return (
    String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
    nybHexString.substr(n & 0x0f, 1)
  );
}

function RGB2Color(r, g, b) {
  return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = (Math.PI * 2) / maxitem;
  

// // Ajustamos los componentes de color para hacer una mezcla de rojo, blanco y azul
// var red = Math.sin(frequency * item + 1 + phase) * width + center;
// var green = Math.sin(frequency * item + 2 + phase) * width + center;
// var blue = Math.sin(frequency * item + 4 + phase) * width + center;

// // Ajustes para obtener una mezcla de los colores de la bandera chilena
// // Rojo puro cuando item es bajo
// red = Math.max(0, Math.min(255, red + 200)); // Dominancia del rojo
// // Blanco (cuando todos los componentes se igualan) en ciertos puntos
// green = Math.max(0, Math.min(255, green + 255 * Math.sin(frequency * item))); // Blanco en algunas partes
// // Azul puro en otro rango
// blue = Math.max(0, Math.min(255, blue + 200)); // Dominancia del azul

// // Aseguramos que los valores estén en el rango correcto (0-255)
// red = Math.min(255, Math.max(0, red));
// green = Math.min(255, Math.max(0, green));
// blue = Math.min(255, Math.max(0, blue));

// // Devuelve el color como una combinación de rojo, blanco y azul
// return RGB2Color(red, green, blue);



// Primero obtenemos el valor de item en un rango cíclico para controlar la mezcla de colores
var cycle = (item % 3); // 0 para rojo, 1 para blanco, 2 para azul

var red, green, blue;

// Ajustamos los colores para obtener tonos pastel
if (cycle === 0) {
  // Rojo pastel
  red = 250;
  green = 50; // Aumentamos el verde y el azul para suavizar el rojo
  blue = 80;
} else if (cycle === 1) {
  // Blanco pastel (es prácticamente el mismo blanco, con ligera variación)
  red = 255;
  green = 255;
  blue = 255;
} else {
  // Azul pastel
  red = 50; // Aumentamos el rojo y el verde para suavizar el azul
  green = 50;
  blue = 250;
}

// Aseguramos que los valores estén en el rango correcto (0-255)
red = Math.min(255, Math.max(0, red));
green = Math.min(255, Math.max(0, green));
blue = Math.min(255, Math.max(0, blue));

// Devuelve el color correspondiente (rojo, blanco o azul en tonos pastel)
return RGB2Color(red, green, blue);




// var colors = [
//   '#FFFFFF', // Blanco
//   '#F0F8FF', // Blanco más tenue
//   '#F5F5F5', // Blanco grisáceo
//   '#FF0000', // Rojo fuerte
//   '#FF6347', // Rojo tomate
//   '#FF4500', // Rojo anaranjado
//   '#0000FF', // Azul fuerte
//   '#1E90FF', // Azul Dodger
//   '#4682B4', // Azul acero
//   '#4169E1', // Azul Royal
//   '#87CEFA', // Azul cielo claro
//   '#B0C4DE'  // Azul pálido
// ];

// return colors[item % colors.length];

}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = "bold 22px Helvetica, Arial";

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];

      // var rNC1 = 2
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(0,0,0)";
      // Ajusta el grosor del borde del texto
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";

      ctx.fillStyle = "white";

      ctx.translate(
        250 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.strokeText(text, -ctx.measureText(text).width / 2, 0);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

document.getElementById("spin").addEventListener("click", spin);

var spinSound = document.getElementById("spinSound");

function spin() {
  var rightImage = document.getElementById("personaje");
  rightImage.src = "public/Tania2_ruleta18.webp";
  // var cua = document.getElementById("personaje-blur");
  // cua.src = "public/Tania2_ruleta18.webp";
  setTimeout(function () {
    rightImage.src = "public/Tania1_ruleta18.webp";
    // cua.src = "public/Tania1_ruleta18.webp";
  }, 350); // Ajusta el tiempo según sea necesario (en milisegundos)

  // Genera un número aleatorio entre 1 y 9 (ambos inclusive)
  var nmajah = Math.floor(Math.random() * (12 - 4 + 1)) + 8;
  var numeroRandom2 = Math.floor(Math.random() * 17) + 1;
  // Combina los números aleatorios de manera creativa
  var resultadoAleatorio = Math.random() * nmajah + numeroRandom2;

  spinAngleStart = resultadoAleatorio;
  spinTime = 0;
  spinTimeTotal = Math.random() * 6 + 4 * 2000; // el 4 era

  
  spinSound.currentTime = 0; // Reinicia el audio al hacer clic nuevamente
  spinSound.play();

  // spinAngleStart = Math.random() * 10 + 10;
  // spinTime = 0;
  // spinTimeTotal = Math.random() * 8 + 4 * 2000;

  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  // GIRO INFINITO PA WEAR AL CTM DEL SAIKO:
  // function rotateWheel() {
  //   spinTime += 30;
  //   var spinAngle = spinAngleStart; // Mantener el ángulo de giro constante
  //   startAngle += (spinAngle * Math.PI) / 180;
  //   drawRouletteWheel();
  //   spinTimeout = setTimeout(rotateWheel, 30); // Llamar a rotateWheel continuamente
  // }
  
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = (startAngle * 180) / Math.PI + 90;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);

  // Detener el sonido al finalizar el giro
  var spinSound = document.getElementById("spinSound");
  var bell = document.getElementById("bell");
  spinSound.pause();
  spinSound.currentTime = 0;
  bell.play();

  ctx.save();
  ctx.font = "bold 70px Helvetica, Arial";
  var text = options[index];
  var lineHeight = 0; // Puedes ajustar este valor según sea necesario
  ctx.fillStyle = "white"
  if (text == "11") {
    text += "\nChupalo Entonces";
    ctx.font = "bold 22px Helvetica, Arial";
    var lineHeight = 30;
  } // Muestra cada línea de texto por separado
  else if (text == "13") {
    text += "\nAgarramela ";
    text += "\nque me Crece";
    ctx.font = "bold 20px Helvetica, Arial, White";
    // ctx.green = 50
    // ctx.blue = 50
    // ctx.red = 50
    var lineHeight = 30;
  }
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(
      lines[i],
      250 - ctx.measureText(lines[i]).width / 2,
      250 + 10 + i * lineHeight
    );
  }
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
