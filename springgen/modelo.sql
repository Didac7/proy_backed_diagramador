CREATE TABLE Usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  direccion VARCHAR(255)
);

CREATE TABLE Categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

CREATE TABLE Producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(255),
  categoria_id INT REFERENCES Categoria(id)
);

CREATE TABLE Pedido (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  usuario_id INT REFERENCES Usuario(id)
);

CREATE TABLE DetallePedido (
  id SERIAL PRIMARY KEY,
  cantidad INT NOT NULL,
  pedido_id INT REFERENCES Pedido(id)
);

CREATE TABLE Comentario (
  id SERIAL PRIMARY KEY,
  contenido TEXT NOT NULL,
  usuario_id INT REFERENCES Usuario(id)
);

CREATE TABLE ProductoDetallePedido (
  producto_id INT REFERENCES Producto(id),
  detallepedido_id INT REFERENCES DetallePedido(id),
  PRIMARY KEY (producto_id, detallepedido_id)
);
