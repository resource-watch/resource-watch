import React from 'react';
import uniqBy from 'lodash/uniqBy';
import flatten from 'lodash/flatten';
import { Autobind } from 'es-decorators';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import VocabularyItem from 'components/admin/vocabularies/form/VocabularyItem';
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import { get, post } from 'utils/request';

class DatasetVocabulariesForm extends React.Component {

  constructor(props) {
    super(props);
    const newState = Object.assign({}, STATE_DEFAULT, {
      datasetID: props.dataset,
      datasetName: '',
      loading: true,
      allVocabularies: [],
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization,
        language: props.language
      })
    });

    this.state = newState;
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentWillMount
  */
  componentDidMount() {
    this.loadAllVocabularies();
  }

  /**
   * UI EVENTS
   * - triggerSubmit
   * - triggerChange
   * - triggerNewVocabulary
   * - handleDissociateVocabulary
  */
  @Autobind
  triggerSubmit(event) {
    event.preventDefault();

    FORM_ELEMENTS.validate();

    if (FORM_ELEMENTS.isFormValid()) {
      // Set a timeout due to the setState function of react
      setTimeout(() => {
        if (!this.state.submitting) {
          // Start the submitting
          this.setState({ submitting: true });

          const bodyObj = {};
          this.state.vocabularies.forEach((elem) => {
            bodyObj[elem.name] = { tags: elem.tags };
          });

          post(
            {
              type: 'PUT',
              url: `https://api.resourcewatch.org/v1/dataset/${this.state.datasetID}/vocabulary`,
              headers: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: this.state.form.authorization }
              ],
              body: bodyObj,
              onSuccess: (response) => {
                this.setState({ submitting: false });
                const successMessage = 'Vocabularies have been updated correctly';
                console.info(response);
                console.info(successMessage);
                alert(successMessage);
              },
              onError: () => {
                console.info('Error');
              }
            }
          );
        }
      }, 0);
    }
  }
  @Autobind
  triggerChange(vocabulary, index) {
    const vocabularies = this.state.vocabularies.slice(0);
    const newAllVocabularies =
      this.state.allVocabularies.filter(elem => elem.name !== vocabulary.name);

    vocabularies.splice(index, 1, vocabulary);
    this.setState({
      vocabularies,
      allVocabularies: newAllVocabularies
    });
  }
  @Autobind
  triggerNewVocabulary() {
    const { vocabularies } = this.state;
    if (!vocabularies.find(voc => voc.name === '')) {
      vocabularies.push({ name: '', tags: [] });
      this.setState({ vocabularies });
    }
  }
  @Autobind
  handleDissociateVocabulary(voc) {
    const { vocabularies, allVocabularies } = this.state;
    const filteredVocabularies = vocabularies.filter(elem => elem.name !== voc.name);
    const newAllVocabularies = allVocabularies.slice(0);
    if (voc.name !== '') {
      newAllVocabularies.push(voc);
    }
    this.setState({
      vocabularies: filteredVocabularies,
      allVocabularies: newAllVocabularies
    });
  }
  /**
  * HELPER FUNCTIONS
  * - loadDatasetVocabularies
  * - loadAllVocabularies
  */
  @Autobind
  loadDatasetVocabularies() {
    if (this.state.datasetID) {
      // Start the loading
      this.setState({ loading: true });

      get(
        {
          url: `https://api.resourcewatch.org/v1/dataset/${this.state.datasetID}?includes=vocabulary&cache=${Date.now()}`,
          headers: [{ key: 'Content-Type', value: 'application/json' }],
          onSuccess: (response) => {
            const attrs = response.data.attributes;
            const vocabulary = attrs.vocabulary;
            const { allVocabularies } = this.state;
            const vocabularies = vocabulary.map(elem => elem.attributes);
            const filteredVocabularies = allVocabularies.filter((elem) => {
              const vocabularyFound = !!vocabularies.find(tempVoc => tempVoc.name === elem.name);
              return !vocabularyFound;
            });
            this.setState({
              datasetName: attrs.name,
              vocabularies,
              allVocabularies: filteredVocabularies,
              // Stop the loading
              loading: false
            });
          },
          onError: () => {
            console.info('Error');
          }
        }
      );
    }
  }
  @Autobind
  loadAllVocabularies() {
    get(
      {
        url: 'https://api.resourcewatch.org/v1/vocabulary',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        onSuccess: (response) => {
          const allVocabularies = response.data
            .map(elem => elem.attributes)
            .map(elem =>
              ({
                name: elem.name,
                tagSet: uniqBy(
                  flatten(elem.resources.map(res => res.tags)), e => e)
              })
            );
          this.setState({
            allVocabularies,
            allVocabulariesNotFiltered: allVocabularies.slice(0)
          }, this.loadDatasetVocabularies);
        },
        onError: () => {
          console.info('Error');
        }
      }
    );
  }

  render() {
    const { vocabularies, allVocabularies, allVocabulariesNotFiltered } = this.state;
    return (
      <div>
        <Title className="-huge -p-primary">
          {this.state.datasetName}
        </Title>
        <h1 className="-p-primary">
          Vocabularies
        </h1>
        {!this.state.loading &&
          <Button
            onClick={this.triggerNewVocabulary}
            properties={{
              type: 'button',
              className: '-primary'
            }}
          >
            New Vocabulary
          </Button>
        }
        <Spinner
          className="-light"
          isLoading={this.state.loading}
        />
        <form className="c-form" onSubmit={this.triggerSubmit} noValidate>
          <div className="row">
            {!this.state.loading && vocabularies.length > 0 &&
              vocabularies.map((elem, i) => {
                const tempVoc = allVocabulariesNotFiltered.find(val => val.name === elem.name);
                const elemWithTagSet = Object.assign(
                  elem,
                  { tagSet: tempVoc ? tempVoc.tagSet : [] }
                );
                return (
                  <div
                    className="small-6 medium-4 column"
                    key={i}
                  >
                    <VocabularyItem
                      index={i}
                      vocabulary={elemWithTagSet}
                      allVocabularies={allVocabularies}
                      onChange={this.triggerChange}
                      application={this.props.application}
                      authorization={this.props.authorization}
                      language={this.props.language}
                      onDissociateVocabulary={this.handleDissociateVocabulary}
                    />
                  </div>);
              })
            }
          </div>
          <ul className="c-field-buttons">
            <li>
              <Button
                properties={{
                  type: 'submit',
                  name: 'commit',
                  disabled: this.state.loading,
                  className: `-primary ${this.state.loading ? '-disabled' : ''}`
                }}
              >
                Submit
              </Button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

DatasetVocabulariesForm.propTypes = {
  application: React.PropTypes.string,
  authorization: React.PropTypes.string,
  language: React.PropTypes.string,
  dataset: React.PropTypes.string.isRequired
};

export default DatasetVocabulariesForm;
