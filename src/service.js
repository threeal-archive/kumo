const ROSLIB = require('roslib');
const Ros = require('./ros.js');

class Service {
  constructor(options) {
    options = options || {};
    options.ros = Ros.getInstance();

    this.serviceLock = false;
    this.service = new ROSLIB.Service(options);
    this.serviceQueue = [];
  }

  call(request, callback) {
    if (this.serviceLock) {
      this.serviceQueue.push({
        request: request,
        callback: callback,
      });
    }
    else {
      this.serviceLock = true;
      this.callProcess(request, callback);
    }
  }

  callProcess(request, callback) {
    this.service.callService(
      new ROSLIB.ServiceRequest(request),
      (message) => {
        this.callPop()
        if (callback) {
          callback(message);
        }
      },
      () => {
        this.callPop();
      }
    );
  }

  callPop() {
    if (this.serviceQueue.length > 0) {
      let queue = this.serviceQueue.pop();
      this.callProcess(queue.request, queue.callback);
    }
    else {
      this.serviceLock = false;
    }
  }
}

module.exports = Service;