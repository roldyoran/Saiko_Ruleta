import json

# Ruta al archivo JSON
archivo_json = 'anime_list.json'

# Abrir y cargar el archivo JSON
with open(archivo_json, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Contar la cantidad de elementos en el JSON
count = len(data)

print(f"El JSON contiene {count} elementos.")
