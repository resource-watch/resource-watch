import React from 'react';
import Dropzone from 'react-dropzone';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import { get, post } from 'utils/request';

import { Router } from '../../../routes';
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
    const newState = Object.assign({}, STATE_DEFAULT, {
      partnerID: props.partner,
      partnerName: '',
      partner: {},
      submitting: false,
      loading: false,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.state = newState;
  }

  componentDidMount() {
    if (this.state.partnerID) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `${process.env.BACKOFFICE_API_URL}/api/partners/${this.state.partnerID}`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: process.env.TEMP_TOKEN }
        ],
        onSuccess: response => {
          const partner = response.data.attributes;
          this.setState({
            form: (partner && partner.length) ? this.setFormFromParams(partner[0].attributes) : this.state.form,
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

  handleCancelEditPartner() {
    Router.pushRoute('partners');
  }

  handleSubmit(event) {
    event.preventDefault();
    post({
      type: 'PUT',
      url: `${process.env.BACKOFFICE_API_URL}/api/partners/${this.state.partnerID}`,
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: process.env.TEMP_TOKEN }
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
  }

  changePartner(value) {
    const newPartner = Object.assign({}, this.state.partner, value);
    this.setState({ partner: newPartner });
  }

  render() {
    const { partner, submitting, loading, partnerName } = this.state;
    console.log(partner);
    return (
      <div>
        <Title className="-big">
          {partnerName}
        </Title>
        <Spinner className="-light" isLoading={loading} />
        <form className="c-form" onSubmit={this.handleSubmit} noValidate>
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
              ref={(c) => { if (c) FORM_ELEMENTS.elements.body = c; }}
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
              ref={(c) => { if (c) FORM_ELEMENTS.elements.partner_type = c; }}
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
              ref={(c) => { if (c) FORM_ELEMENTS.elements.featured = c; }}
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
              ref={(c) => { if (c) FORM_ELEMENTS.elements.featured = c; }}
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
              <Dropzone ref={(node) => { this.dropzoneRef = node; }} onDrop={(accepted, rejected) => { alert(accepted) }}>
                  <p>Drop files here.</p>
              </Dropzone>
              <button type="button" onClick={() => { this.dropzoneRef.open() }}>
                  Upload logo
              </button>
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
              Update partner
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

PartnerForm.propTypes = {
  partner: React.PropTypes.string.isRequired,
  application: React.PropTypes.string.isRequired,
  authorization: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func
};

export default PartnerForm;
