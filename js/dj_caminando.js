document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("animatedImageContainer");

  // Agrega la clase "animate-in" para mostrar la imagen
  container.classList.add("animate-in");

  setTimeout(function () {
    // Agrega la clase "animate-out" para ocultar la imagen
    container.classList.add("animate-out");

    setTimeout(function () {
      var image = document.getElementById("animatedImage");
      image.src = "public/DJ2.gif";
    }, 10);

    setTimeout(function () {
      // Elimina el contenedor después de la animación de salida
      container.parentNode.removeChild(container);
    }, 12000);
  }, 12000); // Retraso para aplicar la transformación de espejo
});
