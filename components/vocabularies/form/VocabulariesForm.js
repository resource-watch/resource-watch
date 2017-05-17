import React from 'react';
import { Autobind } from 'es-decorators';
import sortBy from 'lodash/sortBy';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import Button from '../../ui/Button';
import Field from '../../form/Field';
import Input from '../../form/Input';
import VocabulariesTable from '../table/VocabulariesTable';
import Spinner from '../../ui/Spinner';
import { get, post } from '../../../utils/request';

class VocabulariesForm extends React.Component {

  constructor(props) {
    super(props);
    const newState = Object.assign({}, STATE_DEFAULT, {
      loading: true,
      submitting: false,
      vocabularies: [],
      newVocabularyName: '',
      newVocabularyForm: false,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization,
        language: props.language
      })
    });

    this.state = newState;
  }

  componentDidMount() {
    this.getVocabularies();
  }

  /**
   * HELPERS
   * - getVocabularies
  */
  getVocabularies() {
    const url = 'https://api.resourcewatch.org/v1/vocabulary';

    get({
      url,
      headers: [],
      onSuccess: (response) => {
        const vocabularies = sortBy(response.data.map(vocabulary =>
          ({ name: vocabulary.id })
        ), 'id');
        this.setState({ vocabularies, loading: false });
      },
      onError: () => {
        this.setState({ message: 'Error loading vocabularies', loading: false });
      }
    });
  }

  /**
   * UI EVENTS
   * - triggerNewVocabulary
  */
  @Autobind
  triggerNewVocabulary() {
    this.setState({ newVocabularyForm: true });
  }
  @Autobind
  triggerSubmitNewVocabulary(e) {
    e.preventDefault();
    this.setState({ submitting: true });
    post({
      url: 'https://api.resourcewatch.org/v1/vocabulary',
      headers: [{
        key: 'Content-Type', value: 'application/json'
      }, {
        key: 'Authorization', value: this.props.authorization
      }],
      body: { name: this.state.newVocabularyName },
      onSuccess: (data) => {
        const vocabularies = this.state.vocabularies.slice(0);
        vocabularies.push({ name: data.data[0].id });
        this.setState({
          vocabularies,
          submitting: false,
          newVocabularyForm: false
        });
      },
      onError: () => {
        this.setState({ message: 'Error creating the vocabulary', submitting: false });
      }
    });
  }
  @Autobind
  triggerCancelNewVocabulary() {
    this.setState({ newVocabularyForm: false });
  }
  @Autobind
  changeVocabularyName(value) {
    this.setState({ newVocabularyName: value });
  }

  render() {
    const { application, authorization } = this.props;
    const { vocabularies, loading, newVocabularyForm, submitting } = this.state;
    return (
      <div className="c-vocabularies-form">
        <h1 className="-p-primary">
          Vocabularies
        </h1>
        {!loading && !newVocabularyForm &&
          <div className="actions">
            <Button
              onClick={this.triggerNewVocabulary}
              properties={{
                type: 'button',
                className: '-primary -end'
              }}
            >
              New Vocabulary
            </Button>
          </div>
        }
        {newVocabularyForm &&
          <div className="new-vocabulary-form">
            <form className="c-form" onSubmit={this.triggerSubmitNewVocabulary}>
              <Spinner className="-light" isLoading={this.state.submitting} />
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.name = c; }}
                onChange={value => this.changeVocabularyName(value)}
                validations={['required']}
                properties={{
                  name: 'name',
                  label: 'Vocabulary name',
                  type: 'text',
                  required: true,
                  default: ''
                }}
              >
                {Input}
              </Field>
              <div className="button-bar">
                <Button
                  onClick={this.triggerCancelNewVocabulary}
                  properties={{
                    type: 'button',
                    className: '-secondary -end'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  properties={{
                    type: 'submit',
                    disabled: submitting,
                    className: '-primary -end'
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        }
        <Spinner className="-light" isLoading={this.state.loading} />
        <VocabulariesTable
          vocabularies={vocabularies}
          application={application}
          authorization={authorization}
        />
      </div>
    );
  }
}

VocabulariesForm.propTypes = {
  application: React.PropTypes.string,
  authorization: React.PropTypes.string,
  language: React.PropTypes.string
};

export default VocabulariesForm;
