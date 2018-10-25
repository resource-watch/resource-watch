class Validator {
  constructor() {
    // Validations
    this.validations = {
      required: {
        validate(value) {
          const regex = /.*\S.*/;
          return regex.test(value || '');
        },
        message() {
          return 'The field is required';
        }
      },

      email: {
        validate(value) {
          const regex = /\S+@\S+\.\S+/;
          return regex.test(value || '');
        },
        message() {
          return 'The field should be an email';
        }
      },

      url: {
        validate(value) {
          const regex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
          return regex.test(value || '');
        },
        message() {
          return 'The field should be an url: http://example.com';
        }
      },

      unique: {
        validate(value, condition, data) {
          return data.filter(d => d[condition] === value).length <= 1;
        },
        message(condition) {
          return `${condition} fields can not have the same value`;
        }
      },

      min: {
        validate(value, condition) {
          return parseFloat(value) >= parseFloat(condition);
        },
        message(condition) {
          return `The field should be greater than ${condition}`;
        }
      },

      max: {
        validate(value, condition) {
          return parseFloat(value) <= parseFloat(condition);
        },
        message(condition) {
          return `The field should be lower than ${condition}`;
        }
      },
      equal: {
        validate(value, condition, data) { return value === data; },
        message(message) { return message; }
      }
    };
  }

  validate(validations, value) {
    return validations.map((validation) => {
      let valid;
      let message = '';

      if (typeof validation === 'string') {
        const validObj = this.validations[validation];
        valid = validObj.validate(value);
        message = validObj.message();
      }

      if (typeof validation === 'object') {
        const validObj = this.validations[validation.type];
        valid = validObj.validate(value, validation.condition, validation.data);
        message = validObj.message(validation.condition);
      }

      return {
        valid,
        error: (!valid) ? { message } : null
      };
    });
  }
}

export default Validator;
