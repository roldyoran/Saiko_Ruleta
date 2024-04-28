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

  // red   = Math.sin(frequency * item + 3 + phase) * width + center;

  red =   Math.sin(frequency * item + 1 + phase) * width + center; 
  green = Math.sin(frequency * item + 2 + phase) * width + center; 
  blue =  Math.sin(frequency * item + 2 + phase) * width + center; 


  return RGB2Color(red, green, blue);

  // var colors = ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#DA70D6', '#FF00FF', '#BA55D3', '#9370DB', '#8A2BE2', '#9400D3', '#9932CC', '#8B008B', '#800080', '#4B0082', '#6A5ACD', '#7B68EE', '#483D8B', '#4169E1', '#6495ED'];
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
    ctx.fillStyle = "black";

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

function spin() {
  var rightImage = document.getElementById("personaje");
  rightImage.src = "public/taniaBikinistick2.webp";
  setTimeout(function () {
    rightImage.src = "public/taniaBikinistick1.webp";
  }, 350); // Ajusta el tiempo según sea necesario (en milisegundos)

  // Genera un número aleatorio entre 1 y 9 (ambos inclusive)
  var nmajah = Math.floor(Math.random() * (12 - 4 + 1)) + 8;
  var numeroRandom2 = Math.floor(Math.random() * 17) + 1;
  // Combina los números aleatorios de manera creativa
  var resultadoAleatorio = Math.random() * nmajah + numeroRandom2;

  spinAngleStart = resultadoAleatorio;
  spinTime = 0;
  spinTimeTotal = Math.random() * 6 + 4 * 2000; // el 4 era

  var spinSound = document.getElementById("spinSound");
  spinSound.currentTime = 0; // Reinicia el audio al hacer clic nuevamente
  spinSound.play();

  // spinAngleStart = Math.random() * 10 + 10;
  // spinTime = 0;
  // spinTimeTotal = Math.random() * 8 + 4 * 2000;

  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
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
  if (text == "11") {
    text += "\nChupalo Entonces";
    ctx.font = "bold 22px Helvetica, Arial";
    var lineHeight = 30;
  } // Muestra cada línea de texto por separado
  else if (text == "13") {
    text += "\nAgarramela ";
    text += "\nque me Crece";
    ctx.font = "bold 20px Helvetica, Arial";
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
