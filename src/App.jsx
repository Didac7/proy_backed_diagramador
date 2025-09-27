import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
// Razonamiento automático para atributos y relaciones
const atributosPorEntidad = {
  cliente: ['id', 'nombre', 'email'],
  producto: ['id', 'nombre', 'precio', 'stock'],
  pedido: ['id', 'fecha', 'total'],
  usuario: ['id', 'nombre', 'email'],
  libro: ['id', 'titulo', 'autor', 'anio'],
  empleado: ['id', 'nombre', 'departamento'],
  reserva: ['id', 'fecha', 'hora'],
  mesa: ['id', 'numero', 'capacidad'],
  habitacion: ['id', 'numero', 'tipo'],
  huesped: ['id', 'nombre', 'documento'],
  comentario: ['id', 'texto', 'fecha'],
  publicacion: ['id', 'contenido', 'fecha'],
  curso: ['id', 'nombre', 'creditos'],
  alumno: ['id', 'nombre', 'grado'],
  proveedor: ['id', 'nombre', 'telefono'],
  entradastock: ['id', 'fecha', 'cantidad'],
  matricula: ['id', 'anio'],
  cita: ['id', 'fecha', 'motivo'],
  paciente: ['id', 'nombre', 'fechaNacimiento'],
  medico: ['id', 'nombre', 'especialidad'],
  autor: ['id', 'nombre', 'bio'],
  entrada: ['id', 'titulo', 'contenido', 'fecha'],
  registroasistencia: ['id', 'fecha', 'horaEntrada', 'horaSalida'],
  prestamo: ['id', 'fechaPrestamo', 'fechaDevolucion']
};

function sugerirAtributos(entidad) {
  const key = entidad.toLowerCase();
  return atributosPorEntidad[key] || ['id', 'nombre'];
}

function sugerirRelaciones(entidades) {
  // Reglas simples para relaciones típicas
  const rels = [];
  const lower = entidades.map(e => e.toLowerCase());
  if (lower.includes('cliente') && lower.includes('pedido')) {
    rels.push({ origen: 'Cliente', destino: 'Pedido', tipo: 'uno a muchos' });
  }
  if (lower.includes('pedido') && lower.includes('producto')) {
    rels.push({ origen: 'Pedido', destino: 'Producto', tipo: 'muchos a muchos' });
  }
  if (lower.includes('usuario') && lower.includes('comentario')) {
    rels.push({ origen: 'Usuario', destino: 'Comentario', tipo: 'uno a muchos' });
  }
  if (lower.includes('usuario') && lower.includes('publicacion')) {
    rels.push({ origen: 'Usuario', destino: 'Publicacion', tipo: 'uno a muchos' });
  }
  if (lower.includes('alumno') && lower.includes('curso')) {
    rels.push({ origen: 'Alumno', destino: 'Curso', tipo: 'muchos a muchos' });
  }
  if (lower.includes('empleado') && lower.includes('registroasistencia')) {
    rels.push({ origen: 'Empleado', destino: 'RegistroAsistencia', tipo: 'uno a muchos' });
  }
  if (lower.includes('paciente') && lower.includes('cita')) {
    rels.push({ origen: 'Paciente', destino: 'Cita', tipo: 'uno a muchos' });
  }
  if (lower.includes('medico') && lower.includes('cita')) {
    rels.push({ origen: 'Medico', destino: 'Cita', tipo: 'uno a muchos' });
  }
  if (lower.includes('proveedor') && lower.includes('entradastock')) {
    rels.push({ origen: 'Proveedor', destino: 'EntradaStock', tipo: 'uno a muchos' });
  }
  if (lower.includes('entradastock') && lower.includes('producto')) {
    rels.push({ origen: 'EntradaStock', destino: 'Producto', tipo: 'uno a muchos' });
  }
  // Si no hay reglas, ninguna relación
  return rels;
}

// Busca el proyecto y genera nodos y edges automáticamente
function autoUML(entidades) {
  let x = 100, y = 100;
  const nodes = entidades.map(ent => {
    const id = ent;
    const attrLines = sugerirAtributos(ent);
    const label = `${ent}\n${attrLines.map(a => '- ' + a).join('\n')}`;
    const node = {
      id,
      position: { x, y },
      data: { label },
      type: 'default',
    };
    x += 250;
    if (x > 600) { x = 100; y += 200; }
    return node;
  });
  const edges = sugerirRelaciones(entidades).map(r => ({
    id: `e${r.origen}-${r.destino}`,
    source: r.origen,
    target: r.destino,
    label: r.tipo,
    type: 'smoothstep',
    animated: true,
  }));
  return { nodes, edges };
}


