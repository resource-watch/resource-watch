import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

// Drag and drop
import { SortableElement } from 'react-sortable-hoc';

import { FORM_ELEMENTS, FORMAT } from 'components/admin/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import InteractionsHandler from './interactions-handler';

const DATA_FORMATS = {
  number: [
    { label: 'Integer', value: '0,0' },
    { label: 'Float', value: '0,0.0[0]' },
    { label: 'Percent Integer', value: '0,0%' },
    { label: 'Percent Float', value: '0,0[.0]%' },
    { label: 'Scientific notation', value: '0,0.0[0]e+0' },
    { label: 'Years', value: '0000' }
  ],
  date: [
    { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
    { label: 'YYYY', value: 'YYYY' },
    { label: 'MM', value: 'MM' },
    { label: 'DD', value: 'DD' }
  ],
  getAll() {
    return this.number.concat(this.date);
  }
};

const InteractionsItem = (props) => {
  const {
    interaction,
    removeInteraction,
    editInteraction,
    custom
  } = props;

  const interactionsFieldClasses = classnames({
    'c-field-flex': true,
    'c-sortable-row': true,
    'c-interactions__field': true,
    'c-interactions__field--custom': custom
  });

  return (
    <li
      className={interactionsFieldClasses}
      key={interaction.column}
    >
      <InteractionsHandler />

      {custom && <p className="c-interactions__warning"><strong>Custom interaction</strong> Make sure the data matches the format you want. Otherwise it wont display correctly.</p>}

      {['Field', 'Label', 'Prefix', 'Suffix'].map((label) => {
      const validations = label === 'Label' ? ['required'] : [];
        return (
          <Field
            key={interaction.column + label}
            ref={(c) => { if (c) FORM_ELEMENTS.elements[label.toLowerCase() + interaction.column] = c; }}
            onChange={value => editInteraction({ value, key: label, field: interaction })}
            validations={validations}
            properties={{
              name: label.toLowerCase() + interaction.column,
              label,
              type: 'text',
              disabled: /Field/.test(label),
              required: /Label/.test(label),
              default: interaction[FORMAT.resolveKey(label)]
            }}
          >
            {Input}
          </Field>
        );
      })}
      <section className="c-interactions__format">
        <Field
          key={`${interaction.column}format`}
          ref={(c) => { if (c) FORM_ELEMENTS.elements[`format${interaction.column}`] = c; }}
          onChange={value => editInteraction({ value, key: 'format', field: interaction })}
          options={custom ? DATA_FORMATS.getAll() : DATA_FORMATS[interaction.type]}
          properties={{
            name: `${interaction.column}format`,
            label: 'Format',
            type: 'text',
            disabled: /string/.test(interaction.type),
            default: typeof interaction.format === 'string' ? interaction.format : ''
          }}
        >
          {Select}
        </Field>
      </section>

      <button type="button" className="c-btn" onClick={() => removeInteraction(interaction)}>Remove</button>
    </li>);
};

InteractionsItem.propTypes = {
  interaction: PropTypes.object.isRequired,
  editInteraction: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  custom: PropTypes.bool
};

export default SortableElement(InteractionsItem);
