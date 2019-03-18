import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-admin';
import PagesNew from 'components/admin/pages/pages/new';
import PagesShow from 'components/admin/pages/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// actions
import { fetchStaticPage } from 'services/static-page';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminPagesDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  state = { data: null }

  componentWillMount() {
    const { query: { id } } = this.props;

    if (id === 'new') return;

    fetchStaticPage(id)
      .then((data) => { this.setState({ data }); })
      .catch((err) => { toastr.error('Error', err); });
  }

  getName() {
    const { query: { tab, id } } = this.props;
    const { data } = this.state;

    if (id === 'new') return `New ${singular(tab)}`;
    if (data && data.title) return data.title;

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
        description="Pages detail..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_pages', params: { tab } }]}
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
                {token && id && id === 'new' && <PagesNew />}
                {token && id && id !== 'new' && (<PagesShow />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}


export default LayoutAdminPagesDetail;
