import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';
// import DatasetsTab from 'components/admin/data/datasets';
// import WidgetsTab from 'components/admin/data/widgets';
// import LayersTab from 'components/admin/data/layers';

// services
import { fetchDataset } from 'services/dataset';
import { fetchLayer } from 'services/LayersService';
import { fetchWidget } from 'services/widget';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

// const DatasetsTab = dynamic(() => import('../../../components/admin/data/datasets'));
// const WidgetsTab = dynamic(() => import('../../../components/admin/data/widgets'));
// const LayersTab = dynamic(() => import('../../../components/admin/data/layers'));
const AdminTabs = dynamic({
  modules: () => {
    const components = {
      DatasetsTab: () => import('../../../components/admin/data/datasets').then(module => module.default),
      WidgetsTab: () => import('../../../components/admin/data/widgets').then(module => module.default),
      LayersTab: () => import('../../../components/admin/data/layers').then(module => module.default)
    };

    return components;
  },
  render: ({ tab }, { DatasetsTab, WidgetsTab, LayersTab }) => (
    <div>
      {(tab === 'datasets') && (<DatasetsTab />)}
      {(tab === 'widgets') && (<WidgetsTab />)}
      {(tab === 'layers') && (<LayersTab />)}
    </div>
  )
});

class LayoutAdminDataDetail extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  state= { data: null }

  componentWillMount() {
    const { query: { id } } = this.props;

    if (id === 'new') return;

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
    const { query: { tab, id } } = this.props;

    if (tab === 'datasets') {
      fetchDataset(id)
        .then((dataset) => { this.setState({ data: dataset }); })
        .catch((err) => { toastr.error('Error', err.message); });
    }

    if (tab === 'widgets') {
      fetchWidget(id)
        .then((widget) => { this.setState({ data: widget }); })
        .catch((err) => { toastr.error('Error', err.message); });
    }

    if (tab === 'layers') {
      fetchLayer(id)
        .then((layer) => { this.setState({ data: layer }); })
        .catch((err) => { toastr.error('Error', err.message); });
    }
  }


  render() {
    const { query: { tab, dataset } } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Data detail..."
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
                <AdminTabs tab={tab} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminDataDetail;
