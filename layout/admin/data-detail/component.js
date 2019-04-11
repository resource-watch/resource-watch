import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DatasetsTab from 'components/admin/data/datasets';
import WidgetsTab from 'components/admin/data/widgets';
import LayersTab from 'components/admin/data/layers';

// services
import DatasetsService from 'services/DatasetsService';
import WidgetsService from 'services/WidgetsService';
import { fetchLayer } from 'services/LayersService';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminDataDetail extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired
  }

  state= { data: null }

  componentWillMount() {
    this.getData();
  }

  getName() {
    const { query: { tab, id } } = this.props;
    const { data } = this.state;

    if (id === 'new') return `New ${singular(tab)}`;
    if (data && data.name) return data.name;

    return '-';
  }

  getData() {
    const {
      query: { tab, id },
      locale
    } = this.props;

    if (id === 'new') return;

    this.service = null;

    switch (tab) {
      case 'datasets':
        this.service = new DatasetsService({ language: locale });
        break;
      case 'widgets':
        this.service = new WidgetsService();
        break;
      default:
        this.service = new DatasetsService({ language: locale });
    }

    if (this.service) {
      // Fetch the dataset / layer / widget depending on the tab
      fetchLayer(id)
        .then((data) => { this.setState({ data }); })
        .catch((err) => { toastr.error('Error', err); });
    }
  }


  render() {
    const { query: { tab, dataset }, hostname } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Data detail..."
        hostname={hostname}
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  {dataset && tab !== 'datasets' &&
                    <Breadcrumbs
                      items={[{ name: capitalizeFirstLetter(tab), route: 'admin_data_detail', params: { tab: 'datasets', subtab: tab, id: dataset } }]}
                    />
                  }
                  {!dataset &&
                    <Breadcrumbs
                      items={[{ name: capitalizeFirstLetter(tab), route: 'admin_data', params: { tab } }]}
                    />
                  }
                  <h1>{this.getName()}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-page-section">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                {(tab === 'datasets') && (<DatasetsTab />)}
                {(tab === 'widgets') && (<WidgetsTab />)}
                {(tab === 'layers') && (<LayersTab />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminDataDetail;
