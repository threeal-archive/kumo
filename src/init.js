const Ros = require('./ros');

function init(address) {
  address = address || 'ws://localhost:9090';

  Ros.getInstance().connect(address);

  Ros.getInstance().on('connection', function() {
    console.log('connected to server!');
  });

  Ros.getInstance().on('close', function() {
    console.log('closed from server!');
  });

  Ros.getInstance().on('error', function() {
    console.log('server error!');
  });
}

module.exports = init;