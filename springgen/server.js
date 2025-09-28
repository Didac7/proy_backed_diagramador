const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const springgen = require('./index');

const app = express();
app.use(cors());

// Configuración de Multer para recibir archivos
const upload = multer({ dest: 'uploads/' });

// Endpoint para generación Spring Boot
app.post('/generate', upload.single('sqlFile'), async (req, res) => {
  try {
    const sqlFilePath = req.file.path;
    const folderName = req.body.folderName;
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    // Lógica de generación (adaptar según tu función en springgen/index.js)
    // Aquí deberías mover la lógica de generación a una función exportada en index.js
    if (typeof springgen.generarProyecto !== 'function') {
      return res.status(500).json({ error: 'No se encontró la función generadora en springgen/index.js' });
    }
    await springgen.generarProyecto(sql, folderName);

    // Elimina el archivo subido
    fs.unlinkSync(sqlFilePath);
    res.json({ message: 'Proyecto generado correctamente', folder: folderName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Generador Spring Boot escuchando en http://localhost:${PORT}`);
});
