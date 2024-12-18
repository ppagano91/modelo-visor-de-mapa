import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const envConfig = process.env;

if (!envConfig.VITE_CENTRO_CABA) {
  envConfig.VITE_CENTRO_CABA= "-34.60762631005845, -58.445854986577395"
}

if (!envConfig.VITE_COLOR_BLANCO) {
  envConfig.VITE_COLOR_BLANCO=""
}

if (!envConfig.VITE_COLOR) {
  envConfig.VITE_COLOR = "#007BC7";
}

if(!envConfig.VITE_COLOR_PRIMARY){
  envConfig.VITE_COLOR_PRIMARY="#336ACC"
}

if(!envConfig.VITE_COLOR_SECONDARY){
  envConfig.VITE_COLOR_SECONDARY="#101E37"
}

if(!envConfig.VITE_COLOR_THIRD){
  envConfig.VITE_COLOR_THIRD="#218274"
}

if(!envConfig.VITE_COLOR_LIGHT){
  envConfig.VITE_COLOR_LIGHT="#F3F6F9"
}

// Crear contenido para env.js
const envVariables = Object.keys(envConfig)
  .filter(key => key.startsWith('VITE_'))
  .map(key => `${key}:"${envConfig[key]}",`)
  .join('\n');
const envFileContent = `window.env = {\n${envVariables}\n};`;

// Escribir contenido en public/env.js
fs.writeFileSync('./public/env.js', envFileContent);

