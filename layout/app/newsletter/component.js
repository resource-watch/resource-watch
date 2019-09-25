import React, { PureComponent } from 'react';
import { Link } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';
import Modal from 'components/modal/modal-component';
import NewsletterConfirmationModal from 'components/modal/newsletter-confirmation-modal';

// constants
import { FORM_COUNTRIES } from './constants';

class LayoutNewsletter extends PureComponent {
  state = {
    modal: false,
    data: {}
  }

  onSubmit = () => { this.setState({ modal: true }); }

  onChange = (value) => { this.setState({ data: { ...this.state.data, ...value } }); }

  render() {
    const { modal } = this.state;

    return (
      <Layout
        title="Newsletter"
        description="Sign up for Resource Watch news"
        className="p-newsletter"
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: 'About', route: 'about' }]}
                  />
                  <h1>Newsletter</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="l-section">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <h2>
                  Sign up for Resource Watch news
                </h2>
                <p>
                  Don’t miss out on training announcements, our monthly newsletter,
                   exclusive tips for using the platform,
                   and the latest stories on the pulse of the planet.
                </p>
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <form
                  action={`${process.env.PARDOT_NEWSLETTER_URL}`}
                  onSubmit={this.onSubmit}
                  className="c-form"
                  id="pardot-form"
                >
                  <div className="form-row">
                    <Field
                      validations={['required']}
                      className="-fluid"
                      onChange={value => this.onChange({ first_name: value })}
                      properties={{
                        name: 'first_name',
                        label: 'First name',
                        type: 'text',
                        required: true
                      }}
                    >
                      {Input}
                    </Field>
                    <Field
                      validations={['required']}
                      className="-fluid"
                      onChange={value => this.onChange({ last_name: value })}
                      properties={{
                        name: 'last_name',
                        label: 'Last name',
                        type: 'text',
                        required: true
                      }}
                    >
                      {Input}
                    </Field>
                  </div>
                  <Field
                    validations={['required', 'email']}
                    className="-fluid"
                    onChange={value => this.onChange({ email: value })}
                    properties={{
                      name: 'email',
                      label: 'Email',
                      type: 'email',
                      required: true
                    }}
                  >
                    {Input}
                  </Field>
                  <div className="form-row">
                    <Field
                      validations={['required']}
                      className="-fluid"
                      onChange={value => this.onChange({ city: value })}
                      properties={{
                        name: 'city',
                        label: 'City',
                        type: 'text',
                        required: true
                      }}
                    >
                      {Input}
                    </Field>
                    <Field
                      validations={['required']}
                      className="-fluid"
                      onChange={value => this.onChange({ country: value })}
                      options={FORM_COUNTRIES.options}
                      properties={{
                        name: 'country',
                        label: 'Country',
                        type: 'text',
                        required: true
                      }}
                    >
                      {Select}
                    </Field>
                  </div>
                  <div className="form-row">
                    <Field
                      validations={['required']}
                      className="-fluid"
                      onChange={value => this.onChange({ company: value })}
                      properties={{
                        name: 'company',
                        label: 'Company',
                        type: 'text',
                        required: true
                      }}
                    >
                      {Input}
                    </Field>
                    <Field
                      className="-fluid"
                      onChange={value => this.onChange({ job_title: value })}
                      properties={{
                        name: 'job_title',
                        label: 'Job title',
                        type: 'text',
                        required: false
                      }}
                    >
                      {Input}
                    </Field>
                  </div>

                  <div className="form-row">
                    <Field
                      onChange={value =>
                        this.onChange({ resource_watch_feature_test_group: value.checked })}
                      properties={{
                        name: 'resource_watch_feature_test_group',
                        defaultChecked: true,
                        title: 'Are you interested in testing or providing feedback on new features?'
                      }}
                    >
                      {Checkbox}
                    </Field>
                  </div>
                  { /* pardot honeypot field */}
                  <Field
                    className="-pi-hidden"
                    properties={{
                      name: 'pi_extra_field',
                      label: 'Comments',
                      type: 'text',
                      required: false
                    }}
                  >
                    {Input}
                  </Field>

                  <div className="c-button-container -j-end">
                    <button
                      type="submit"
                      className="c-btn -primary"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage="/static/images/backgrounds/partners-02@2x.jpg">
                  <p className="-claim">
                    Let&rsquo;s build a more sustainable<br /> world together.
                  </p>
                  <Link to="about_partners">
                    <a className="c-btn -primary">Partners</a>
                  </Link>
                </Banner>
              </div>
            </div>
          </div>
        </aside>

        <Modal
          isOpen={modal}
          onRequestClose={() => this.setState({ modal: false })}
        >
          <NewsletterConfirmationModal />
        </Modal>
      </Layout>
    );
  }
}

export default LayoutNewsletter;
