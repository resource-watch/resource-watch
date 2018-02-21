import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Constants
import { FORM_ELEMENTS } from 'components/admin/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

function ColumnsForm(props) {  
  const { form } = props;

  if (!form || !form.interactionConfig || !form.interactionConfig.output) return null;

  return (
    <div>
      {form.interactionConfig.output.map((data, key) => {

      return (
        <section className="c-field-flex" key={key}>
          {Object.entries(data).map((item, key) => {
          const fieldType = item[0];
          const fieldValue = item[1];

          if (/format/.test(fieldType)) return null;

          return (
            <Field
              key={key}
              ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
              onChange={value => props.onChange({ interaction: value })}
              properties={{
                name: fieldType,
                label: /property/.test(fieldType) ? 'Label' : capitalizeFirstLetter(fieldType),
                type: 'text',
                disabled: /column/.test(fieldType),
                required: /property/.test(fieldType),
                default: fieldValue
              }}
            >
              {Input}
            </Field>);
        })}
        </section>);
    })}
    </div>);
}

ColumnsForm.propTypes = {
  interactionConfig: PropTypes.object,
  availableColumns: PropTypes.object,
  form: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.form
});

export default connect(mapStateToProps, null)(ColumnsForm);
