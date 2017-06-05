import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import classNames from 'classnames';
import { getDataset, resetDataset, getSimilarDatasets, toggleLayerShown } from 'redactions/exploreDetail';

// Components
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
import ConfigurableWidget from 'components/app/explore/ConfigurableWidget';
import getQueryByFilters from 'utils/getQueryByFilters';
import DatasetService from 'services/DatasetService';

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Explore', url: '/explore' }
];

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

class ExploreDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      similarDatasetsLoaded: false,
      datasetRawDataLoaded: false,
      datasetLoaded: false,
      datasetData: null,
      mapSectionOpened: false,
      datasetDataError: false
    };

    // DatasetService
    this.datasetService = new DatasetService(this.props.params.id, {
      apiURL: '${process.env.WRI_API_URL}'
    });

    // BINDINGS
    this.triggerOpenLayer = this.triggerOpenLayer.bind(this);
  }

  componentWillMount() {
    this.props.getDataset(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.props.resetDataset();
      this.setState({
        similarDatasetsLoaded: false,
        datasetRawDataLoaded: false,
        datasetDataError: false,
        datasetLoaded: false
      }, () => {
        this.props.getDataset(this.props.params.id);
      });
    }

    const dataset = nextProps.exploreDetail.dataset.detail.attributes;

    if (dataset) {
      if (!this.props.exploreDetail.dataset.detail.attributes) {
        this.setState({ datasetLoaded: true });
      }

      if (dataset.vocabulary && dataset.vocabulary.length) {
        const vocabulary = dataset.vocabulary.find(v => v.attributes.name === 'legacy');
        if (vocabulary) {
          const tags = vocabulary.attributes.tags;
          if (!this.state.similarDatasetsLoaded) {
            this.setState({ similarDatasetsLoaded: true }, () => {
              this.props.getSimilarDatasets(tags);
            });
          }
        }
      }

      if (dataset.tableName) {
        if (!this.state.datasetRawDataLoaded) {
          this.getDatasetRawData(dataset);
        }
      } else if (this.state.datasetLoaded || dataset.application) {
        this.setState({
          datasetRawDataLoaded: true,
          datasetDataError: true
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetDataset();
  }

  getDatasetRawData(dataset) {
    const query = `${getQueryByFilters(dataset.tableName)} LIMIT 10`; // temporal fix
    this.datasetService.fetchFilteredData(query)
      .then((response) => {
        if (response) {
          this.setState({
            datasetRawDataLoaded: true,
            datasetData: response
          });
        } else {
          this.setState({
            datasetDataError: true,
            datasetRawDataLoaded: true
          });
        }
      })
      .catch((error) => {
        console.info('error', error);
        this.setState({
          datasetDataError: true,
          datasetRawDataLoaded: true
        });
      });
  }

  getOpenMapButton() {
    const { mapSectionOpened } = this.state;
    const { dataset } = this.props.exploreDetail;
    const hasDefaultLayer = !!dataset.detail.attributes.layer.find(
      value => value.attributes.default === true);
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
    const { dataset } = this.props.exploreDetail;

    this.setState(
      {
        mapSectionOpened: !this.state.mapSectionOpened
      }
    );

    const defaultLayerId = dataset.detail.attributes.layer.find(
      value => value.attributes.default === true).id;
    this.props.toggleLayerShown(defaultLayerId);
  }

  triggerDownload() {
    console.info('triggerDownload');
  }

  render() {
    const { exploreDetail } = this.props;
    const { dataset } = exploreDetail;
    const { layersShown } = this.props;
    const { datasetData } = this.state;

    const similarDatasetsSectionClass = classNames({
      row: true,
      'similar-datasets-row': true,
      '-active': exploreDetail.similarDatasets.list.filter(value =>
                  value.id !== this.props.params.id
                ).length > 0
    });

    const pageStructure = (
      <div className="c-page c-page-explore-detail">
        <div className="row">
          <div className="column small-12">
            <Breadcrumbs items={breadcrumbs} />
            <Title className="-primary -huge title" >{ dataset.detail.attributes &&
                dataset.detail.attributes.name}</Title>
          </div>
        </div>
        <div className="row widget-row">
          <div className="column small-12 ">
            {this.state.datasetRawDataLoaded && !this.state.datasetDataError &&
              <ConfigurableWidget
                dataset={dataset.detail}
                datasetData={datasetData}
              />
            }
            {this.state.datasetDataError &&
              <h3>No widget can be shown for this dataset</h3>
            }
            <Spinner
              isLoading={!this.state.datasetRawDataLoaded}
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
            {dataset.detail.attributes.metadata && (dataset.detail.attributes.metadata.length > 0)
              && dataset.detail.attributes.metadata[0].attributes.description &&
              <p>{dataset.detail.attributes.metadata[0].attributes.description}</p>
            }
          </div>
          <div className="column small-3 actions">
            {this.getOpenMapButton()}
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
        <div className={similarDatasetsSectionClass} >
          <div className="column small-12">
            <Title className="-secondary title">
              Similar datasets
            </Title>
          </div>
          <div className="column small-12">
            <DatasetList
              active={exploreDetail.similarDatasets.list.map(value => value.id)}
              list={exploreDetail.similarDatasets.list.filter(value =>
                value.id !== this.props.params.id
              )}
              mode="grid"
            />
            <Spinner
              isLoading={exploreDetail.similarDatasets.loading}
              className="-relative"
            />
          </div>
        </div>
      </div>
    );

    if (!this.state.mapSectionOpened) {
      return (
        <div className="c-page c-page-explore-detail">
          {pageStructure}
        </div>
      );
    }
    return (
      <div className="c-page c-page-explore-detail">
        <Sidebar>
          {pageStructure}
        </Sidebar>
        <Map
          LayerManager={LayerManager}
          mapConfig={mapConfig}
          layersActive={layersShown}
        />
        <Legend
          layersActive={layersShown}
          className={{ color: '-dark' }}
        />
      </div>
    );
  }
}

ExploreDetail.propTypes = {

  params: React.PropTypes.object,
  layersShown: React.PropTypes.array,

  // STORE
  exploreDetail: React.PropTypes.object,

  // ACTIONS
  getDataset: React.PropTypes.func,
  resetDataset: React.PropTypes.func,
  getSimilarDatasets: React.PropTypes.func,
  toggleLayerShown: React.PropTypes.func
};

const mapStateToProps = state => ({
  exploreDetail: state.exploreDetail,
  layersShown: updateLayersShown(state)
});

export default withRedux(initStore, mapStateToProps, { getDataset, resetDataset, getSimilarDatasets, toggleLayerShown })(ExploreDetail)
