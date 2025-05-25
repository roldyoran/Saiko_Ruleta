# Descripción general

Este programa (`app.py`) automatiza la extracción de información sobre personajes de anime desde una página de Tiermaker usando Selenium y BeautifulSoup. Luego, compara y actualiza estos datos con un archivo local (`original.json`) y guarda el resultado en `anime_list.json`. El script también muestra mensajes de estado en la consola usando colorama para facilitar la visualización de cambios y errores.

## Explicación del código parte por parte

### 1. Importaciones
```python
from selenium import webdriver
from bs4 import BeautifulSoup
from colorama import Fore, Style
import re
import json
```
Se importan las librerías necesarias para la automatización web, el análisis de HTML, la coloración de la consola, el manejo de expresiones regulares y la manipulación de archivos JSON.

### 2. Inicialización del navegador y obtención de la página
```python
driver = webdriver.Chrome()
url = "https://tiermaker.com/create/animes-random-saikomic-16203118"
driver.get(url)
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')
```
Se abre el navegador Chrome, se accede a la URL de Tiermaker y se obtiene el HTML de la página para analizarlo con BeautifulSoup.

### 3. Extracción de personajes
```python
characteres = soup.find_all('div', class_="character")
data = []
```
Se buscan todos los elementos HTML que representan personajes y se inicializa una lista para almacenar los datos extraídos.

### 4. Procesamiento de cada personaje
```python
for cua in characteres:
    # ...
```
Para cada personaje, se extrae la URL de la imagen y el nombre usando expresiones regulares. Se limpia el nombre eliminando la palabra "latino" y se crea un diccionario con el nombre, id y url de la imagen.

### 5. Carga y comparación con datos originales
```python
try:
    with open('original.json', 'r', encoding='utf-8') as original_file:
        original_data = json.load(original_file)
        # ...
```
Se intenta cargar el archivo `original.json`. Si existe, se compara cada personaje extraído con los datos originales para actualizar la nota, la URL o el nombre si han cambiado. Se muestran mensajes de color en la consola para cada actualización.

### 6. Manejo de errores
```python
except FileNotFoundError:
    print(Fore.RED + '\nArchivo original.json no encontrado' + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f'\nError al procesar original.json: {str(e)}' + Style.RESET_ALL)
```
Si no se encuentra el archivo o hay un error al procesarlo, se muestra un mensaje de error en rojo.

### 7. Guardado de resultados
```python
with open('anime_list.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
    print('\nCantidad de Animes: ',len(characteres))
    print(Style.BRIGHT + Fore.GREEN + '*--> Datos Guardados Correctamente <--*' + '\n')
```
Se guardan los datos actualizados en `anime_list.json` y se muestra un mensaje de éxito.

### 8. Código comentado para impresión
```python
# for character in data:
#     print(Fore.GREEN + "NOMBRE: ", character["nombre"])
#     print(Fore.MAGENTA + 'ID: ' + character["id"])
#     print(Fore.CYAN + 'URL: ' + character["url"])
#     print('')
```
Este bloque, actualmente comentado, serviría para imprimir en consola los datos extraídos de cada personaje.