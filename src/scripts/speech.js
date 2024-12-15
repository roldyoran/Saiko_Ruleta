import { spin, updateOptions } from './ruleta.js';



// Función auxiliar para verificar si el transcript incluye alguna de las frases
function includesAny(transcript, phrases) {
    return phrases.some(phrase => transcript.includes(phrase));
}

// Frases a reconocer con .includes
const fraseRec2 = "ACTUALÍZALO A DOS";
const fraseRec2_2 = "ACTUALÍZALO A 2";
const fraseRec3 = "ACTUALÍZALO A TRES";
const fraseRec3_2 = "ACTUALÍZALO A 3";
const fraseRec4 = "ACTUALÍZALO A CUATRO";
const fraseRec4_2 = "ACTUALÍZALO A 4";
const fraseRec5 = "ACTUALÍZALO A 5";
const fraseRec5_2 = "ACTUALÍZALO A CINCO";
const fraseRec6 = "ACTUALÍZALO A SEIS";
const fraseRec6_2 = "ACTUALÍZALO A 6";
const fraseRec7 = "ACTUALÍZALO A 7";
const fraseRec7_2 = "ACTUALÍZALO A SIETE";
const fraseRec8 = "ACTUALÍZALO A 8";
const fraseRec8_2 = "ACTUALÍZALO A OCHO";

// Frases agrupadas en un objeto para facilitar el manejo
const phrasesMap = {
    2: [fraseRec2, fraseRec2_2],
    3: [fraseRec3, fraseRec3_2],
    4: [fraseRec4, fraseRec4_2],
    5: [fraseRec5, fraseRec5_2],
    6: [fraseRec6, fraseRec6_2],
    7: [fraseRec7, fraseRec7_2],
    8: [fraseRec8, fraseRec8_2],
};

const ponelePlay = "PONELE PLAY"
const ponelePlayTilde = "PÓNELE PLAY"
const ponelePlayPonle = "PONLE PLAY"

const girar1 = "GIRALDO"
const girar2 = "GÍRALO"
const girar3 = "MÍRALO"
const girar4 = "TÍRALO"
const girar5 = "GIRALO"


// const message_ia_amor = 'YO TAMBIEN TE AMO';
// const audio_ia_amor = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=Mia&text=${encodeURIComponent(message_ia_amor)}`);

// Audio Depilate Trolleo
const audioFiles_speech = ["depilate.mp3"];
const audioSrc_speech = "audios/" + audioFiles_speech[0];
var audio_depilate = document.getElementById("cancion");


// Comprobar si el navegador soporta la API de reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Tu navegador no soporta la API de reconocimiento de voz");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false; // Solo queremos resultados finales

    // Variable para evitar múltiples llamadas a `start`
    let isRecognizing = false;

    // Evento que se activa cuando se recibe una transcripción
    recognition.onresult = (event) => {
        // Obtener el último resultado
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toUpperCase();
        // Imprimir la transcripción para depuración
        console.log("Transcripción recibida: ", transcript);

        // GIRAR LA RULETA
        if (transcript.includes(girar1) || transcript.includes(girar2) || transcript.includes(girar3) || transcript.includes(girar4) || transcript.includes(girar5)) {
            spin();
            setTimeout(() => {
                spin();
            }, 1000);
            setTimeout(() => {
                spin();
            }, 1500);
            setTimeout(() => {
                spin();
            }, 1600);
            setTimeout(() => {
                spin();
            }, 2200);
            
            // DEPILATE TROLEO
        } else if (transcript.includes("TE AMO") || transcript.includes("DEPILATE") || transcript.includes("DEPÍLATE") || transcript.includes("TEAMO") || transcript.includes("DEPILANTE")) {
            audio_depilate.src = audioSrc_speech;
            audio_depilate.play();

        } else if (includesAny(transcript, phrasesMap[2])) {
            // console.log("frase 2", phrasesMap[2]);   
            document.getElementById("numOptions").value = "2";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[3])) {
            // console.log("frase 3", phrasesMap[3]);   
            document.getElementById("numOptions").value = "3";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[4])) {
            // console.log("frase 4", phrasesMap[4]);   
            document.getElementById("numOptions").value = "4";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[5])) {
            // console.log("frase 5", phrasesMap[5]);
            document.getElementById("numOptions").value = "5";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[6])) {
            // console.log("frase 6", phrasesMap[6]);   
            document.getElementById("numOptions").value = "6";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[7])) {
            // console.log("frase 7", phrasesMap[7]);   
            document.getElementById("numOptions").value = "7";
            updateOptions();
        } else if (includesAny(transcript, phrasesMap[8])) {
            // console.log("frase 8", phrasesMap[8]);   
            document.getElementById("numOptions").value = "8";
            updateOptions();
        }
    };

    // Manejar errores
    // recognition.onerror = (event) => {
    //     console.error('Error de reconocimiento de voz:', event.error);
    //     // Reiniciar el reconocimiento de voz al finalizar
    //     recognition.start();
    // };

    // recognition.onend = () => {
    //     // Reiniciar el reconocimiento de voz al finalizar
    //     recognition.start();
    // };

    // // Iniciar el reconocimiento de voz al cargar la página
    // recognition.start();

    // Manejar errores
    recognition.onerror = (event) => {
        console.error("Error de reconocimiento de voz:", event.error);

        // Reiniciar solo si no está activo
        if (!isRecognizing) {
            recognition.start();
        }
    };

    // Reiniciar el reconocimiento cuando finalice
    recognition.onend = () => {
        isRecognizing = false;

        // Reiniciar el reconocimiento
        recognition.start();
        isRecognizing = true;
    };

    // Iniciar el reconocimiento al cargar la página
    if (!isRecognizing) {
        recognition.start();
        isRecognizing = true;
    }

}

