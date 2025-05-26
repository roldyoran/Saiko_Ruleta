# roldyoran
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import print as rprint

# Inicializar la consola Rich
console = Console()

async def main():
    async with async_playwright() as playwright:
        # Configurar el navegador para evadir la detección de bots
        browser = await playwright.chromium.launch(
            headless=True,  # Navegador invisible (headless)
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            ]
        )
        
        # Crear un contexto con configuraciones adicionales
        browser_context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            java_script_enabled=True,
            # Configuraciones adicionales para evadir detección en modo headless
            extra_http_headers={
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        )
        
        # Crear una página con el contexto configurado
        page = await browser_context.new_page()
        
        # Configurar interceptor para evitar detección
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            // Ocultar que estamos en modo headless
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['es-ES', 'es', 'en-US', 'en'],
            });
        """)
        
        target_url = "https://tiermaker.com/create/animes-random-saikomic-16203118"
        
        # Panel de inicio
        console.print(Panel.fit("[bold cyan]Iniciando proceso de scraping de animes[/]", 
                               border_style="cyan", title="[white]Saiko Ruleta[/]", 
                               subtitle="[white]Script de Anime List[/]\n"))
        
        # Usar Progress para mostrar el progreso de navegación
        with Progress(
            SpinnerColumn(),
            TextColumn("[bold blue]{task.description}[/]"),
            console=console
        ) as progress:
            navigation_task = progress.add_task("[cyan]Navegando a la página...", total=1)
            
            try:
                # Usar load en lugar de networkidle y aumentar el timeout
                await page.goto(target_url, wait_until='load', timeout=60000)  # 60 segundos de timeout
                progress.update(navigation_task, completed=1)
                console.print("[bold green]✓[/] Página cargada inicialmente")
                
                # Esperar a que la página cargue completamente
                loading_task = progress.add_task("[cyan]Esperando a que la página cargue completamente...", total=1)
                await page.wait_for_timeout(12000)  # Esperar 10 segundos
                progress.update(loading_task, completed=1)
                
                # Intentar esperar a que aparezcan los elementos que necesitamos
                try:
                    element_task = progress.add_task("[cyan]Esperando a que aparezcan los elementos 'character'...", total=1)
                    await page.wait_for_selector('div.character', timeout=16000)  # 15 segundos para encontrar elementos
                    progress.update(element_task, completed=1)
                    console.print("[bold green]✓[/] Elementos 'character' encontrados")
                except Exception as element_error:
                    progress.update(element_task, completed=1)
                    console.print(f"[yellow]⚠ No se encontraron elementos 'character' automáticamente: {str(element_error)}[/]")
                    console.print("[yellow]⚠ Continuando con el proceso...[/]")
                
                # Obtener el HTML de la página
                page_html = await page.content()
                
                # Verificar si estamos en la página correcta o en una página de Cloudflare
                if "Just a moment..." in page_html or "Checking your browser" in page_html:
                    cloudflare_task = progress.add_task("[red]Detectada página de Cloudflare. Esperando más tiempo...", total=1)
                    # Esperar más tiempo para pasar la verificación de Cloudflare
                    await page.wait_for_timeout(20000)  # Esperar 20 segundos más
                    page_html = await page.content()
                    progress.update(cloudflare_task, completed=1)
                
            except Exception as navigation_error:
                console.print(f"[bold red]✗ Error al navegar a la página:[/] {str(navigation_error)}")
                # Intentar capturar una captura de pantalla para diagnóstico
                try:
                    await page.screenshot(path="error_screenshot.png")
                    console.print("[yellow]⚠ Se ha guardado una captura de pantalla en 'error_screenshot.png'[/]")
                except:
                    console.print("[bold red]✗ No se pudo guardar la captura de pantalla[/]")
                await browser.close()
                return
        
        await browser.close()
        
        soup = BeautifulSoup(page_html, 'html.parser')
        
        anime_elements = soup.find_all('div', class_="character")
        anime_data_list = []
        
        if not anime_elements:
            console.print(Panel.fit(
                "[bold red]No se encontraron elementos 'character' en la página.[/]\n[yellow]Posible problema de acceso o detección de Cloudflare.[/]", 
                title="[red]Error de Scraping[/]", 
                border_style="red"
            ))
            console.print("[yellow]Contenido HTML parcial:[/]")
            console.print(Panel(page_html[:500] + "...", title="[yellow]HTML Parcial[/]", border_style="yellow"))
            return
        
        # Crear un panel con información sobre los elementos encontrados
        console.print(Panel.fit(
            f"[bold green]Se encontraron {len(anime_elements)} elementos 'character'[/]", 
            title="[green]Éxito[/]", 
            border_style="green"
        ))
        
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
        
        # Cargar datos del archivo original.json
        console.print("\n[bold cyan]Procesando datos de animes...[/]")
        
        # Crear tablas para mostrar las actualizaciones
        updated_table = Table(title="Animes Actualizados", show_header=True, header_style="bold magenta")
        updated_table.add_column("ID", style="cyan", justify="center")
        updated_table.add_column("Nombre", style="green")
        updated_table.add_column("Tipo", style="yellow")
        updated_table.add_column("Valor", style="blue")
        
        added_table = Table(title="\nAnimes Agregados", show_header=True, header_style="bold magenta")
        added_table.add_column("ID", style="cyan", justify="center")
        added_table.add_column("Nombre", style="green")
        
        try:
            with Progress(
                SpinnerColumn(),
                TextColumn("[bold blue]{task.description}[/]"),
                console=console
            ) as progress:
                json_task = progress.add_task("[cyan]Cargando archivo original.json...", total=1)
                
                with open('original.json', 'r', encoding='utf-8') as original_file:
                    original_anime_data = json.load(original_file)
                    progress.update(json_task, completed=1)
                    
                    # Crear un diccionario para búsqueda rápida por ID
                    original_anime_dict = {item['id']: item for item in original_anime_data}
                    
                    # Actualizar datos desde el archivo original
                    update_task = progress.add_task("[cyan]Actualizando datos de animes...", total=len(anime_data_list))
                    
                    for anime in anime_data_list:
                        if anime['id'] in original_anime_dict:
                            original_anime = original_anime_dict[anime['id']]
                            # Actualizar nota si existe en el original
                            if 'nota' in original_anime:
                                anime['nota'] = original_anime['nota']
                                updated_table.add_row(anime['id'], anime['nombre'], "Nota", anime['nota'])
                            # Actualizar URL si es diferente
                            if original_anime['url'] != anime['url']:
                                anime['url'] = original_anime['url']
                                updated_table.add_row(anime['id'], anime['nombre'], "URL", "Actualizada")
                            # Actualizar Nombre si es diferente
                            if original_anime['nombre'] != anime['nombre']:
                                anime['nombre'] = original_anime['nombre']
                                updated_table.add_row(anime['id'], anime['nombre'], "Nombre", anime['nombre'])
                        progress.update(update_task, advance=1)
                    
                    # Agregar animes que están en original.json pero no en data
                    add_task = progress.add_task("[cyan]Agregando animes faltantes...", total=len(original_anime_data))
                    scraped_anime_ids = {anime['id'] for anime in anime_data_list}
                    
                    for original_anime_entry in original_anime_data:
                        if original_anime_entry['id'] not in scraped_anime_ids:
                            anime_data_list.append(original_anime_entry)
                            added_table.add_row(original_anime_entry['id'], original_anime_entry['nombre'])
                        progress.update(add_task, advance=1)
            
            # Mostrar tablas de resultados si hay datos
            if updated_table.row_count > 0:
                console.print(updated_table)
            else:
                console.print("[yellow]No se actualizó ningún anime existente[/]")
                
            if added_table.row_count > 0:
                console.print(added_table)
            else:
                console.print("[yellow]No se agregó ningún anime nuevo[/]")
                
        except FileNotFoundError:
            console.print(Panel.fit(
                "[bold red]Archivo original.json no encontrado[/]", 
                title="[red]Error[/]", 
                border_style="red"
            ))
        except Exception as json_error:
            console.print(Panel.fit(
                f"[bold red]Error al procesar original.json:[/]\n{str(json_error)}", 
                title="[red]Error JSON[/]", 
                border_style="red"
            ))
        
        # Guardar los datos actualizados en un archivo JSON
        with Progress(
            SpinnerColumn(),
            TextColumn("[bold blue]{task.description}[/]"),
            console=console
        ) as progress:
            save_task = progress.add_task("[cyan]Guardando datos en anime_list.json...", total=1)
            
            with open('anime_list.json', 'w') as json_file:
                json.dump(anime_data_list, json_file, indent=4)
                progress.update(save_task, completed=1)
        
        # Crear tabla de resumen
        summary_table = Table(title="\nResumen de la Operación", show_header=True, header_style="bold magenta")
        summary_table.add_column("Métrica", style="cyan")
        summary_table.add_column("Valor", style="green", justify="right")
        
        summary_table.add_row("Total de animes encontrados", str(len(anime_elements)))
        summary_table.add_row("Total de animes en JSON", str(len(anime_data_list)))
        summary_table.add_row("Animes actualizados", str(updated_table.row_count))
        summary_table.add_row("Animes agregados", str(added_table.row_count))
        
        console.print(summary_table)
        
        # Panel de finalización
        console.print(Panel.fit(
            "\n\n[bold green]Datos Guardados Correctamente en el archivo: anime_list.json[/]", 
            title="[green]Proceso Completado[/]\n\n",
            border_style="green"
        ))

# Ejecutar la función asíncrona principal
if __name__ == "__main__":
    asyncio.run(main())
    