function getInitialChats() {
  // Carga los chats desde localStorage o crea uno nuevo
  const raw = localStorage.getItem('uml_chats');
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch {}
  }
  return [{ id: Date.now(), title: 'Nuevo chat', history: [], uml: { nodes: [], edges: [] } }];
}


function App() {
// Estado para mostrar el script SQL
  const [showSQL, setShowSQL] = useState(false);
  const [sqlScript, setSqlScript] = useState('');

  // Función para generar el script SQL
  const generateSQL = () => {
    let sql = '';
    const pkMap = {};
    const attrsMap = {};
    // Tipos inteligentes
    function guessType(attr) {
      if (/id/i.test(attr)) return 'SERIAL PRIMARY KEY';
      if (/fecha/i.test(attr)) return 'DATE';
      if (/precio/i.test(attr)) return 'DECIMAL(10,2)';
      if (/telefono/i.test(attr)) return 'VARCHAR(20)';
      return 'VARCHAR(255)';
    }
    // Mapear atributos y claves primarias
    nodes.forEach(node => {
      const entity = node.id;
      const attrs = (node.data.label || '').split('\n').slice(1).map(l => l.replace(/^-\s*/, ''));
      attrsMap[entity] = attrs;
      const pk = attrs.find(a => /^id/i.test(a)) || 'id';
      pkMap[entity] = pk;
    });
    // Relaciones para claves foráneas y muchos a muchos
    const fkMap = {};
    const manyToMany = [];
    edges.forEach(edge => {
      if (/muchos a muchos/i.test(edge.label)) {
        manyToMany.push(edge);
      } else {
        // Clave foránea en la tabla destino
        if (!fkMap[edge.target]) fkMap[edge.target] = [];
        fkMap[edge.target].push({
          ref: edge.source,
          refPK: pkMap[edge.source]
        });
      }
    });
    // Crear tablas
    nodes.forEach(node => {
      const entity = node.id;
      const attrs = attrsMap[entity];
      const pk = pkMap[entity];
      sql += `CREATE TABLE ${entity} (\n`;
      attrs.forEach((attr, idx) => {
        if (attr === pk) {
          sql += `  ${attr} SERIAL PRIMARY KEY`;
        } else {
          sql += `  ${attr} ${guessType(attr)}`;
        }
        sql += (idx < attrs.length - 1 ? ',\n' : '');
      });
      // Claves foráneas
      if (fkMap[entity]) {
        fkMap[entity].forEach(fk => {
          sql += (attrs.length ? ',\n' : '');
          sql += `  ${fk.refPK} INT REFERENCES ${fk.ref}(${fk.refPK})`;
        });
      }
      sql += '\n);\n\n';
    });
    // Tablas muchos a muchos
    manyToMany.forEach(edge => {
      const sourcePK = pkMap[edge.source];
      const targetPK = pkMap[edge.target];
      sql += `CREATE TABLE ${edge.source}${edge.target} (\n`;
      sql += `  ${edge.source}_${sourcePK} INT REFERENCES ${edge.source}(${sourcePK}),\n`;
      sql += `  ${edge.target}_${targetPK} INT REFERENCES ${edge.target}(${targetPK}),\n`;
      sql += `  PRIMARY KEY (${edge.source}_${sourcePK}, ${edge.target}_${targetPK})\n`;
      sql += ');\n\n';
    });
    setSqlScript(sql);
    setShowSQL(true);
  };
  // Estado para entidad seleccionada
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Estados locales para nodos y edges editables
  const [chats, setChats] = useState(getInitialChats());
  const [selectedId, setSelectedId] = useState(chats[0]?.id);
  const selectedChat = chats.find(c => c.id === selectedId) || chats[0];
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedChat.uml.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedChat.uml.edges);

  // Obtener entidad seleccionada
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  // Parsear atributos desde el label
  const getNodeAttrs = (node) => {
    if (!node) return [];
    const lines = (node.data.label || '').split('\n').slice(1);
    return lines.map(l => l.replace(/^-\s*/, ''));
  };
  const nodeAttrs = getNodeAttrs(selectedNode);

  // Deshabilitar edición de nombre/id

  // Actualizar atributos
  const handleAttrChange = (idx, value) => {
    const attrs = nodeAttrs.map((a, i) => i === idx ? value : a);
    setNodes(nds => nds.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, label: `${n.id}\n${attrs.map(a => '- ' + a).join('\n')}` } }
        : n
    ));
  };

  // Agregar atributo
  const handleAddAttr = () => {
    const attrs = [...nodeAttrs, 'nuevoAtributo'];
    setNodes(nds => nds.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, label: `${n.id}\n${attrs.map(a => '- ' + a).join('\n')}` } }
        : n
    ));
  };

  // Eliminar atributo
  const handleDeleteAttr = (idx) => {
    const attrs = nodeAttrs.filter((_, i) => i !== idx);
    setNodes(nds => nds.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, label: `${n.id}\n${attrs.map(a => '- ' + a).join('\n')}` } }
        : n
    ));
  };
  // ...existing code...

  // Sincroniza chats con localStorage
  useEffect(() => {
    localStorage.setItem('uml_chats', JSON.stringify(chats));
  }, [chats]);

  // Sincroniza nodos y edges cuando cambia el chat seleccionado
  // Solo sincroniza nodos y edges cuando cambia el chat seleccionado
  useEffect(() => {
    const cleanNodes = (selectedChat.uml.nodes || []).map(node => ({
      ...node,
      data: {
        ...node.data,
        label: typeof node.data.label === 'string' ? node.data.label : String(node.data.label)
      }
    }));
    setNodes(cleanNodes);
    setEdges(selectedChat.uml.edges);
    // eslint-disable-next-line
  }, [selectedId]);

  const handleSend = async (input) => {
    // Añade mensaje del usuario
    const newHistory = [...selectedChat.history, { role: 'user', content: input }];
    let newUml = { nodes: [], edges: [] };
    // Llama a OpenAI si la frase es compleja
    if (input.length > 30) {
      try {
        const prompt = `Genera un diagrama UML completo y detallado para el siguiente sistema. Incluye al menos 6 entidades relevantes, atributos realistas para cada entidad y todas las relaciones posibles (uno a uno, uno a muchos, muchos a muchos). Responde solo en JSON con el formato: { "entidades": [{"nombre": "Entidad", "atributos": ["attr1", ...]}], "relaciones": [{"origen": "Entidad1", "destino": "Entidad2", "tipo": "uno a muchos"}] }. Requerimiento: ${input}`;
        const response = await axios.post('http://localhost:3001/api/uml', { prompt });
        const content = response.data.content;
        let json;
        try {
          json = JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              json = JSON.parse(match[0]);
            } catch {
              json = null;
            }
          } else {
            json = null;
          }
        }
        if (json && json.entidades) {
          let x = 100, y = 100;
          const nodes = json.entidades.map(ent => {
            const id = ent.nombre;
            const attrLines = ent.atributos;
            const label = `${ent.nombre}\n${attrLines.map(a => '- ' + a).join('\n')}`;
            const node = {
              id,
              position: { x, y },
              data: { label },
              type: 'default',
            };
            x += 250;
            if (x > 600) { x = 100; y += 200; }
            return node;
          });
          const edges = (json.relaciones || []).map(r => ({
            id: `e${r.origen}-${r.destino}`,
            source: r.origen,
            target: r.destino,
            label: r.tipo,
            type: 'smoothstep',
            animated: true,
          }));
          newUml = { nodes, edges };
        }
      } catch (e) {
        newUml = { nodes: [], edges: [] };
      }
    } else {
      // Parser local
      let entidades = [];
      const match = input.match(/entidades:\s*([\w, ]+)/i);
      if (match) {
        entidades = match[1].split(',').map(e => e.trim()).filter(Boolean);
      } else if (input.includes(',')) {
        entidades = input.split(',').map(e => e.trim()).filter(Boolean);
      } else {
        const palabras = input.split(/\s|,|\.|;/).filter(Boolean);
        const blacklist = ['Un', 'Una', 'El', 'La', 'Los', 'Las', 'Y', 'Con', 'De', 'Para', 'En', 'Que', 'Sistema', 'Proyecto', 'App', 'Aplicación', 'Quiero', 'Necesito', 'Unos', 'Unas', 'Del', 'Al', 'Por', 'Sobre', 'Sin', 'A', 'Mi', 'Su', 'Tus', 'Sus', 'Este', 'Esta', 'Estos', 'Estas'];
        entidades = palabras.filter(p => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(p) && !blacklist.includes(p));
        entidades = [...new Set(entidades)];
      }
      if (entidades.length > 0) {
        newUml = autoUML(entidades);
      } else {
        newUml = { nodes: [], edges: [] };
      }
    }
    // Añade respuesta del bot
    const newBotMsg = { role: 'bot', content: 'Diagrama generado.' };
    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id
        ? { ...chat, history: [...newHistory, newBotMsg], uml: newUml }
        : chat
    );
    setChats(updatedChats);
    // Si el chat seleccionado es el actual, actualiza nodos y edges editables
    if (selectedChat.id === selectedId) {
      setNodes(newUml.nodes);
      setEdges(newUml.edges);
    }
  };

  const handleSelectChat = (id) => {
    setSelectedId(id);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'Nuevo chat',
      history: [],
      uml: { nodes: [], edges: [] }
    };
    setChats([newChat, ...chats]);
    setSelectedId(newChat.id);
  };

  const handleDeleteChat = (id) => {
    const filtered = chats.filter(chat => chat.id !== id);
    setChats(filtered.length > 0 ? filtered : [{ id: Date.now(), title: 'Nuevo chat', history: [], uml: { nodes: [], edges: [] } }]);
    if (selectedId === id) {
      setSelectedId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  // Handler para conectar nodos
  const onConnect = (params) => setEdges(eds => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds));

  // Handler para eliminar nodos/edges y guardar cambios en el chat
  useEffect(() => {
    // Solo guarda si el chat seleccionado es el actual
    setChats(prev => prev.map(chat =>
      chat.id === selectedId ? { ...chat, uml: { nodes, edges } } : chat
    ));
    // eslint-disable-next-line
  }, [nodes, edges]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#101014', color: '#fff' }}>
      <Sidebar
        chats={chats}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
        selectedId={selectedId}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 0 24px' }}>
          <h2 style={{ color: '#a5b4fc', marginBottom: 16 }}>Generador UML tipo Chat</h2>
          <div style={{ background: '#23232a', borderRadius: 8, padding: 16, minHeight: 120, marginBottom: 8 }}>
            {selectedChat.history.map((msg, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <b style={{ color: msg.role === 'user' ? '#a5b4fc' : '#fff' }}>{msg.role === 'user' ? 'Tú:' : 'Bot:'}</b> {msg.content}
              </div>
            ))}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
  <div style={{ flex: 1, minHeight: 400, margin: '24px 24px 24px 24px', background: '#18181b', borderRadius: 8, display: 'flex', position: 'relative' }}>
          {/* Botón para mostrar SQL */}
          <button
            onClick={generateSQL}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: '#a5b4fc', color: '#23232a', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
          >
            Ver script SQL
          </button>
          {/* Panel para mostrar el script SQL */}
          {showSQL && (
            <div style={{ position: 'absolute', top: 60, right: 16, zIndex: 20, background: '#23232a', color: '#fff', borderRadius: 8, padding: 20, maxWidth: 500, maxHeight: 400, overflowY: 'auto', boxShadow: '0 2px 8px #0008' }}>
              <h3 style={{ color: '#a5b4fc', marginBottom: 8 }}>Script SQL generado</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14 }}>{sqlScript}</pre>
              <button onClick={() => setShowSQL(false)} style={{ marginTop: 12, background: '#18181b', color: '#fff', border: '1px solid #a5b4fc', borderRadius: 4, padding: '6px 0', cursor: 'pointer' }}>Cerrar</button>
            </div>
          )}
          {/* Diagrama UML */}
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
          {/* Panel lateral de edición */}
          {selectedNode && (
            <div style={{ width: 280, background: '#23232a', color: '#fff', padding: 20, borderRadius: 8, marginLeft: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ color: '#a5b4fc', marginBottom: 8 }}>Editar entidad</h3>
              <label style={{ fontSize: 14 }}>Nombre:</label>
              <input
                type="text"
                value={selectedNode.id}
                disabled
                style={{ padding: 6, borderRadius: 4, border: 'none', marginBottom: 8, background: '#18181b', color: '#a5b4fc', opacity: 0.7 }}
              />
              <label style={{ fontSize: 14 }}>Atributos:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {nodeAttrs.map((attr, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={attr}
                      onChange={e => handleAttrChange(idx, e.target.value)}
                      style={{ flex: 1, padding: 6, borderRadius: 4, border: 'none' }}
                    />
                    <button onClick={() => handleDeleteAttr(idx)} style={{ background: '#a5b4fc', color: '#23232a', border: 'none', borderRadius: 4, padding: '0 8px', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <button onClick={handleAddAttr} style={{ marginTop: 8, background: '#a5b4fc', color: '#23232a', border: 'none', borderRadius: 4, padding: '6px 0', cursor: 'pointer' }}>+ Agregar atributo</button>
              </div>
              <button onClick={() => setSelectedNodeId(null)} style={{ marginTop: 16, background: '#18181b', color: '#fff', border: '1px solid #a5b4fc', borderRadius: 4, padding: '6px 0', cursor: 'pointer' }}>Cerrar</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
