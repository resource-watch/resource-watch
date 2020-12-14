import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Navigation from 'components/form/Navigation';

const CollectionsForm = ({
  onSave,
  collection,
}) => {
  const [formState, setFormState] = useState({
    name: collection?.name || '',
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSave(formState);
  }, [formState, onSave]);

  const handleInput = useCallback((name) => {
    setFormState({ name });
  }, []);

  return (
    <form
      className="c-form c-collections-form"
      onSubmit={handleSubmit}
    >
      <Field
        onChange={handleInput}
        validations={['required']}
        properties={{
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          default: formState.name,
        }}
      >
        {Input}
      </Field>

      <Navigation
        step={1}
        stepLength={1}
        submitting={false}
        onStepChange={() => {}}
      />
    </form>
  );
};

CollectionsForm.defaultProps = {
  collection: null,
};

CollectionsForm.propTypes = {
  collection: PropTypes.shape({
    name: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default CollectionsForm;
