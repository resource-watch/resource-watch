import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';
import FaqsNew from 'components/admin/faqs/pages/new';
import FaqsShow from 'components/admin/faqs/pages/show';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminFaqsDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    hostname: PropTypes.string.isRequired
  }

  getName() {
    const { query: { id, subtab } } = this.props;

    if (id === 'new') return 'New FAQ';
    if (subtab === 'edit') return 'Edit FAQ';

    return '-';
  }

  render() {
    const {
      query: { tab, id },
      user: { token },
      hostname
    } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Faqs detail..."
        hostname={hostname}
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_faqs', params: { tab } }]}
                  />
                  <Title className="-primary -huge page-header-title" >
                    {this.getName()}
                  </Title>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                {token && id && id === 'new' && (<FaqsNew />)}
                {token && id && id !== 'new' && (<FaqsShow />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminFaqsDetail;
