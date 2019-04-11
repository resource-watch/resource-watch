import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-admin';
import PartnersNew from 'components/admin/partners/pages/new';
import PartnersShow from 'components/admin/partners/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// services
import { fetchPartner } from 'services/PartnersService';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminPartnersDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  state = { data: null }

  componentWillMount() {
    const { query: { id } } = this.props;

    if (id === 'new') return;

    fetchPartner(id)
      .then((data) => { this.setState({ data }); })
      .catch((err) => { toastr.error('Error', err); });
  }

  getName() {
    const { query: { tab, id } } = this.props;
    const { data } = this.state;

    if (id === 'new') return `New ${singular(tab)}`;
    if (data && data.name) return data.name;

    return '-';
  }

  render() {
    const {
      query: { tab, id },
      user: { token }
    } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Partners detail..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_partners', params: { tab } }]}
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
                {(token && id) && (id === 'new') && (<PartnersNew />)}
                {(token && id) && (id !== 'new') && (<PartnersShow />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}


export default LayoutAdminPartnersDetail;
