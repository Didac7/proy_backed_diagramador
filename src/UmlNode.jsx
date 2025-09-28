import React from 'react';
import { Handle, Position } from 'reactflow';

function UmlNode(props) {
  const { id, data, selected } = props;
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        if (window.setSelectedNodeId) window.setSelectedNodeId(id);
      }}
      style={{
        background: '#fff',
        color: '#222',
        borderRadius: 6,
        border: selected ? '2px solid #4f46e5' : '1.5px solid #888',
        minWidth: 150,
        minHeight: 40,
        padding: 0,
        position: 'relative',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxShadow: selected ? '0 2px 8px #4f46e544' : '0 1px 4px #0002',
        cursor: 'pointer',
      }}
    >
      {/* Handle de entrada */}
      <Handle type="target" position={Position.Left} style={{ background: '#6366f1', width: 10, height: 10, borderRadius: 5, left: -5, top: '50%', transform: 'translateY(-50%)' }} />
      {/* Nombre de la clase */}
      <div style={{
        fontWeight: 'bold',
        fontSize: 16,
        background: '#f3f4f6',
        borderBottom: '1.5px solid #888',
        padding: '8px 12px 4px 12px',
        textAlign: 'center',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        color: '#222',
        letterSpacing: 0.5,
      }}>{(data.label || '').split('\n')[0]}</div>
      {/* Atributos */}
      <div style={{
        padding: '6px 12px 8px 12px',
        textAlign: 'left',
        background: 'transparent',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        minHeight: 20,
        borderTop: ((data.label || '').split('\n').length > 1) ? '1px solid #e5e7eb' : 'none',
      }}>
        {((data.label || '').split('\n').slice(1).filter(Boolean).length === 0) ? (
          <span style={{ color: '#bbb' }}>(sin atributos)</span>
        ) : (
          (data.label || '').split('\n').slice(1).filter(Boolean).map((attr, idx) => (
            <div key={idx} style={{ lineHeight: '1.3em', fontSize: 13, borderBottom: '1px solid #f3f4f6', padding: '0 0 2px 0' }}>
              {attr}
            </div>
          ))
        )}
      </div>
      {/* Handle de salida */}
      <Handle type="source" position={Position.Right} style={{ background: '#6366f1', width: 10, height: 10, borderRadius: 5, right: -5, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
}

export default UmlNode;
