# Visor de Mapa

## Iniciar proyecto

### Elasticsearch
Agregar las siguientes líneas al final del archivo **elasticsearch.yml** ubicado en el directorio, donde se haya instalado elasticsearch, llamado config/:

```bash
http.cors.enabled: true
http.cors.allow-origin: "*"
```

Iniciar el servicio de elasticsearch. 

#### Indices y Documentos

Antes de inicar el proyecto Visor de Mapa, es necesario crear los índices y documentos dentro de Elasticsearch. Utilizando alguna herramienta como Kibana o Postman, se deberán crear los índices y documentos como se detalla en las siguientes secciones.

#### Crear Indice
Desde Postman, o alguna otra herramienta, se deberá crear el índice "services_map". En este ejemplo se crea el índice **services_map**:

```bash
    PUT https://callejero-unico-elasticsearch-dev.gcba.gob.ar/services_map
```

#### Cargar Varios Documentos al Indice
Desde Postman o alunga otra herramienta, se deberán cargar los documentos de [servicios.json](./servicios.json), en el índice creado anteriormente (services_map). Con la siguiente query se debería agregar todos los documentos dentro del índice **services_map**

Consideraciones a tener en cuenta:

- Headers: agregar `Content-Type: application/x-ndjson`
- Body: Seleccionar raw-JSON y copiar el contenido del archivo [agregar_documentos.json](./source/es-json/agregar_documentos.json)
- Ejecutar la siguiente petición de tipo POST:

```bash
    POST https://callejero-unico-elasticsearch-dev.gcba.gob.ar/services_map/_bulk
```

#### Cargar un elemento a un Documento específico
Desde Postman o alunga otra herramienta, se puede agregar un elemento a un Documento específico según su ID. A continuación, se explica como agregar un elemento a una determinada sección.

El siguiente ejemplo muestra como agregar un elemento a la sección de Urbanismo, para ello es necesario tener el id del documento (para el caso de Urbanismo es QxQ14ZABGvSghuUxmLIA).

Consideraciones a tener en cuenta:
- Verificar si el ID es correcto y corresponde al Docuemento que queremos editar.
- Body: Seleccionar raw-JSON y copiar el contenido del archivo [agregar_elemento.json](./source/es-json/agregar_elemento.json). **Observar detalladamente el script**.
- Ejecutar la siguiente petición de tipo POST:

```bash
POST https://callejero-unico-elasticsearch-dev.gcba.gob.ar/services_map/_update/QxQ14ZABGvSghuUxmLIA
```

El script "agregar_elemento.json", tiene la estructura para agregar un elemento al documento de Urbanismo. Para agregar un elemento a otro Docuemnto (Transporte, Servicios, Salud, etc), es necesario reemplazar "urbanismo" por el documento que se requiera editar (ejemplo "transporte"). Luego, se debe especificar los atributos del nuevo elemento (**id**, name, layerProps, etc). En caso de no tener información para layerProps colocar "null". Es **Importante** especificar el ID del elemento.

#### Eliminar un elemento de un Documento específico
Desde Postman o alunga otra herramienta, se puede eliminar un elemento de un Documento específico según su ID. El siguiente ejemplo muestra como eliminar un elemento a la sección de Urbanismo, para ello es necesario tener el ID del documento (para el caso de Urbanismo es QxQ14ZABGvSghuUxmLIA).

Consideraciones a tener en cuenta:
- Verificar si el ID es correcto y corresponde al Docuemento que queremos editar.
- Determinar y verificar el ID del elemento que se desea eliminar.
- Body: Seleccionar raw-JSON y copiar el contenido del archivo [eliminar_elemento.json](./source/es-json/eliminar_elemento.json). **Observar detalladamente el script**.
- Ejecutar la siguiente petición de tipo POST:


```bash
POST https://callejero-unico-elasticsearch-dev.gcba.gob.ar/services_map/_update/QxQ14ZABGvSghuUxmLIA
```

El script "eliminar_elemento.json", tiene la estructura para eliminar un elemento del documento de Urbanismo. Para eliminar un elemento de otro Docuemnto (Transporte, Servicios, Salud, etc), es necesario reemplazar "urbanismo" por el documento que se requiera editar (ejemplo "transporte"). Luego, en el atributo params se debe especificar el ID del **elemento** a eliminar.


### Iniciar Proyecto de Visor de Mapa


Instalar dependencias

```npm install```

Levantar Proyecto

```npm run dev```

## Generar Key para formulario
Pasos necesarios para habilitar la validación por reCaptcha

 - Ingresar a [reCaptcha](https://www.google.com/recaptcha/admin/create)
 - Identificar el captcha con un nombre:
     ![alt text](public/image.png)

- Elegir el tipo de captcha:
    ![alt text](public/image2.png)

- Agregar el **nombre del dominio** sin protocolos, puertos, etc:
    ![alt text](public/image3.png)

- Hacer click en el botón Enviar.

- Se generarán dos claves. Seleccionar la opción "Copiar **Clave de Stio**". En un archivo .env como el del ejemplo [.env.example](.env.example) pegar el valor de la **Clave de Sitio** en la variable de entorno VITE_CAPTCHA_KEY

## Variables de entorno
Agregar las siguientes variables de entorno a un archivo .env como se muestra en el ejemplo ([.env.example](.env.example)):

- VITE_MAPA_BASE="https://geoserver.buenosaires.gob.ar/geoserver/mapa_base_prod/wms"
- VITE_MAPA_SATELITAL="https://servicios.usig.buenosaires.gob.ar/mapcache/tms/1.0.0/fotografias_aereas_2021_caba_3857@GoogleMapsCompatible/{z}/{x}/{y}.png"
- VITE_SERVICIOS_MAPA="https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms?"

## Build

Para hacer el *build* del proyecto se debe correr el siguiente comando:
```
npm run build
```

Una vez realizado el *build* se generará un archivo env.js en la carpeta [dist](./dist/). Este archivo contendrá las variables de entorno que podrán ser editadas una vez hecho el *deploy* de la aplicación.