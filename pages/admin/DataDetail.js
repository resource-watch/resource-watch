import React from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

// Services
import DatasetsService from 'services/DatasetsService';
import WidgetsService from 'services/WidgetsService';
import LayersService from 'services/LayersService';

// Layout
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// Tabs
import DatasetsTab from 'components/admin/datasets/DatasetsTab';
import WidgetsTab from 'components/admin/widgets/WidgetsTab';
import LayersTab from 'components/admin/layers/LayersTab';

class DataDetail extends Page {
  constructor(props) {
    super(props);

    const { tab, id, subtab, dataset } = props.url.query;

    this.state = {
      tab,
      id,
      subtab,
      data: {},
      dataset
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    const { tab, id, subtab, dataset } = nextProps.url.query;

    this.setState({
      tab, id, subtab, dataset
    }, () => {
      this.getData();
    });
  }


  /**
   * HELPERS
   * - getName
   * - getData
  */
  getName() {
    const { tab, id, data } = this.state;

    if (id === 'new') {
      return `New ${singular(tab)}`;
    }

    if (data.name) {
      return data.name;
    }

    return '-';
  }

  getData() {
    const { tab, id } = this.state;

    this.service = null;
    switch (tab) {
      case 'datasets':
        if (id !== 'new') {
          this.service = new DatasetsService({
            language: this.props.locale
          });
        }
        break;

      case 'widgets':
        if (id !== 'new') {
          this.service = new WidgetsService();
        }
        break;

      case 'layers':
        if (id !== 'new') {
          this.service = new LayersService();
        }
        break;

      default:
    }

    if (this.service) {
      // Fetch the dataset / layer / widget depending on the tab
      this.service.fetchData({ id })
        .then((data) => {
          this.setState({ data });
        })
        .catch((err) => {
          toastr.error('Error', err);
        });
    }
  }


  render() {
    const { url, user } = this.props;
    const { tab, subtab, id, dataset } = this.state;

    return (
      <Layout
        title={this.getName()}
        description="Data detail..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
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
                {tab === 'datasets' &&
                  <DatasetsTab tab={tab} subtab={subtab} id={id} />
                }

                {tab === 'widgets' &&
                  <WidgetsTab tab={tab} subtab={subtab} id={id} dataset={dataset} />
                }

                {tab === 'layers' &&
                  <LayersTab tab={tab} subtab={subtab} id={id} dataset={dataset} />
                }
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

DataDetail.propTypes = {
  user: PropTypes.object,
  url: PropTypes.object,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale
});


export default withRedux(initStore, mapStateToProps, null)(DataDetail);
