import React from 'react';
import Dropzone from 'react-dropzone';
import { Autobind } from 'es-decorators';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


import { FORM_ELEMENTS } from './constants';

import { get, post } from 'utils/request';

import { Router } from '../../../../routes';
import Spinner from 'components/ui/Spinner';
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';

class PageForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageID: props.page,
      pageName: '',
      page: {},
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
    if (this.props.mode === 'edit' && this.state.pageID) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `${process.env.API_URL}/api/pages/${this.state.pageID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        onSuccess: response => {
          const page = response.data.attributes;
          this.setState({
            page,
            pageName: page.name,
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
  handleCancelEditPage() {
    Router.pushRoute('pages');
  }
  @Autobind
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.props.mode === 'edit') {
      post({
        type: 'PATCH',
        url: `${process.env.API_URL}/api/pages/${this.state.pageID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.page,
        onSuccess: response => {
          console.log(response);
          alert('Static page updated successfully!');
          Router.pushRoute('pages');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    } else if (this.props.mode === 'new') {
      post({
        type: 'POST',
        url: `${process.env.API_URL}/api/pages`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.page,
        onSuccess: response => {
          console.log(response);
          alert(response.messages[0].title);
          Router.pushRoute('pages');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    }
  }
  @Autobind
  changePage(value) {
    const newPage = Object.assign({}, this.state.page, value);
    this.setState({ page: newPage });
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
    const { page, submitting, loading, pageName, photoFile } = this.state;
    const { mode } = this.props;
    return (
      <div>
        <Title className="-big">
          {pageName}
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
              onChange={value => this.changePage({ title: value })}
              validations={['required']}
              properties={{
                name: 'name',
                label: 'Title',
                type: 'text',
                required: true,
                value: page.title
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
              onChange={value => this.changePage({ summary: value })}
              properties={{
                name: 'summary',
                label: 'Summary',
                type: 'text',
                value: page.summary
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
              onChange={value => this.changePage({ description: value })}
              properties={{
                name: 'description',
                label: 'Description',
                type: 'text',
                value: page.description
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
              onChange={value => this.changePage({ content: value })}
              properties={{
                name: 'content',
                label: 'Content',
                type: 'text',
                value: page.content
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
              onChange={value => this.changePage({ published: value.checked })}
              properties={{
                name: 'published',
                label: 'Published',
                checked: page.published
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
              onClick={this.handleCancelEditPage}
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
              {mode === 'edit' && 'Update Static page'}
              {mode === 'new' && 'Create Static page'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

PageForm.propTypes = {
  page: PropTypes.string,
  application: PropTypes.string.isRequired,
  authorization: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(PageForm);
