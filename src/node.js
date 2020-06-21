const Topic = require('./topic.js');
const Service = require('./service.js');

class Node {
  constructor(options) {
    options = options || {};

    this.name = options.name;
    this.parameters = [];

    this.listParametersService = new Service({
      name: this.name + '/list_parameters',
      serviceType: 'rcl_interfaces/srv/ListParameters',
    });

    this.getParametersService = new Service({
      name: this.name + '/get_parameters',
      serviceType: 'rcl_interfaces/srv/GetParameters',
    });

    this.setParametersService = new Service({
      name: this.name + '/set_parameters',
      serviceType: 'rcl_interfaces/srv/SetParameters',
    });

    this.paramEventsTopic = new Topic({
      name: '/parameter_events',
      messageType: 'rcl_interfaces/msg/ParameterEvent',
    });

    this.paramEventsTopic.subscribe((message) => {
      if (message.node == this.name) {
        let paramValues = {};
        message.deleted_parameters
          .concat(message.new_parameters)
          .concat(message.changed_parameters)
          .forEach((param) => {
            paramValues[param.name] = param.value;
          });

        this.setParamValues(paramValues);
      }
    });
  }

  setParamValues(paramValues) {
    this.parameters.forEach((parameter) => {
      const paramValue = paramValues[parameter.name];
      if (paramValue) {
        parameter.setParamValue(paramValue);
      }
    });
  }

  listParameters(callback) {
    let request = {
      depth: 0,
    };

    this.listParametersService.call(request, (response) => {
      if (callback) {
        callback(response.result.names);
      }
    });
  }

  getParameters(names, callback) {
    let request = {
      names: names,
    }

    this.getParametersService.call(request, (response) => {
      let paramValues = {};
      for (let i in response.values) {
        paramValues[names[i]] = response.values[i];
      }

      this.setParamValues(paramValues);

      if (callback) {
        callback(paramValues);
      }
    });
  }

  setParameters(paramValues, callback) {
    let request = {
      parameters: Object.keys(paramValues).map((name) => {
        return {
          name: name,
          value: paramValues[name],
        };
      }),
    }

    this.setParametersService.call(request, (response) => {
      let successes = {};
      for (let i in request.parameters) {
        successes[request.parameters[i].name] = response.results[i].successful;
      }

      if (callback) {
        callback(successes);
      }
    });
  }
}

module.exports = Node;