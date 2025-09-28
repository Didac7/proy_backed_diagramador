
import React, { useState } from 'react';

function App() {
  const [sqlFile, setSqlFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [genStatus, setGenStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenSubmit = async (e) => {
    e.preventDefault();
    if (!sqlFile || !folderName) {
      setGenStatus('Debes seleccionar un archivo SQL y un nombre de carpeta.');
      return;
    }
    setIsLoading(true);
    setGenStatus('');
    const formData = new FormData();
    formData.append('sqlFile', sqlFile);
    formData.append('folderName', folderName);
    try {
      const res = await fetch('http://localhost:3002/generate', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setGenStatus('✅ Proyecto generado en: ' + data.folder);
      } else {
        setGenStatus('❌ Error: ' + (data.error || 'Error desconocido.'));
      }
    } catch (err) {
      setGenStatus('❌ Error de conexión con el backend.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#18181b', color: '#fff' }}>
      <section style={{ background: '#23232a', borderRadius: 12, padding: 40, minWidth: 380, maxWidth: 420, width: '100%', boxShadow: '0 4px 32px #000a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#a5b4fc', marginBottom: 32, textAlign: 'center', fontSize: 28, fontWeight: 700 }}>Generador Spring Boot (desde SQL)</h2>
        <form onSubmit={handleGenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          <label style={{ color: '#fff', fontWeight: 500 }}>Archivo SQL:</label>
          <input type="file" accept=".sql" onChange={e => setSqlFile(e.target.files[0])} style={{ background: '#18181b', color: '#fff', border: 'none', borderRadius: 6, padding: 10 }} />
          <label style={{ color: '#fff', fontWeight: 500 }}>Nombre de la carpeta destino:</label>
          <input type="text" value={folderName} onChange={e => setFolderName(e.target.value)} placeholder="ej: backend-hospital" style={{ background: '#18181b', color: '#fff', border: 'none', borderRadius: 6, padding: 10 }} />
          <button type="submit" disabled={isLoading} style={{ background: '#a5b4fc', color: '#23232a', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}>{isLoading ? 'Generando...' : 'Generar backend'}</button>
        </form>
        {genStatus && <div style={{ marginTop: 20, color: genStatus.startsWith('✅') ? '#22c55e' : '#f87171', fontWeight: 600 }}>{genStatus}</div>}
      </section>
    </div>
  );
}

export default App;
