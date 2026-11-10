# Asistente de Archivos Ollama

Extensión de Google Chrome para analizar archivos con inteligencia artificial local mediante Ollama, de forma privada y sin depender de servicios externos.

## Características

- Conexión directa con Ollama.
- Detección automática de modelos instalados.
- Selección de archivos desde el ordenador.
- Sistema de arrastrar y soltar archivos.
- Análisis de documentos de texto.
- Preguntas y respuestas sobre archivos.
- Compatibilidad con imágenes mediante modelos con visión.
- Interfaz moderna con modo oscuro.
- Procesamiento local mediante modelos de inteligencia artificial.

## Formatos compatibles

| Formato | Estado |
|---|---|
| TXT | Compatible |
| MD | Compatible |
| CSV | Compatible |
| JSON | Compatible |
| LOG | Compatible |
| HTML | Compatible |
| XML | Compatible |
| YAML | Compatible |
| PNG | Compatible |
| JPG / JPEG | Compatible |
| WEBP | Compatible |

## Tecnologías utilizadas

- JavaScript
- HTML5
- CSS3
- Chrome Extensions Manifest V3
- Ollama API

## Requisitos

- Windows 10 o Windows 11.
- Google Chrome.
- Ollama instalado.
- Al menos un modelo de inteligencia artificial descargado.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Paablo1903/asistente-archivos-ollama.git
```

### 2. Acceder a la carpeta

```bash
cd asistente-archivos-ollama
```

### 3. Configurar Ollama

El servidor local utiliza por defecto:

```text
http://localhost:11434
```

Para permitir la comunicación con la extensión, configura la variable de entorno en PowerShell:

```powershell
[Environment]::SetEnvironmentVariable(
  "OLLAMA_ORIGINS",
  "chrome-extension://ID-DE-TU-EXTENSION",
  "User"
)
```

Sustituye `ID-DE-TU-EXTENSION` por el identificador de tu extensión de Chrome.

Reinicia Ollama para aplicar los cambios.

### 4. Comprobar Ollama

Consultar los modelos instalados:

```powershell
ollama list
```

Comprobar la API:

```powershell
Invoke-RestMethod http://localhost:11434/api/tags
```

### 5. Instalar la extensión en Chrome

1. Abre `chrome://extensions`.
2. Activa el modo desarrollador.
3. Pulsa "Cargar descomprimida".
4. Selecciona la carpeta del proyecto.
5. Abre la extensión desde Chrome.

## Modelo de inteligencia artificial

Modelo utilizado durante el desarrollo:

```text
qwen3.5:4b
```

Para descargarlo:

```powershell
ollama pull qwen3.5:4b
```

La extensión permite utilizar otros modelos compatibles con Ollama.

## Ejemplos de uso

### Resumen de archivos

Resume este documento y extrae sus conclusiones principales.

### Análisis de información

Identifica los puntos más importantes del archivo.

### Ciberseguridad

Analiza este documento desde el punto de vista de la ciberseguridad.

### Extracción de información

Extrae todas las fechas, nombres y cantidades que aparecen en el archivo.

## Privacidad

Los archivos se procesan desde el navegador y su contenido se envía al servidor local de Ollama para su análisis.

No se necesita una API Key de OpenAI ni una suscripción a servicios externos.

El objetivo del proyecto es ofrecer una experiencia de inteligencia artificial local, privada y accesible desde Chrome.
