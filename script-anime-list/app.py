# roldyoran
from selenium import webdriver
from bs4 import BeautifulSoup
from colorama import Fore, Style
import re
import json

driver = webdriver.Chrome()

url = "https://tiermaker.com/create/animes-random-saikomic-16203118"

driver.get(url)

html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

characteres = soup.find_all('div', class_="character")
data = []


for cua in characteres:
    # Obtener la URL de la Imagen
    back_img = cua.attrs['style']

    # Declaramos los Patrones para obtener la url y en nombre
    pattern_url =  r'url\("([^"]+)"\)'
    pattern_name =  r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\-185'
    pattern_name_emerg =  r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\.png'

    # Buscamos la URL
    match = re.search(pattern_url, back_img)
    if match:
        url = match.group(1)
        # Buscar el Nombre dentro de la URL
        mach_2 = re.search(pattern_name, str(url))
        # Si la el patron no coincide accede a uno de emergencia
        mach_emergence = re.search(pattern_name_emerg, str(url))
        nombre = ""
        if mach_2:
            nombre = mach_2.group(1)
        elif mach_emergence:
            nombre = mach_emergence.group(1)

        # Eliminamos la palabra latino del nombre
        nombre = nombre.replace("latino", "")
        
        # Crear un diccionario con los datos extraídos
        character_data = {
            "nombre": nombre,
            "id": cua.attrs['id'],
            "url": url
        }
        # Añadir el diccionario a la lista
        data.append(character_data)


# Cargar datos del archivo original.json
try:
    with open('original.json', 'r', encoding='utf-8') as original_file:
        original_data = json.load(original_file)
        
        # Crear un diccionario para búsqueda rápida por ID
        original_dict = {item['id']: item for item in original_data}
        
        # Actualizar datos desde el archivo original
        for anime in data:
            if anime['id'] in original_dict:
                original_anime = original_dict[anime['id']]
                
                # Actualizar nota si existe en el original
                if 'nota' in original_anime:
                    anime['nota'] = original_anime['nota']
                    print(Fore.YELLOW + f'Nota actualizada para ID {anime["id"]}: {anime["nota"]}' + Style.RESET_ALL)
                
                # Actualizar URL si es diferente
                if original_anime['url'] != anime['url']:
                    anime['url'] = original_anime['url']
                    print(Fore.BLUE + f'URL actualizada para ID {anime["id"]}' + Style.RESET_ALL)
                
                # Actualizar nombre si la URL original contiene 'img'
                if 'img' in original_anime['nombre'].lower():
                    anime['nombre'] = original_anime['nombre']
                    print(Fore.GREEN + f'Nombre actualizado para ID {anime["id"]}: {anime["nombre"]}' + Style.RESET_ALL)

except FileNotFoundError:
    print(Fore.RED + '\nArchivo original.json no encontrado' + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f'\nError al procesar original.json: {str(e)}' + Style.RESET_ALL)

# Guardar los datos actualizados en un archivo JSON
with open('anime_list.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
    print('\nCantidad de Animes: ',len(characteres))
    print(Style.BRIGHT + Fore.GREEN + '*--> Datos Guardados Correctamente <--*' + '\n')


# # Imprimir los datos extraídos
# for character in data:
#     print(Fore.GREEN + "NOMBRE: ", character["nombre"])
#     print(Fore.MAGENTA + 'ID: ' + character["id"])
#     print(Fore.CYAN + 'URL: ' + character["url"])
#     print('')
    