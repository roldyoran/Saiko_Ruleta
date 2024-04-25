function playVideo() {
  const playButton = document.getElementById("playButton");
//   const audioFiles = ["bad.mp3", "inspiracion.mp3",  "soygay.mp3", "depilate.mp3", "mujeres.mp3"];
  const audioFiles = ["random_op.mp3"];  
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  const audioSrc = "public/" + audioFiles[randomIndex];
  var audio = document.getElementById("cancion");
  ajustarVolumen(0.3); // Esto ajustará el volumen al 50%

  if (audio.paused) {
    audio.src = audioSrc;
    audio.play();
    playButton.classList.add("text-green-600");
  } else {
    audio.pause();
    playButton.classList.remove("text-green-600");
    playButton.classList.add("text-black");
  }

  audio.addEventListener("ended", function () {
    playButton.classList.remove("text-green-600");
    playButton.classList.add("text-black");
  });

  function ajustarVolumen(nuevoVolumen) {
    // Asegúrate de que el volumen esté en el rango de 0 a 1
    nuevoVolumen = Math.max(0, Math.min(1, nuevoVolumen));
    // Establecer el nuevo volumen
    audio.volume = nuevoVolumen;
  }

}
