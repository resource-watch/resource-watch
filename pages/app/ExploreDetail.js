import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import classNames from 'classnames';
import { resetDataset, toggleLayerShown } from 'redactions/exploreDetail';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';

// Components
import Page from 'components/app/layout/Page';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';
import Sidebar from 'components/app/layout/Sidebar';
import Map from 'components/vis/Map';
import Legend from 'components/ui/Legend';
import LayerManager from 'utils/layers/LayerManager';
import DatasetService from 'services/DatasetService';

const breadcrumbs = [
  { name: 'Home', url: 'home' },
  { name: 'Explore', url: 'explore' }
];

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

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
      mapSectionOpened: false,
      loading: false,
      layers: []
    };

    // DatasetService
    this.datasetService = new DatasetService(this.props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });

    // BINDINGS
    this.triggerOpenLayer = this.triggerOpenLayer.bind(this);
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
        console.log(error);
        this.setState({
          loading: false
        });
      });
    });
  }

  getOpenMapButton() {
    const { mapSectionOpened, dataset } = this.state;
    const hasDefaultLayer = dataset && dataset.attributes.layer &&
      dataset.attributes.layer.find(value => value.attributes.default === true);
    const buttonText = (mapSectionOpened) ? 'Active' : 'Open in data map';
    const buttonClass = classNames({
      '-active': hasDefaultLayer,
      '-primary': true,
      '-fullwidth': true
    });

    if (hasDefaultLayer) {
      return (
        <Button
          properties={{
            className: buttonClass
          }}
          onClick={this.triggerOpenLayer}
        >
          {buttonText}
        </Button>
      );
    }
    return (
      <Button
        properties={{
          disabled: true,
          className: '-primary -fullwidth -disabled'
        }}
      >
        Not displayable
      </Button>

    );
  }

  triggerOpenLayer() {
    const { dataset } = this.state;
    const defaultLayer = dataset.attributes.layer.find(
      value => value.attributes.default === true);

    this.setState(
      {
        layers: [defaultLayer.attributes],
        mapSectionOpened: !this.state.mapSectionOpened
      }
    );
  }

  triggerDownload() {
    console.info('triggerDownload');
  }

  render() {
    const { dataset, loading, layers } = this.state;
    const metadata = dataset && dataset.attributes.metadata;

    // const similarDatasetsSectionClass = classNames({
    //   row: true,
    //   'similar-datasets-row': true,
    //   '-active': exploreDetail.similarDatasets.list.filter(value =>
    //               value.id !== this.props.datasetID
    //             ).length > 0
    // });

    const pageStructure = (
      <div className="c-page c-page-explore-detail">
        <div className="row">
          <div className="column small-12">
            <Breadcrumbs items={breadcrumbs} />
            <Title className="-primary -huge title" >{ dataset && dataset.attributes &&
                dataset.attributes.name}</Title>
          </div>
        </div>
        <div className="row widget-row">
          <div className="column small-12 ">
            <h2>WidgetEditor</h2>
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
          <div className="column small-3 actions">
            {dataset && this.getOpenMapButton()}
            <Button
              properties={{
                disabled: true,
                className: '-primary -fullwidth -disabled'
              }}
              onClick={this.triggerDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    );

    // <div>
    //   <div className="column small-12">
    //     <Title className="-secondary title">
    //       Similar datasets
    //     </Title>
    //   </div>
    //   <div className="column small-12">
    //     <DatasetList
    //       active={exploreDetail.similarDatasets.list.map(value => value.id)}
    //       list={exploreDetail.similarDatasets.list.filter(value =>
    //         value.id !== this.props.datasetID
    //       )}
    //       mode="grid"
    //     />
    //     <Spinner
    //       isLoading={exploreDetail.similarDatasets.loading}
    //       className="-relative"
    //     />
    //   </div>
    // </div>

    if (!this.state.mapSectionOpened) {
      return (
        <Page
          title="Explore detail"
          description="Explore detail description..."
        >
          <div className="c-page-explore-detail">
            {pageStructure}
          </div>
        </Page>
      );
    }

    return (
      <Page
        title="Explore detail"
        description="Explore detail description..."
      >
        <div className="c-page-explore-detail">
          <Sidebar>
            {pageStructure}
          </Sidebar>
          <Map
            LayerManager={LayerManager}
            mapConfig={mapConfig}
            layersActive={layers}
          />
          <Legend
            layersActive={layers}
            className={{ color: '-dark' }}
          />
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail)
