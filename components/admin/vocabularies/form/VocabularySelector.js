import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// Utils
import { get } from 'utils/request';

import { FORM_ELEMENTS } from './constants';

class VocabularySelector extends React.Component {
  constructor(props) {
    super(props);

    const { allVocabularies } = props;

    this.state = {
      vocabularies: allVocabularies || [],
      disabled: false,
      selected: null,
      form: {
        application: props.application,
        authorization: props.authorization,
        language: props.language
      }
    };
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentWillMount
   * - componentWillReceiveProps
  */
  componentWillMount() {
    const { vocabulary, allVocabularies } = this.props;

    if (!allVocabularies) {
      this.loadVocabularies();
    }
    if (vocabulary.name !== '') {
      this.setState({
        disabled: true,
        selected: { label: vocabulary.name, value: vocabulary }
      });
    }
  }
  componentWillReceiveProps(props) {
    const selectedVal = { label: props.vocabulary.name, value: props.vocabulary };
    this.setState({
      vocabularies: [props.vocabulary],
      disabled: true,
      selected: selectedVal,
      form: {
        application: props.application,
        authorization: props.authorization,
        language: props.language
      }
    });
  }

  /**
  * UI EVENTS
  * triggerChange
  */
  @Autobind
  triggerChange(value) {
    const newSelected = value ? { label: value.name, value } : null;
    this.setState({
      selected: newSelected,
      disabled: this.props.disableOnSelect
    });
    this.props.onChange(value);
  }

  /**
  * HELPER FUNCTIONS
  * loadVocabularies
  */
  @Autobind
  loadVocabularies() {
    get(
      {
        url: `${process.env.WRI_API_URL}/vocabulary`,
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        onSuccess: (response) => {
          this.setState({
            vocabularies: response.data.map(elem => elem.attributes),
            // Stop the loading
            loading: false
          });
        },
        onError: (error) => {
          toastr.error('Error', error);
        }
      }
    );
  }

  render() {
    const { selected, disabled } = this.state;
    return (
      <Field
        ref={(c) => { if (c) FORM_ELEMENTS.children.tags = c; }}
        onChange={value => this.triggerChange(value)}
        options={this.state.vocabularies.map(
          vocabulary => ({ label: vocabulary.name, value: vocabulary })
        )}
        validations={['required']}

        properties={{
          name: 'vocabulary',
          label: 'Vocabulary',
          required: true,
          value: selected,
          default: selected,
          disabled
        }}
      >
        {Select}
      </Field>
    );
  }
}

VocabularySelector.propTypes = {
  onChange: PropTypes.func,
  application: PropTypes.string,
  authorization: PropTypes.string,
  language: PropTypes.string,
  disableOnSelect: PropTypes.bool,
  vocabulary: PropTypes.object,
  allVocabularies: PropTypes.array
};

export default VocabularySelector;
