import React from 'react';

// components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import { Link } from 'routes';

// constants
import { FORM_COUNTRIES } from 'pages/app/newsletter/constants';

class NewsletterPage extends Page {
  render() {
    return (
      <Layout
        title="Newsletter"
        description="Sign up for the Resource Watch newsletter"
        className="p-newsletter"
        user={this.props.user}
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
                  Sign up for the Resource Watch newsletter
                </h2>
                <p>
                  Don’t miss our monthly newsletter, which includes information on
                  new datasets, exclusive tips and tricks for using the platform and the
                  latest stories on the pulse of the planet.
                </p>
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <form
                  className="c-form"
                  acceptCharset="UTF-8"
                  method="post"
                  action="https://go.pardot.com/l/120942/2018-01-25/3nzl13"
                  id="pardot-form"
                >
                  <div className="form-row">
                    <Field
                      validations={['required']}
                      className="-fluid"
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

                  { /* pardot honeypot field */ }
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

                  <div className="actions-container -align-right">
                    <button type="submit" className="c-btn -primary">
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
      </Layout>
    );
  }
}

export default NewsletterPage;
