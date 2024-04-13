function playVideo() {
  const playButton = document.getElementById("playButton");
//   const audioFiles = ["bad.mp3", "inspiracion.mp3",  "soygay.mp3", "depilate.mp3", "mujeres.mp3"];
  const audioFiles = ["random_op.mp3", "mujeres.mp3"];  
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  const audioSrc = "public/" + audioFiles[randomIndex];
  var audio = document.getElementById("cancion");

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
}
