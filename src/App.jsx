import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import UmlNode from './UmlNode';

// Definir los tipos de nodos personalizados
const nodeTypes = {
  umlNode: UmlNode,
};

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
  materia: ['id', 'nombre', 'creditos'],
  alumno: ['id', 'nombre', 'grado'],
  estudiante: ['id', 'nombre', 'apellido', 'edad', 'curso_id'],
  profesor: ['id', 'nombre', 'apellido', 'edad', 'especialidad'],
  asignatura: ['id', 'nombre', 'curso_id'],
  horario: ['id', 'dia', 'hora', 'curso_id'],
  nota: ['id', 'valor', 'estudiante_id', 'asignatura_id'],
  proveedor: ['id', 'nombre', 'telefono'],
  entradastock: ['id', 'fecha', 'cantidad'],
  matricula: ['id', 'fecha_matricula', 'semestre', 'anio'],
  calificacion: ['id', 'nota', 'fecha_evaluacion', 'periodo'],
  detallepedido: ['id', 'cantidad', 'precio_unitario'],
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
  
  // Helper para encontrar entidad por nombre parcial
  const encontrarEntidad = (patron) => {
    return entidades.find(ent => ent.toLowerCase().includes(patron));
  };
  
  // Relaciones específicas
  const cliente = encontrarEntidad('cliente');
  const pedido = encontrarEntidad('pedido');
  const producto = encontrarEntidad('producto');
  const usuario = encontrarEntidad('usuario');
  const comentario = encontrarEntidad('comentario');
  const publicacion = encontrarEntidad('publicacion');
  const alumno = encontrarEntidad('alumno') || encontrarEntidad('estudiante');
  const curso = encontrarEntidad('curso') || encontrarEntidad('materia');
  const asignatura = encontrarEntidad('asignatura');
  const profesor = encontrarEntidad('profesor');
  const empleado = encontrarEntidad('empleado');
  const registro = encontrarEntidad('registro');
  const paciente = encontrarEntidad('paciente');
  const cita = encontrarEntidad('cita');
  const medico = encontrarEntidad('medico') || encontrarEntidad('doctor');
  const proveedor = encontrarEntidad('proveedor');
  const entrada = encontrarEntidad('entrada');
  
  // Relaciones uno a muchos
  if (cliente && pedido) {
    rels.push({ origen: cliente, destino: pedido, tipo: 'uno a muchos' });
  }
  if (usuario && comentario) {
    rels.push({ origen: usuario, destino: comentario, tipo: 'uno a muchos' });
  }
  if (usuario && publicacion) {
    rels.push({ origen: usuario, destino: publicacion, tipo: 'uno a muchos' });
  }
  if (empleado && registro) {
    rels.push({ origen: empleado, destino: registro, tipo: 'uno a muchos' });
  }
  if (paciente && cita) {
    rels.push({ origen: paciente, destino: cita, tipo: 'uno a muchos' });
  }
  if (medico && cita) {
    rels.push({ origen: medico, destino: cita, tipo: 'uno a muchos' });
  }
  if (proveedor && entrada) {
    rels.push({ origen: proveedor, destino: entrada, tipo: 'uno a muchos' });
  }
  if (entrada && producto) {
    rels.push({ origen: entrada, destino: producto, tipo: 'uno a muchos' });
  }
  
  // Relaciones académicas específicas
  if (profesor && curso) {
    rels.push({ origen: profesor, destino: curso, tipo: 'uno a muchos' });
  }
  if (curso && asignatura) {
    rels.push({ origen: curso, destino: asignatura, tipo: 'uno a muchos' });
  }
  if (profesor && asignatura) {
    rels.push({ origen: profesor, destino: asignatura, tipo: 'uno a muchos' });
  }
  
  // Relaciones muchos a muchos - CREAR CLASES INTERMEDIAS
  if (pedido && producto) {
    // Crear clase intermedia DetallePedido
    rels.push({ origen: pedido, destino: 'DetallePedido', tipo: 'uno a muchos' });
    rels.push({ origen: 'DetallePedido', destino: producto, tipo: 'muchos a uno' });
    rels.push({ entidadIntermedia: 'DetallePedido', atributos: ['id', 'cantidad', 'precio_unitario'] });
  }
  
  if (alumno && curso) {
    // Crear clase intermedia Matricula
    rels.push({ origen: alumno, destino: 'Matricula', tipo: 'uno a muchos' });
    rels.push({ origen: 'Matricula', destino: curso, tipo: 'muchos a uno' });
    rels.push({ entidadIntermedia: 'Matricula', atributos: ['id', 'fecha_matricula', 'semestre', 'anio'] });
  }
  
  if (alumno && asignatura) {
    // Crear clase intermedia Calificacion
    rels.push({ origen: alumno, destino: 'Calificacion', tipo: 'uno a muchos' });
    rels.push({ origen: 'Calificacion', destino: asignatura, tipo: 'muchos a uno' });
    rels.push({ entidadIntermedia: 'Calificacion', atributos: ['id', 'nota', 'fecha_evaluacion', 'periodo'] });
  }
  
  // Relaciones académicas adicionales
  if (medico && alumno) {
    rels.push({ origen: medico, destino: alumno, tipo: 'uno a muchos' });
  }
  if (profesor && alumno) {
    rels.push({ origen: profesor, destino: alumno, tipo: 'uno a muchos' });
  }
  
  // Si no hay reglas, ninguna relación
  return rels;
}

