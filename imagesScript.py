from pathlib import Path
from PIL import Image

# Constante para indicar el porcentaje de calidad (0 a 100)
CALIDAD_WEBP = 80

def convertir_png_a_webp(ruta_carpeta):
    """
    Busca todas las imágenes PNG en el directorio especificado 
    y genera una copia en formato WebP con la calidad definida.
    """
    carpeta = Path(ruta_carpeta)
    
    # Validación del directorio
    if not carpeta.is_dir():
        print(f"Error: La ruta '{ruta_carpeta}' no existe o no es una carpeta.")
        return

    # Iteración sobre los archivos .png (no es sensible a mayúsculas en Windows, pero en Linux/macOS sí. Se usa un enfoque estándar).
    archivos_procesados = 0
    for archivo_png in carpeta.glob('*.[pP][nN][gG]'):
        ruta_webp = archivo_png.with_suffix('.webp')
        
        try:
            with Image.open(archivo_png) as img:
                # Se guarda la imagen aplicando la constante de calidad
                img.save(ruta_webp, format="webp", quality=CALIDAD_WEBP)
            print(f"Éxito: {archivo_png.name} -> {ruta_webp.name}")
            archivos_procesados += 1
            
        except Exception as e:
            print(f"Fallo al procesar {archivo_png.name}: {e}")

    print(f"\nProceso finalizado. Total de imágenes convertidas: {archivos_procesados}")

# Ejecución del código
if __name__ == "__main__":
    # Sustituye el valor por la ruta absoluta o relativa de tu carpeta
    directorio_imagenes = "./client/src/assets/map/" 
    
    convertir_png_a_webp(directorio_imagenes)