class Parameter {
  constructor(options) {
    options = options || {};

    this.node = options.node;
    if (this.node) {
      this.node.parameters.push(this);
    }

    this.name = options.name;
    this.value = options.value;
  }

  static valueToParamValue(value) {
    if (typeof value === 'boolean') {
      return { type: 1, boolean_value: value };
    }
    else if (typeof value === 'number') {
      return { type: 3, double_value: value };
    }
    else if (typeof value === 'string') {
      return { type: 4, string_value: value };
    }
    else if (typeof value === 'object') {
      if (value.length && value.length > 0) {
        if (typeof value[0] === 'boolean') {
          return { type: 6, bool_array_value: value };
        }
        else if (typeof value[0] === 'number') {
          return { type: 8, double_array_value: value };
        }
        else if (typeof value[0] === 'string') {
          return { type: 9, string_array_value: value };
        }
      }
    }

    return { type: 0 };
  }

  static paramValueToValue(paramValue) {
    switch (paramValue.type) {
      case 1: return paramValue.bool_value;
      case 2: return paramValue.integer_value;
      case 3: return paramValue.double_value;
      case 4: return paramValue.string_value;
      case 5: return paramValue.byte_array_value;
      case 6: return paramValue.bool_array_value;
      case 7: return paramValue.integer_array_value;
      case 8: return paramValue.double_array_value;
      case 9: return paramValue.string_array_value;
    }

    return undefined;
  }

  getParamValue() {
    return Parameter.valueToParamValue(this.value);
  }

  setParamValue(paramValue) {
    if (paramValue) {
      this.value = Parameter.paramValueToValue(paramValue);
      if (this.listenCallback) {
        this.listenCallback(this.value);
      }
    }
  }

  listen(callback) {
    this.listenCallback = callback;

    this.getParameter((value) => {
      if (this.listenCallback) {
        this.listenCallback(value);
      }
    });
  };

  getParameter(callback) {
    this.node.getParameters([ this.name ], (paramValues) => {
      const paramValue = paramValues[this.name];
      if (paramValue) {
        this.setParamValue(paramValue);

        if (callback) {
          callback(this.value);
        }
      }
    });
  }

  setParameter(value, callback) {
    let paramValues = {
      [this.name]: Parameter.valueToParamValue(value)
    };

    this.node.setParameters(paramValues, (successes) => {
      const success = successes[this.name] || false;
      if (callback) {
        callback(success);
      }
    });
  }
}

module.exports = Parameter;