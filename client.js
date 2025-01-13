const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Cargar el archivo .proto
const PROTO_PATH = path.join(__dirname, 'proto', 'hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

// Crear el cliente
function main() {
  const client = new helloProto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  const name = process.argv[2] || 'Mundo';
  client.SayHello({ name }, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Respuesta del servidor:', response.message);
    }
  });
}

main();