// Busca el proyecto y genera nodos y edges automáticamente
function autoUML(entidades) {
  let x = 100, y = 100;
  
  // Crear nodos para entidades originales
  const nodes = entidades.map(ent => {
    const id = ent;
    const attrLines = sugerirAtributos(ent);
    const label = `${ent}\n${attrLines.map(a => '- ' + a).join('\n')}`;
    const node = {
      id,
      position: { x, y },
      data: { label },
      type: 'umlNode',
    };
    x += 250;
    if (x > 600) { x = 100; y += 200; }
    return node;
  });
  
  // Obtener relaciones y crear entidades intermedias
  const relaciones = sugerirRelaciones(entidades);
  const entidadesIntermedias = relaciones.filter(r => r.entidadIntermedia);
  
  // Agregar nodos para entidades intermedias
  entidadesIntermedias.forEach(rel => {
    const id = rel.entidadIntermedia;
    const attrLines = rel.atributos;
    const label = `${id}\n${attrLines.map(a => '- ' + a).join('\n')}`;
    const node = {
      id,
      position: { x, y },
      data: { label },
      type: 'umlNode',
    };
    x += 250;
    if (x > 600) { x = 100; y += 200; }
    nodes.push(node);
  });
  
  // Crear edges solo para relaciones normales (no entidades intermedias)
  const edges = relaciones
    .filter(r => !r.entidadIntermedia && r.origen && r.destino)
    .map(r => ({
      id: `e${r.origen}-${r.destino}`,
      source: r.origen,
      target: r.destino,
      label: r.tipo,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: '#a5b4fc', 
        strokeWidth: 2,
        strokeDasharray: '5,5'
      },
      labelStyle: { 
        fill: '#a5b4fc', 
        fontSize: 12, 
        fontWeight: 600 
      },
      labelBgStyle: { 
        fill: '#23232a', 
        fillOpacity: 0.8 
      }
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
    if (input.length > 15) {
      try {
        const prompt = `Genera un diagrama UML completo y detallado para el siguiente sistema. Incluye al menos 6 entidades relevantes, atributos realistas para cada entidad y todas las relaciones posibles (uno a uno, uno a muchos, muchos a muchos). Responde solo en JSON con el formato: { "entidades": [{"nombre": "Entidad", "atributos": ["attr1", ...]}], "relaciones": [{"origen": "Entidad1", "destino": "Entidad2", "tipo": "uno a muchos"}] }. Requerimiento: ${input}`;
        
        const response = await axios.post('http://localhost:3001/api/uml', { prompt });
        
        // Extraer contenido de la respuesta de OpenRouter
        const content = response.data.choices?.[0]?.message?.content || response.data.content || '';
        
        let json;
        try {
          json = JSON.parse(content);
        } catch (parseError) {
          if (content && typeof content === 'string') {
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
              type: 'umlNode',
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
            style: { 
              stroke: '#a5b4fc', 
              strokeWidth: 2,
              strokeDasharray: '5,5'
            },
            labelStyle: { 
              fill: '#a5b4fc', 
              fontSize: 12, 
              fontWeight: 600 
            },
            labelBgStyle: { 
              fill: '#23232a', 
              fillOpacity: 0.8 
            }
          }));
          
          newUml = { nodes, edges };
        }
      } catch (e) {
        newUml = { nodes: [], edges: [] };
      }
    } else {
      // Parser local mejorado
      let entidades = [];
      const match = input.match(/entidades:\s*([\w, ]+)/i);
      if (match) {
        entidades = match[1].split(',').map(e => e.trim()).filter(Boolean);
      } else if (input.includes(',')) {
        entidades = input.split(',').map(e => e.trim()).filter(Boolean);
      } else {
        // Buscar palabras clave que indiquen entidades
        const palabrasInput = input.toLowerCase();
        
        // Mapeo de contextos a entidades comunes
        if (palabrasInput.includes('colegio') || palabrasInput.includes('escuela') || palabrasInput.includes('universidad')) {
          entidades = ['Estudiante', 'Profesor', 'Materia', 'Aula', 'Curso'];
        } else if (palabrasInput.includes('ecommerce') || palabrasInput.includes('tienda') || palabrasInput.includes('venta')) {
          entidades = ['Cliente', 'Producto', 'Pedido', 'Categoria'];
        } else if (palabrasInput.includes('hospital') || palabrasInput.includes('clinica') || palabrasInput.includes('medico')) {
          entidades = ['Paciente', 'Medico', 'Cita', 'Diagnostico'];
        } else if (palabrasInput.includes('biblioteca')) {
          entidades = ['Usuario', 'Libro', 'Prestamo', 'Autor'];
        } else if (palabrasInput.includes('hotel') || palabrasInput.includes('reserva')) {
          entidades = ['Huesped', 'Habitacion', 'Reserva', 'Servicio'];
        } else if (palabrasInput.includes('restaurante')) {
          entidades = ['Cliente', 'Mesa', 'Reserva', 'Plato'];
        } else {
          // Fallback: extraer palabras que parezcan entidades
          const palabras = input.split(/\s|,|\.|;/).filter(Boolean);
          const blacklist = ['un', 'una', 'el', 'la', 'los', 'las', 'y', 'con', 'de', 'para', 'en', 'que', 'sistema', 'proyecto', 'app', 'aplicación', 'quiero', 'necesito', 'haceme', 'hacer', 'crear', 'generar', 'unos', 'unas', 'del', 'al', 'por', 'sobre', 'sin', 'a', 'mi', 'su', 'tus', 'sus', 'este', 'esta', 'estos', 'estas'];
          entidades = palabras
            .filter(p => p.length > 3) // Palabras de más de 3 caracteres
            .filter(p => !blacklist.includes(p.toLowerCase()))
            .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()) // Capitalizar
            .filter((v, i, a) => a.indexOf(v) === i); // Remover duplicados
        }
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
  const onConnect = (params) => setEdges(eds => addEdge({ 
    ...params, 
    animated: true, 
    type: 'smoothstep',
    style: { 
      stroke: '#a5b4fc', 
      strokeWidth: 2,
      strokeDasharray: '5,5'
    },
    labelStyle: { 
      fill: '#a5b4fc', 
      fontSize: 12, 
      fontWeight: 600 
    },
    labelBgStyle: { 
      fill: '#23232a', 
      fillOpacity: 0.8 
    }
  }, eds));

  // Establecer la función global para el UmlNode
  useEffect(() => {
    window.setSelectedNodeId = setSelectedNodeId;
    return () => {
      delete window.setSelectedNodeId;
    };
  }, []);

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
          {/* Botón para mostrar/editar SQL */}
          <button
            onClick={generateSQL}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: '#a5b4fc', color: '#23232a', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
          >
            📝 Ver Script SQL
          </button>
          {/* Panel para editar el script SQL */}
          {showSQL && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              background: 'rgba(0,0,0,0.8)', 
              zIndex: 1000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ 
                background: '#23232a', 
                color: '#fff', 
                borderRadius: 12, 
                padding: 24, 
                width: '80%', 
                maxWidth: 800, 
                height: '80%', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ color: '#a5b4fc', margin: 0 }}>Editor de Script SQL</h3>
                  <button 
                    onClick={() => setShowSQL(false)} 
                    style={{ 
                      background: 'transparent', 
                      color: '#a5b4fc', 
                      border: '1px solid #a5b4fc', 
                      borderRadius: 4, 
                      padding: '4px 8px', 
                      cursor: 'pointer',
                      fontSize: 16
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <textarea
                  value={sqlScript}
                  onChange={(e) => setSqlScript(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: 8,
                    padding: 16,
                    fontSize: 14,
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.5
                  }}
                  placeholder="Tu script SQL aparecerá aquí..."
                />
                
                <div style={{ 
                  display: 'flex', 
                  gap: 12, 
                  marginTop: 16, 
                  justifyContent: 'flex-end' 
                }}>
                  {/* <button 
                    onClick={() => navigator.clipboard.writeText(sqlScript)}
                    style={{ 
                      background: '#18181b', 
                      color: '#a5b4fc', 
                      border: '1px solid #a5b4fc', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    📋 Copiar
                  </button> */}
                  <button 
                    onClick={() => {
                      const blob = new Blob([sqlScript], { type: 'text/sql' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'script.sql';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{ 
                      background: '#a5b4fc', 
                      color: '#23232a', 
                      border: 'none', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    💾 Descargar
                  </button>
                </div>
              </div>
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
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              defaultEdgeOptions={{
                animated: true,
                type: 'smoothstep',
                style: { 
                  stroke: '#a5b4fc', 
                  strokeWidth: 2,
                  strokeDasharray: '5,5'
                },
                labelStyle: { 
                  fill: '#a5b4fc', 
                  fontSize: 12, 
                  fontWeight: 600 
                },
                labelBgStyle: { 
                  fill: '#23232a', 
                  fillOpacity: 0.8 
                }
              }}
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
