import React from 'react';
import Dropzone from 'react-dropzone';
import { Autobind } from 'es-decorators';
import PropTypes from 'prop-types';

import { FORM_ELEMENTS } from './constants';

import { get, post } from 'utils/request';

import { Router } from 'routes';
import Spinner from 'components/ui/Spinner';
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';

class PartnerForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      partnerID: props.partner,
      partnerName: '',
      partner: {},
      submitting: false,
      loading: false,
      logoFile: {},
      whiteLogoFile: {},
      coverFile: {},
      iconFile: {},
      dropzoneActive: false,
      form: {
        application: props.application,
        authorization: props.authorization
      }
    };
  }

  componentDidMount() {
    if (this.props.mode === 'edit' && this.state.partnerID) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `${process.env.BACKOFFICE_API_URL}/api/partners/${this.state.partnerID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        onSuccess: response => {
          const partner = response.data.attributes;
          this.setState({
            partner,
            partnerName: partner.name,
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
  handleCancelEditPartner() {
    Router.pushRoute('partners');
  }
  @Autobind
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.props.mode === 'edit') {
      post({
        type: 'PATCH',
        url: `${process.env.BACKOFFICE_API_URL}/api/partners/${this.state.partnerID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.partner,
        onSuccess: response => {
          console.log(response);
          alert('Partner updated successfully!');
          Router.pushRoute('partners');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    } else if (this.props.mode === 'new') {
      post({
        type: 'POST',
        url: `${process.env.BACKOFFICE_API_URL}/api/partners`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.user.token }
        ],
        body: this.state.partner,
        onSuccess: response => {
          console.log(response);
          alert(response.messages[0]);
          Router.pushRoute('partners');
        },
        onError: error => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    }
  }
  @Autobind
  changePartner(value) {
    const newPartner = Object.assign({}, this.state.partner, value);
    this.setState({ partner: newPartner });
  }

  /**
   * DROPZONE EVENTS
   * - onDropLogo
   * - onDropWhiteLogo
   * - onDropIcon
   * - onDropCover
  */
  @Autobind
  onDropLogo(files) {
    this.setState({ logoFile: files[0] });
  }
  @Autobind
  onDropWhiteLogo(files) {
    this.setState({ whiteLogoFile: files[0] });
  }
  @Autobind
  onDropIcon(files) {
    this.setState({ iconFile: files[0] });
  }
  @Autobind
  onDropCover(files) {
    this.setState({ coverFile: files[0] });
  }

  @Autobind
  handleChooseLogo() {
    this.dropzoneLogo.open();
  }
  @Autobind
  handleChooseWhiteLogo() {
    this.dropzoneWhiteLogo.open();
  }
  @Autobind
  handleChooseCover() {
    this.dropzoneCover.open();
  }
  @Autobind
  handleChooseIcon() {
    this.dropzoneIcon.open();
  }

  render() {
    const { partner, submitting, loading, partnerName, logoFile,
      whiteLogoFile, iconFile, coverFile } = this.state;
    const { mode } = this.props;
    return (
      <div>
        <Title className="-big">
          {partnerName}
        </Title>
        <Spinner className="-light" isLoading={loading} />
        <form className="c-form" onSubmit={this.handleSubmit}>
          {this.state.loading && 'loading'}
          <fieldset className="c-field-container">
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.name = c;
                }
              }}
              onChange={value => this.changePartner({ name: value })}
              validations={['required']}
              properties={{
                name: 'name',
                label: 'Name',
                type: 'text',
                required: true,
                value: partner.name
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.slug = c;
                }
              }}
              onChange={value => this.changePartner({ slug: value })}
              properties={{
                name: 'slug',
                label: 'Slug',
                type: 'text',
                value: partner.slug,
                disabled: true
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
              onChange={value => this.changePartner({ summary: value })}
              properties={{
                name: 'summary',
                label: 'Summary',
                type: 'text',
                value: partner.summary
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.body = c;
                }
              }}
              onChange={value => this.changeMetadata({ body: value })}
              properties={{
                name: 'body',
                label: 'Body',
                rows: '6',
                value: partner.body
              }}
            >
              {TextArea}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.contact_name = c;
                }
              }}
              onChange={value => this.changePartner({ contact_name: value })}
              properties={{
                name: 'contact_name',
                label: 'Contact name',
                type: 'text',
                value: partner.contact_name
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.contact_email = c;
                }
              }}
              onChange={value => this.changePartner({ contact_email: value })}
              properties={{
                name: 'contact_email',
                label: 'Contact email',
                type: 'text',
                value: partner.contact_email
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.contact_email = c;
                }
              }}
              onChange={value => this.changePartner({ website: value })}
              properties={{
                name: 'website',
                label: 'Website',
                type: 'text',
                value: partner.website
              }}
            >
              {Input}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.partner_type = c;
                }
              }}
              onChange={value => this.changePartner({ partner_type: value })}
              validations={['required']}
              options={[{ label: 'Founding partners', value: 'Founding partners' },
                        { label: 'Funders', value: 'Funders' }]}
              properties={{
                name: 'partner_type',
                label: 'Partnet type',
                type: 'text',
                value: partner.partner_type,
                instanceId: 'selectLanguage'
              }}
            >
              {Select}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.featured = c;
                }
              }}
              onChange={value => this.changePartner({ featured: value.checked })}
              properties={{
                name: 'featured',
                label: 'Featured',
                checked: partner.featured
              }}
            >
              {Checkbox}
            </Field>
            <Field
              ref={c => {
                if (c) {
                  FORM_ELEMENTS.elements.featured = c;
                }
              }}
              onChange={value => this.changePartner({ published: value.checked })}
              properties={{
                name: 'published',
                label: 'Published',
                checked: partner.published
              }}
            >
              {Checkbox}
            </Field>
            <div>
              <Dropzone
                ref={(node) => { this.dropzoneLogo = node; }}
                className="c-dropzone"
                disableClick={true}
                onDrop={this.onDropLogo}
              >
                <div className="dropzone-file-input">
                  <button
                    type="button"
                    className="c-btn -primary -light"
                    onClick={this.handleChooseLogo}
                  >
                    Choose logo
                  </button>
                  {logoFile.name}
                </div>
              </Dropzone>
            </div>
            <div>
              <Dropzone
                ref={(node) => { this.dropzoneWhiteLogo = node; }}
                className="c-dropzone"
                disableClick={true}
                onDrop={this.onDropWhiteLogo}
              >
                <div className="dropzone-file-input">
                  <button
                    type="button"
                    className="c-btn -primary -light"
                    onClick={this.handleChooseWhiteLogo}
                  >
                    Choose white logo
                  </button>
                  {whiteLogoFile.name}
                </div>
              </Dropzone>
            </div>
            <div>
              <Dropzone
                ref={(node) => { this.dropzoneCover = node; }}
                className="c-dropzone"
                disableClick={true}
                onDrop={this.onDropCover}
              >
                <div className="dropzone-file-input">
                  <button
                    type="button"
                    className="c-btn -primary -light"
                    onClick={this.handleChooseCover}
                  >
                    Choose cover
                  </button>
                  {coverFile.name}
                </div>
              </Dropzone>
            </div>
            <div>
              <Dropzone
                ref={(node) => { this.dropzoneIcon = node; }}
                className="c-dropzone"
                disableClick={true}
                onDrop={this.onDropIcon}
              >
                <div className="dropzone-file-input">
                  <button
                    type="button"
                    className="c-btn -primary -light"
                    onClick={this.handleChooseIcon}
                  >
                    Choose icon
                  </button>
                  {iconFile.name}
                </div>
              </Dropzone>
            </div>
          </fieldset>
          <div className="button-bar">
            <Button
              onClick={this.handleCancelEditPartner}
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
              {mode === 'edit' && 'Update partner'}
              {mode === 'new' && 'Create partner'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

PartnerForm.propTypes = {
  partner: PropTypes.string,
  application: PropTypes.string.isRequired,
  authorization: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

export default PartnerForm;
