import React from 'react';
import { Autobind } from 'es-decorators';

import Button from 'components/ui/Button';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import VocabularySelector from './VocabularySelector';

import { FORM_ELEMENTS } from './constants';

class VocabularyItem extends React.Component {
  constructor(props) {
    super(props);

    const { vocabulary } = props;
    this.state = {
      vocabulary,
      selectedTags: vocabulary.tags,
      tagSet: vocabulary.tagSet
    };
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentWillReceiveProps
  */
  componentWillReceiveProps(props) {
    const vocabulary = props.vocabulary;
    this.setState({
      vocabulary,
      selectedTags: vocabulary.tags || []
    });
  }
  /**
  * UI EVENTS
  * - triggerDissociateVocabulary
  * - triggerTagsChange
  * - triggerVocabularyChange
  */
  @Autobind
  triggerDissociateVocabulary() {
    this.props.onDissociateVocabulary(this.state.vocabulary);
  }
  @Autobind
  triggerTagsChange(vals) {
    const vocabularyUpdated = Object.assign(this.state.vocabulary, { tags: vals });

    this.setState({
      vocabulary: vocabularyUpdated,
      selectedTags: vals
    }, this.props.onChange(this.state.vocabulary, this.props.index));
  }
  @Autobind
  triggerVocabularyChange(value) {
    this.setState({
      vocabulary: value,
      tagSet: value.tagSet,
      selectedTags: []
    }, () => this.props.onChange(value, this.props.index));
  }

  render() {
    const { allVocabularies } = this.props;
    const { tagSet, vocabulary, selectedTags } = this.state;

    return (
      <div className={`c-vocabulary-item`}>
        <fieldset className="c-field-container">
          <VocabularySelector
            onChange={this.triggerVocabularyChange}
            disableOnSelect
            vocabulary={vocabulary}
            allVocabularies={allVocabularies}
          />
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.children.tags = c; }}
            onChange={value => this.triggerTagsChange(value)}
            options={tagSet.map(val => ({ label: val, value: val }))}
            validations={['required']}
            selected={selectedTags.map(
              tag => ({ label: tag, value: tag })
            )}
            properties={{
              name: 'tags',
              label: 'tags',
              multi: true,
              required: true,
              creatable: true,
              default: selectedTags.map(
                tag => ({ label: tag, value: tag })
              ),
              value: selectedTags.map(
                tag => ({ label: tag, value: tag })
              )
            }}
          >
            {Select}
          </Field>
          <Button
            onClick={this.triggerDissociateVocabulary}
            properties={{
              type: 'button',
              name: 'dissociate',
              className: '-primary'
            }}
          >
            Dissociate Vocabulary
          </Button>
        </fieldset>
      </div>
    );
  }
}

VocabularyItem.propTypes = {
  vocabulary: React.PropTypes.object,
  allVocabularies: React.PropTypes.array,
  onChange: React.PropTypes.func,
  onDissociateVocabulary: React.PropTypes.func,
  index: React.PropTypes.number
};

export default VocabularyItem;
