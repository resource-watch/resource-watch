import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';
import isEqual from 'react-fast-compare';

// components
import Layout from 'layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DatasetsTab from 'components/admin/data/datasets';
import WidgetsTab from 'components/admin/data/widgets';
import LayersTab from 'components/admin/data/layers';

// services
import { fetchDataset } from 'services/dataset';
import { fetchLayer } from 'services/layer';
import { fetchWidget } from 'services/widget';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminDataDetail extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  state= { data: null }

  UNSAFE_componentWillMount() {
    const { query: { id } } = this.props;

    if (id === 'new') return;

    this.getData();
  }

  componentDidUpdate(prevProps) {
    const { query } = this.props;
    const { query: prevQuery } = prevProps;
    const queryChanged = !isEqual(query, prevQuery);

    if (queryChanged && query.id && query.id !== 'new') this.getData();
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
                    (<Breadcrumbs
                      items={[{ name: capitalizeFirstLetter(tab), route: 'admin_data_detail', params: { tab: 'datasets', subtab: tab, id: dataset } }]}
                    />)
                  }
                  {!dataset &&
                    (<Breadcrumbs
                      items={[{ name: capitalizeFirstLetter(tab), route: 'admin_data', params: { tab } }]}
                    />)
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
