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

// Implementar el servicio
function sayHello(call, callback) {
  const name = call.request.name || 'Mundo';
  callback(null, { message: `¡Hola, ${name}!` });
}

// Iniciar el servidor
function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { SayHello: sayHello });
  const port = '50051';
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    server.start();
  });
}

main();
