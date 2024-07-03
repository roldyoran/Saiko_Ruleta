// Función para cargar el JSON
async function loadJson() {
    const response = await fetch('../public/characters.json');
    const data = await response.json();
    return data;
}

// Función para cargar un grupo de personajes en el contenedor
function loadGroup(groupName, dataJson) {
    const group = dataJson.groups[groupName];
    if (!group) {
        console.error('Group not found:', groupName);
        return;
    }

    
    const container = document.getElementById('character-container');
    container.innerHTML = '';
    
    const img1 = document.createElement('img');
    img1.src = group.gira.src;
    img1.id = group.gira.id;
    img1.className = group.gira.class;
    img1.alt = group.gira.alt;

    const img2 = document.createElement('img');
    img2.src = group.complementa.src;
    img2.id = group.complementa.id;
    img2.className = group.complementa.class;
    img2.alt = group.complementa.alt;

    container.appendChild(img1);
    container.appendChild(img2);
}

// Cargar el JSON y luego un grupo específico
loadJson().then(dataJson => {
    loadGroup('group1', dataJson);

    // Puedes cambiar a otro grupo llamando a la función con el nombre del grupo
    // loadGroup('group2', dataJson);
});
