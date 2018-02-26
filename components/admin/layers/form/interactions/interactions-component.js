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
import { generateLayerGroups } from 'components/admin/layers/form/layer-preview/layer-preview-actions';

import { FORM_ELEMENTS, FORMAT } from 'components/admin/layers/form/constants';

const DATA_FORMATS = {
  string: [],
  number: [
    { label: '00000', value: '00000' },
    { label: '0,0', value: '0,0' },
    { label: '0a', value: '0a' }
  ],
  date: [
    { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
    { label: 'YYYY', value: 'YYYY' },
    { label: 'MM', value: 'MM' },
    { label: 'DD', value: 'DD' }
  ]
};

class InteractionsComponent extends PureComponent {
  componentWillMount() {
    this.props.dispatch(getInteractions({ ...this.props }));
  }

  addInteractions(options) {
    const { interactions } = this.props;
    // Remove layer if its not in options
    if (interactions.added) {
      interactions.added = interactions.added
        .filter(item => options.includes(item.column));
    }

    if (!interactions.added || options.length > interactions.added.length) {
      const optionSelected = options[options.length - 1];
      const selected = interactions.available.find(item => item.label === optionSelected);

      interactions.added.push({
        column: selected.label,
        format: null,
        prefix: '',
        property: '',
        suffix: '',
        type: selected.type
      });
    }

    this.props.dispatch(modifyInteractions(interactions.added));
  }

  editInteraction(data) {
    const { interactions } = this.props;

    if (data.key.toLowerCase() === 'label') {
      data.field.property = data.value;
    } else {
      data.field[data.key.toLowerCase()] = data.value;
    }
    interactions.added[findIndex(interactions.added, data.field)] =
      Object.assign({}, data.field);
    this.props.dispatch(modifyInteractions(interactions.added));
  }

  removeInteraction(interaction) {
    const { interactions } = this.props;
    interactions.added = interactions.added.filter(item => item.column !== interaction.column);
    this.props.dispatch(modifyInteractions(interactions.added));
  }

  renderInteractionFields(data) {
    return ['Field', 'Label', 'Prefix', 'Suffix'].map((label) => {
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

  renderFormatField(data) {
    return (
      <Field
        key={`${data.column}format`}
        ref={(c) => { if (c) FORM_ELEMENTS.elements[`${data.column}format`] = c; }}
        onChange={value => this.editInteraction({ value, key: 'format', field: data })}
        options={DATA_FORMATS[data.type]}
        properties={{
          name: `${data.column}format`,
          label: 'Format',
          type: 'text',
          disabled: /string/.test(data.type),
          default: /string/.test(data.type) ? 'string' : null
        }}
      >
        {Select}
      </Field>
    );
  }

  render() {
    const { interactions } = this.props;

    return (
      <div>
        <div className="c-field preview-container">
          {interactions.available &&
          <Field
            options={interactions.available}
            onChange={value => this.addInteractions(value)}
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

          {interactions.added.length ? <h5>Interactions ({interactions.added.length})</h5> : null}

          {interactions.added &&
            interactions.added.map((data) => {
              return (
                <section className="c-field-flex" key={data.column}>
                  {this.renderInteractionFields(data)}
                  {this.renderFormatField(data)}
                  <button type="button" className="c-btn" onClick={() => this.removeInteraction(data)}>Remove</button>
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
  interactions: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

InteractionsComponent.defaultProps = {

};

export default connect(mapStateToProps, null)(InteractionsComponent);