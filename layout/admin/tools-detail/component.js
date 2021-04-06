import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-admin';
import ToolsNew from 'components/admin/tools/pages/new';
import ToolsShow from 'components/admin/tools/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

// services
import { fetchTool } from 'services/tools';

class LayoutAdminToolsDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  state = { data: null }

  UNSAFE_componentWillMount() {
    const { query: { id } } = this.props;

    if (id === 'new') return;

    fetchTool(id)
      .then((data) => { this.setState({ data }); })
      .catch((err) => { toastr.error('Error', err); });
  }

  getName() {
    const { tab, id, data } = this.state;

    if (id === 'new') {
      return `New ${singular(tab)}`;
    }

    if (data && data.title) {
      return data.title;
    }

    return '-';
  }

  render() {
    const {
      query: { tab, id },
      user: { token },
    } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Tools detail..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_tools', params: { tab } }]}
                  />
                  <Title className="-primary -huge page-header-title">
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
                {(token && id) && (id === 'new') && (<ToolsNew />)}
                {(token && id) && (id !== 'new') && (<ToolsShow />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminToolsDetail;
