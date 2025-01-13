const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Configurar gRPC
const PROTO_PATH = path.join(__dirname, 'proto', 'hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;
const grpcClient = new helloProto.Greeter('localhost:50051', grpc.credentials.createInsecure());

// Configurar Express
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para la interacción con gRPC
app.post('/api/sayhello', (req, res) => {
  const { name } = req.body;
  grpcClient.SayHello({ name }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en el servidor gRPC' });
    } else {
      res.json(response);
    }
  });
});

// Iniciar el servidor HTTP
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});
