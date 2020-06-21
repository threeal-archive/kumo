const ROSLIB = require('roslib');

let Ros = (function() {
  let instance;

  return {
    getInstance: function() {
      if (!instance) {
        instance = new ROSLIB.Ros();
      }

      return instance;
    }
  };
})();

module.exports = Ros;