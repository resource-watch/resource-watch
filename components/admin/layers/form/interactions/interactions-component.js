import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import findIndex from 'lodash/findIndex';

// Redux
import { connect } from 'react-redux';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';

import { getInteractions, modifyInteractions } from 'components/admin/layers/form/interactions/interactions-actions';

import { FORM_ELEMENTS, FORMAT } from 'components/admin/layers/form/constants';

class InteractionsComponent extends PureComponent {
  componentWillMount() {
    this.props.dispatch(getInteractions({ ...this.props }));
  }

  modifyInteractions(options) {
    const { interactions } = this.props;
    // Remove layer if its not in options
    if (interactions.added) {
      interactions.added = interactions.added
        .filter(item => options.includes(item.column));
    }

    if (options.length > interactions.added.length) {
      const selected = options[options.length - 1];
      interactions.added.push({
        column: selected,
        format: null,
        prefix: '',
        property: '',
        suffix: '',
        type: 'string'
      });
    }

    this.props.dispatch(modifyInteractions(interactions.added));
  }

  editInteraction(data) {
    const { interactions } = this.props;

    if (data.key.toLowerCase() === 'label') {
      data.field.property = data.value;
    } else {
      data.field[data.key] = data.value;
    }
    interactions.added[findIndex(interactions.added, data.field)] =
      Object.assign({}, data.field);
    this.props.dispatch(modifyInteractions(interactions.added));
  }

  renderInteractionFields(data) {
    return ['Field', 'Label', 'Prefix', 'Suffix', 'Format'].map((label) => {
      const validations = label === 'Label' ? ['required'] : [];
      return (
        <Field
          key={data.column + label}
          ref={(c) => { if (c) FORM_ELEMENTS.elements[label.toLowerCase() + data.column] = c; }}
          onChange={value => this.editInteraction({ value, key: label, field: data })}
          validations={validations}
          properties={{
            name: label.toLowerCase() + data.column,
            label,
            type: 'text',
            disabled: /Field/.test(label),
            required: /Label/.test(label),
            default: data[FORMAT.resolveKey(label)]
          }}
        >
          {Input}
        </Field>
      );
    });
  }

  render() {
    const { interactions } = this.props;

    return (
      <div>
        <div className="c-field preview-container">
          {interactions.available &&
          <Field
            validations={['required']}
            options={interactions.available}
            onChange={value => this.modifyInteractions(value)}
            properties={{
              name: 'selected_columns',
              label: 'Add interactions',
              type: 'text',
              removeSelected: true,
              multi: true,
              value: interactions.added ? FORMAT.options(interactions.added) : [],
              default: interactions.added ? FORMAT.options(interactions.added) : []
            }}
          >
            {Select}
          </Field>}

        {interactions.added &&
          interactions.added.map((data) => {
            return (
              <section className="c-field-flex" key={data.column}>
                {this.renderInteractionFields(data)}
              </section>
            );
          })}

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  interactions: state.interactions
});

InteractionsComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  interactions: PropTypes.object.isRequired
};

InteractionsComponent.defaultProps = {

};

export default connect(mapStateToProps, null)(InteractionsComponent);