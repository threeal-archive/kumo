const ROSLIB = require('roslib');
const Ros = require('./ros.js');

class Topic {
  constructor(options) {
    options = options || {};
    options.ros = Ros.getInstance();

    this.topic = new ROSLIB.Topic(options);
  }

  subscribe(callback) {
    this.topic.subscribe(callback);
  }
}

module.exports = Topic;