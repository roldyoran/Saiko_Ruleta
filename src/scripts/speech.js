if (annyang) {
    // Función para eliminar tildes
    function eliminarTildes(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Definir comandos
    const commands = {
        // Comandos para girar la ruleta
        'giralo': () => spinRuleta(),
        'miralo': () => spinRuleta(),
        'tiralo': () => spinRuleta(),

        // Comandos para el troleo "depilate"
        'te amo': () => playAudio('depilate.mp3'),
        'depilate': () => playAudio('depilate.mp3'),

        // Comando para actualizar opciones
        'actualizalo': actualizarOpciones,
        'actualiza': actualizarOpciones,
    };

    function actualizarOpciones() {
        const transcription = eliminarTildes(phrases[0].toLowerCase());
        const numeros = {
            'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
            'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9,
            'diez': 10, 'once': 11, 'doce': 12, 'trece': 13,
            'catorce': 14, 'quince': 15, 'dieciseis': 16,
            'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
            'veinte': 20, 'veintiuno': 21, 'veintidos': 22,
            'veintitres': 23, 'veinticuatro': 24, 'veinticinco': 25,
            'veintiseis': 26, 'veintisiete': 27, 'veintiocho': 28,
            'veintinueve': 29, 'treinta': 30, 'treinta y uno': 31,
            'treinta y dos': 32, 'treinta y tres': 33,
            'treinta y cuatro': 34, 'treinta y cinco': 35,
            'treinta y seis': 36, 'treinta y siete': 37,
            'treinta y ocho': 38, 'treinta y nueve': 39,
            'cuarenta': 40, 'cuarenta y uno': 41,
            'cuarenta y dos': 42, 'cuarenta y tres': 43,
            'cuarenta y cuatro': 44
        };                                                           
        
        // Buscar números escritos
        for (const [palabra, numero] of Object.entries(numeros)) {
            if (transcription.includes(palabra)) {
                updateOptions(numero);
                return;
            }
        }
        
        // Buscar números en dígitos
        const numeroDigito = transcription.match(/\b([2-9]|[1-3][0-9]|4[0-4])\b/);
        if (numeroDigito) {
            const num = parseInt(numeroDigito[0]);
            if (num >= 2 && num <= 44) {
                updateOptions(num);
            }
        }
    }

    // Añadir comandos y empezar
    annyang.addCommands(commands);
    annyang.setLanguage('es-ES');
    
    // Variable global para almacenar la última transcripción
    let phrases = [];

    // Agregar evento para mostrar la transcripción y ejecutar comandos
    annyang.addCallback('result', function(currentPhrases) {
        phrases = currentPhrases;
        const transcription = eliminarTildes(phrases[0].toLowerCase());
        console.log('Transcripción:', transcription);

        // Revisar si la transcripción contiene alguno de los comandos
        for (const [command, action] of Object.entries(commands)) {
            if (transcription.includes(eliminarTildes(command.toLowerCase()))) {
                console.log('Comando detectado:', command);
                action();
                break; // Ejecutar solo el primer comando que coincida
            }
        }
    });
    
    annyang.start();
    console.log("Comandos de voz activados");

    // Funciones auxiliares
    function spinRuleta() {
        window.dispatchEvent(new CustomEvent('ruleta-spin'));
        setTimeout(() => window.dispatchEvent(new CustomEvent('ruleta-spin')), 1200);
        setTimeout(() => window.dispatchEvent(new CustomEvent('ruleta-spin')), 1500);
        setTimeout(() => window.dispatchEvent(new CustomEvent('ruleta-spin')), 1900);
        setTimeout(() => window.dispatchEvent(new CustomEvent('ruleta-spin')), 2200);
    }

    function playAudio(audioFile) {
        window.dispatchEvent(new CustomEvent('ruleta-play-audio', { detail: audioFile }));
    }

    function updateOptions(num) {
        window.dispatchEvent(new CustomEvent('ruleta-update-options', { detail: num }));
    }
} else {
    alert("El reconocimiento de voz no es compatible con tu navegador.");
}