import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const envConfig = process.env;

if (!envConfig.VITE_COLOR) {
  envConfig.VITE_COLOR = "#007BC7";
}

if (!envConfig.VITE_CENTRO_CABA) {
  envConfig.VITE_CENTRO_CABA= "-34.60762631005845, -58.445854986577395"
}

// Crear contenido para env.js
const envVariables = Object.keys(envConfig)
  .filter(key => key.startsWith('VITE_'))
  .map(key => `${key}:"${envConfig[key]}",`)
  .join('\n');
const envFileContent = `window.env = {\n${envVariables}\n};`;

// Escribir contenido en public/env.js
fs.writeFileSync('./public/env.js', envFileContent);

