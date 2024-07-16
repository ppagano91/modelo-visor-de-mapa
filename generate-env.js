import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const envConfig = process.env;

// Crear contenido para env.js
const envVariables = Object.keys(envConfig)
  .filter(key => key.startsWith('VITE_'))
  .map(key => `${key}:"${envConfig[key]}",`)
  .join('\n');
const envFileContent = `window.env = {\n${envVariables}\n};`;

// Escribir contenido en public/env.js
fs.writeFileSync('./public/env.js', envFileContent);

