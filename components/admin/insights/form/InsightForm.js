import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';

// Utils
import { get, post } from 'utils/request';

// Redux
import { connect } from 'react-redux';

// Components
import Spinner from 'components/ui/Spinner';
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';

import { FORM_ELEMENTS } from './constants';

class InsightForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insightID: props.insight,
      insightName: '',
      insight: {},
      submitting: false,
      loading: false,
      photoFile: {},
      dropzoneActive: false,
      form: {
        application: props.application,
        authorization: props.authorization
      }
    };
  }

  componentDidMount() {
    if (this.props.mode === 'edit' && this.state.insightID) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `${process.env.API_URL}/insights/${this.state.insightID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        onSuccess: response => {
          const insight = response.data.attributes;
          this.setState({
            insight,
            insightName: insight.name,
            // Stop the loading
            loading: false
          });
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    }
  }
  @Autobind
  handleCancelEditInsight() {
    Router.pushRoute('insights');
  }
  @Autobind
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.props.mode === 'edit') {
      post({
        type: 'PATCH',
        url: `${process.env.API_URL}/insights/${this.state.insightID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.insight,
        onSuccess: response => {
          console.log(response);
          alert('Insight updated successfully!');
          Router.pushRoute('insights');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    } else if (this.props.mode === 'new') {
      post({
        type: 'POST',
        url: `${process.env.API_URL}/insights`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.insight,
        onSuccess: response => {
          console.log(response);
          alert(response.messages[0].title);
          Router.pushRoute('insights');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    }
  }
  @Autobind
  changeInsight(value) {
    const newInsight = Object.assign({}, this.state.insight, value);
    this.setState({ insight: newInsight });
  }

  /**
   * DROPZONE EVENTS
   * - onDrop
  */
  @Autobind
  onDrop(files) {
    this.setState({ photoFile: files[0] });
  }

  @Autobind
  handleChoosePhoto() {
    this.dropzone.open();
  }

  render() {
    const { insight, submitting, loading, insightName, photoFile } = this.state;
    const { mode } = this.props;
    return (
      <div>
        <Title className="-big">
          {insightName}
        </Title>
        <Spinner className="-light" isLoading={loading} />
        <form className="c-form" onSubmit={this.handleSubmit}>
          {this.state.loading && 'loading'}
          <fieldset className="c-field-container">
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.title = c;
                }
              }}
              onChange={value => this.changeInsight({ title: value })}
              validations={['required']}
              properties={{
                name: 'name',
                label: 'Title',
                type: 'text',
                required: true,
                value: insight.title
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.summary = c;
                }
              }}
              onChange={value => this.changeInsight({ summary: value })}
              properties={{
                name: 'summary',
                label: 'Summary',
                type: 'text',
                value: insight.summary
              }}
            >
              {TextArea}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.description = c;
                }
              }}
              onChange={value => this.changeInsight({ description: value })}
              properties={{
                name: 'description',
                label: 'Description',
                type: 'text',
                value: insight.description
              }}
            >
              {TextArea}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.content = c;
                }
              }}
              onChange={value => this.changeInsight({ content: value })}
              properties={{
                name: 'content',
                label: 'Content',
                type: 'text',
                value: insight.content
              }}
            >
              {TextArea}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.featured = c;
                }
              }}
              onChange={value => this.changeInsight({ published: value.checked })}
              properties={{
                name: 'published',
                label: 'Published',
                checked: insight.published
              }}
            >
              {Checkbox}
            </Field>
            <div>
              <Dropzone
                ref={(node) => { this.dropzone = node; }}
                className="c-dropzone"
                disableClick={true}
                onDrop={this.onDrop}
              >
                <div className="dropzone-file-input">
                  <button
                    type="button"
                    className="c-btn -primary -light"
                    onClick={this.handleChoosePhoto}
                  >
                    Choose photo
                  </button>
                  {photoFile.name}
                </div>
              </Dropzone>
            </div>
          </fieldset>
          <div className="button-bar">
            <Button
              onClick={this.handleCancelEditInsight}
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
              {mode === 'edit' && 'Update insight'}
              {mode === 'new' && 'Create insight'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

InsightForm.propTypes = {
  insight: PropTypes.string,
  application: PropTypes.string.isRequired,
  authorization: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});


export default connect(mapStateToProps, null)(InsightForm);
