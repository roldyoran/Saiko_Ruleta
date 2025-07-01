import { animate, stagger, delay, spring } from "motion";


// const title = document.querySelector("#title");

// animate(title,
//   { opacity: [0, 1], y: [-100, 20] },
//   { delay: 6, easing: spring() }
// );



const images = document.querySelectorAll(".carousel .img");

// Función comenzar la animación
function startAnimation() {
  delay(() => {
    // Aplica la animación de movimiento
    animate(
      images,
      { opacity: [0, 1] },
      { duration: 1, delay: stagger(5) }
    );
  }, 5);
  // Aplica la animación de desaparición para la ultima imagen
  animate(images,
    { opacity: [1, 0], duration: 1 }
  );
}

// Iniciar la animación al principio
startAnimation();

// Repetir la animación después de que termine (según la duración total)
setInterval(startAnimation, 21000); // 3000ms = 3 segundos (ajustar según la duración total)




const images2 = document.querySelectorAll(".carousel2 .img2");
// Función comenzar la animación
function startAnimation2() {
  delay(() => {
    // Aplica la animación de movimiento
    animate(
      images2,
      { opacity: [0, 1] },
      { duration: 1, delay: stagger(5) }
    );
  }, 5);
  // Aplica la animación de desaparición para la ultima imagen
  animate(images2,
    { opacity: [1, 0], duration: 1 }
  );
}

// Iniciar la animación al principio
startAnimation2();


// Repetir la animación después de que termine (según la duración total)
setInterval(startAnimation2, 21000); // 3000ms = 3 segundos (ajustar según la duración total)


