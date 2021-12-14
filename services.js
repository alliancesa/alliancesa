var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'.Servidor Web Fabrica',
  description: 'Serviço Web Fabrica',
  script: 'E:\\Nodes\\NodeExpress\\www.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();