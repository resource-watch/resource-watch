import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { resetDataset, toggleLayerShown } from 'redactions/exploreDetail';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';

// Next
import { Link } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/Icon';
// import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';
import DatasetService from 'services/DatasetService';
import WidgetEditor from 'components/widgets/WidgetEditor';

class ExploreDetail extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  constructor(props) {
    super(props);

    this.state = {
      similarDatasetsLoaded: false,
      dataset: null,
      loading: false
    };

    // DatasetService
    this.datasetService = new DatasetService(this.props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.getDataset();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.datasetID !== nextProps.datasetID) {
      this.props.resetDataset();
      this.setState({
        similarDatasetsLoaded: false,
        datasetRawDataLoaded: false,
        datasetLoaded: false
      }, () => {
        this.getDataset();
      });
    }
  }

  componentWillUnmount() {
    this.props.resetDataset();
  }

  getDataset() {
    this.setState({
      loading: true
    }, () => {
      this.datasetService.fetchData('layer,metadata').then((response) => {
        this.setState({
          dataset: response,
          datasetLoaded: true,
          loading: false
        });
      }).catch((error) => {
        console.error(error);
        this.setState({
          loading: false
        });
      });
    });
  }

  getOpenMapButton() {
    const { dataset } = this.state;
    const hasDefaultLayer = dataset && dataset.attributes.layer &&
      dataset.attributes.layer.find(value => value.attributes.default === true);


    if (hasDefaultLayer) {
      return (
        <Link route="explore" params={{ active: [dataset.id] }}>
          <a className="c-button -primary -fullwidth">
            Open in data map
          </a>
        </Link>
      );
    }
    return (
      <button
        disabled
        className="c-button -primary -fullwidth -disabled"
      >
        Not displayable
      </button>
    );
  }

  triggerDownload() {
    console.info('triggerDownload');
  }

  render() {
    const { dataset, loading } = this.state;
    const metadata = dataset && dataset.attributes.metadata;

    return (
      <Page
        title="Explore detail"
        description="Explore detail description..."
        pageHeader
      >
        <div className="c-page-explore-detail">
          <div className="c-page-explore-detail">
            <div className="c-page-header">
              <div className="l-container">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: 'Explore datasets', url: 'explore' }]}
                  />

                  <Title className="-primary -huge page-header-title" >
                    { dataset && dataset.attributes && dataset.attributes.name}
                  </Title>

                  <div className="page-header-info">
                    <ul>
                      <li>Source: {(metadata && metadata.length > 0 && metadata[0].source) || '-'}</li>
                      <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>
                      {/* Favorites <li>Last update: {dataset && dataset.attributes && dataset.attributes.updatedAt}</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="column small-12 ">
                {dataset &&
                  <WidgetEditor
                    dataset={dataset.id}
                  />
                }
                <Spinner
                  isLoading={loading}
                  className="-light"
                />
              </div>
            </div>
            <div className="row description-row">
              <div className="column small-2 social" >
                <Icon name="icon-twitter" className="-small" />
                <Icon name="icon-facebook" className="-small" />
              </div>
              <div className="column small-7">
                {/* Description */}
                {metadata && (metadata.length > 0)
                  && metadata[0].attributes.description &&
                  <p>{metadata[0].attributes.description}</p>
                }
              </div>
              <div className="column small-3">
                {dataset && this.getOpenMapButton()}
                <button
                  disabled
                  className="c-button -primary -fullwidth -disabled"
                  onClick={this.triggerDownload}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

ExploreDetail.propTypes = {
  datasetID: React.PropTypes.string.isRequired,
  // ACTIONS
  resetDataset: React.PropTypes.func
};

const mapStateToProps = state => ({
  exploreDetail: state.exploreDetail,
  layersShown: updateLayersShown(state)
});

const mapDispatchToProps = dispatch => ({
  resetDataset: () => {
    dispatch(resetDataset());
  },
  toggleLayerShown: (id) => {
    dispatch(toggleLayerShown(id));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
