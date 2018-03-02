import React from 'react';
import PropTypes from 'prop-types';

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

const InteractionsItem = (props) => {
  const {
    interaction,
    removeInteraction,
    editInteraction
  } = props;
  return (
    <li
      className="c-field-flex c-sortable-row"
      key={interaction.column}
    >
      <InteractionsHandler />

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

      <Field
        key={`${interaction.column}format`}
        ref={(c) => { if (c) FORM_ELEMENTS.elements[`format${interaction.column}`] = c; }}
        onChange={value => editInteraction({ value, key: 'format', field: interaction })}
        options={DATA_FORMATS[interaction.type]}
        properties={{
          name: `${interaction.column}format`,
          label: 'Format',
          type: 'text',
          disabled: /string/.test(interaction.type),
          default: interaction.format
        }}
      >
        {Select}
      </Field>

      <button type="button" className="c-btn" onClick={() => removeInteraction(interaction)}>Remove</button>
    </li>);
};

InteractionsItem.propTypes = {
  interaction: PropTypes.object.isRequired,
  editInteraction: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired
};

export default SortableElement(InteractionsItem);
