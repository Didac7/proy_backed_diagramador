import React, { useState } from 'react';

export default function GeneradorSpringBoot() {
  const [sqlFile, setSqlFile] = useState(null);
  const [projectDir, setProjectDir] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sqlFile || !projectDir) {
      setMsg('Por favor selecciona un archivo SQL y un nombre de carpeta.');
      return;
    }
    setLoading(true);
    setMsg('Generando...');
    const data = new FormData();
    data.append('sqlFile', sqlFile);
    data.append('projectDir', projectDir);
    try {
      const res = await fetch('http://localhost:3000/generate', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        setMsg('¡Backend generado correctamente!');
      } else {
        setMsg(json.error || 'Error desconocido.');
      }
    } catch (err) {
      setMsg('Error de conexión con el backend.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 36, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: 24 }}>Generador Spring Boot desde SQL</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="sqlFile" style={{ fontWeight: 500, color: '#222' }}>Archivo SQL:</label>
          <input type="file" id="sqlFile" accept=".sql" onChange={e => setSqlFile(e.target.files[0])} required style={{ width: '100%', marginTop: 6, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="projectDir" style={{ fontWeight: 500, color: '#222' }}>Nombre de la carpeta destino:</label>
          <input type="text" id="projectDir" value={projectDir} onChange={e => setProjectDir(e.target.value)} placeholder="ej: backend-generado" required style={{ width: '100%', marginTop: 6, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #2563eb22' }}>
          {loading ? 'Generando...' : 'Generar Backend'}
        </button>
      </form>
      <div style={{ marginTop: 24, fontWeight: 'bold', color: msg.includes('correctamente') ? '#059669' : '#b91c1c', textAlign: 'center' }}>{msg}</div>
    </div>
  );
}
