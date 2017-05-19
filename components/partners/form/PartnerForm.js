import React from 'react';
import { Form, Text, Select, Textarea, Checkbox } from 'react-form';
import { Autobind } from 'es-decorators';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import { get, post } from 'utils/request';

import Title from 'components/ui/Title';

class PartnerForm extends React.Component {
  constructor(props) {
    super(props);
    const newState = Object.assign({}, STATE_DEFAULT, {
      partnerID: props.partner,
      partnerName: '',
      partner: {},
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
          const partner = response.data.attributes.metadata;
          this.setState({
            partnerName: response.data.attributes.name,
            form: (partner && partner.length) ? this.setFormFromParams(partner[0].attributes) : this.state.form,
            partner,
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

  render() {
    return (
      <div>
        <Title className="-big">
          {this.state.partnerName}
        </Title>
        <Form
          onSubmit={values => {
            console.log('Success!', values);
          }}
          validate={({ name }) => {
            return {
              name: !name ? 'A name is required' : undefined
            };
          }}
        >
          {({ submitForm }) => {
            return (
              <form onSubmit={submitForm}>
                <div>
                  <h5>Name</h5>
                  <Text field="name" />
                </div>
                <div>
                  <h5>Slug</h5>
                  <Text field="slug" />
                </div>
                <div>
                  <h5>Summary</h5>
                  <Text field="summary" disabled />
                </div>
                <div>
                  <h5>Body</h5>
                  <Textarea field="body" />
                </div>
                <div>
                  <h5>Contact name</h5>
                  <Text field="contact_name" />
                </div>
                <div>
                  <h5>Contact email</h5>
                  <Text field="contact_email" />
                </div>
                <div>
                  <h5>Website</h5>
                  <Text field="website" />
                </div>
                <div>
                  <h5>Partner type</h5>
                  <Select
                    field="partner_type"
                    options={[{
                      label: 'Founding partners',
                      value: 'Founding partners'
                    }, {
                      label: 'Funder',
                      value: 'Funder'
                    }]}
                  />
                </div>
                <div>
                  <label>
                    <Checkbox
                      field="featured"
                    />
                    <span>Featured</span>
                  </label>
                </div>
                <div>
                  <label>
                    <Checkbox
                      field="published"
                    />
                  <span>Published</span>
                  </label>
                </div>
                <button type="submit">Submit</button>
              </form>
            );
          }}
        </Form>
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
