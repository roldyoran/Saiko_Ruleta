import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json

async def fetch_page_content(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True, 
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            ])
        page = await browser.new_page()
        await page.goto(url, wait_until="load")  # 16 segundos
        await page.wait_for_timeout(12000)  # Esperar 10 segundos
        await page.wait_for_selector('div.character', timeout=16000)  # 16 segundos
        content = await page.content()
        await browser.close()
    return content


def extract_data(content):
    soup = BeautifulSoup(content, 'html.parser')

    # Extracting the main content characters
    anime_elements = soup.find_all('div', class_="character")
    anime_data_list = []

    if not anime_elements:
        return anime_data_list
    
    for anime_element in anime_elements:
        # Obtener la URL de la Imagen
        background_style = anime_element.attrs['style']
    
        # Declaramos los Patrones para obtener la url y el nombre
        url_pattern = r'url\("([^"]+)"\)'
        name_pattern = r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\-185'
        name_pattern_fallback = r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\.png'
    
        # Buscamos la URL
        url_match = re.search(url_pattern, background_style)
        if url_match:
            image_url = url_match.group(1)
            # Buscar el Nombre dentro de la URL
            name_match = re.search(name_pattern, str(image_url))
            # Si el patrón no coincide accede a uno de emergencia
            name_match_fallback = re.search(name_pattern_fallback, str(image_url))
            anime_name = ""
            if name_match:
                anime_name = name_match.group(1)
            elif name_match_fallback:
                anime_name = name_match_fallback.group(1)
    
            # Eliminamos la palabra latino del nombre
            anime_name = anime_name.replace("latino", "")
            
            # Crear un diccionario con los datos extraídos
            anime_entry = {
                "nombre": anime_name,
                "id": anime_element.attrs['id'],
                "url": image_url
            }
            # Añadir el diccionario a la lista
            anime_data_list.append(anime_entry)
        

    return anime_data_list


def compare_anime_data(anime_data_list, filename):
    with open(filename, 'r', encoding='utf-8') as original_file:
        # Cargar los datos existentes del archivo JSON
        original_anime_data = json.load(original_file)
    
        # Crear un diccionario para búsqueda rápida por ID
        original_anime_dict = {item['id']: item for item in original_anime_data}
                    
        for anime in anime_data_list:
            if anime['id'] in original_anime_dict:
                original_anime = original_anime_dict[anime['id']]
                # Comparar y actualizar los campos necesarios
                # Si el campo 'nota' existe en el original, lo actualizamos
                if "nota" in original_anime:
                    anime['nota'] = original_anime['nota']
                # Si el campo 'url' o 'nombre' es diferente, lo actualizamos
                if original_anime["url"] != anime["url"]:
                    anime['url'] = original_anime['url']
                # Si el nombre es diferente, lo actualizamos
                if original_anime["nombre"] != anime["nombre"]:
                    anime['nombre'] = original_anime['nombre']

        
        # Mover un anime con id especifico a la posicion de otro anime con id especifico, codigo:
        SPECIFIC_ID = "458"
        TARGET_ID = "225"
        # busqueda en el diccionario
        specific_anime = next((anime for anime in anime_data_list if anime['id'] == SPECIFIC_ID), None)
        target_anime = next((anime for anime in anime_data_list if anime['id'] == TARGET_ID), None)
        # Si ambos animes existen, mover el específico a la posición del objetivo
        if specific_anime and target_anime:
            # Eliminar el anime específico de su posición actual
            anime_data_list.remove(specific_anime)
            # Encontrar la posición del anime objetivo
            target_index = anime_data_list.index(target_anime)
            # Insertar el anime específico en la posición del anime objetivo
            anime_data_list.insert(target_index, specific_anime)
            # Mover el target anime a la posición del específico
            anime_data_list.remove(target_anime)
            anime_data_list.append(target_anime)
        
        # Añadir los animes que no están en la lista scrapeada
        scraped_anime_ids = {anime['id'] for anime in anime_data_list}
        for original_anime_entry in original_anime_data:
                if original_anime_entry['id'] not in scraped_anime_ids:
                    anime_data_list.append(original_anime_entry) 
        
        
    return anime_data_list
    

def save_to_json(anime_data_list, filename):
    with open(filename, 'w', encoding='utf-8') as json_file:
        # Guardar los datos en el archivo JSON
        json.dump(anime_data_list, json_file, indent=4, ensure_ascii=False)

async def main():
    URL = "https://tiermaker.com/create/animes-random-saikomic-16203118"
    content = await fetch_page_content(URL)
    anime_data_list = extract_data(content)

    # Compara los datos extraídos con los del archivo original
    updated_anime_data = compare_anime_data(anime_data_list, 'original.json')
    # Guardar los datos actualizados en un nuevo archivo JSON
    save_to_json(updated_anime_data, 'animes_updated.json')

    # imprimir mensaje de éxito
    print("Datos extraídos y guardados en 'animes_updated.json'.")

if __name__ == "__main__":
    asyncio.run(main())