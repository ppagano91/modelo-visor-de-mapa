# Visor de Mapa

## Iniciar proyecto

### Elasticsearch
Iniciar el servicio de elasticsearch. 

#### Indices y Documentos

Antes de inicar el proyecto Visor de Mapa, es necesario crear los índices y documentos dentro de Elasticsearch. Utilizando alguna herramienta como Kibana o Postman, se deberán crear los índices y documentos como se detalla en las siguientes secciones.

#### Crear Indice
Desde Postman o alguna otra herramienta se deberá crear el índice "servicios". En este ejemplo, el servicio de elasticsearch se está ejecutando en un host localhost y un puerto 9200:

```bash
    PUT http://localhost:9200/servicios
```

#### Cargar Indices
Desde Postman o alunga otra herramienta, se deberán cargar los documentos de [servicios.json](./servicios.json), en el índice creado anteriormente (servicios). En este ejemplo, el servicio de elasticsearch se está ejecutando en un host localhost y un puerto 9200:


```bash
PUT http://localhost:9200/servicios/_doc/1
```


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