import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';

// Services
import { createWidget } from 'services/widget';
import { fetchDatasets } from 'services/dataset';

// Widget Editor
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// Utils
import DefaultTheme from 'utils/widgets/theme';

// Components
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// Utils
import { logEvent } from 'utils/analytics';

class WidgetsNew extends React.Component {
  static propTypes = {
    dataset: PropTypes.string,
    // Store
    user: PropTypes.object.isRequired
  };

  static defaultProps = { dataset: null };

  state = {
    loading: false,
    loadingPublishedDatasets: true,
    loadingUserDatasets: true,
    datasets: [],
    selectedDataset: this.props.dataset
  };

  UNSAFE_componentWillMount() {
    this.loadDatasets();
  }

  onSaveWidget = (data) => {
    const { selectedDataset } = this.state;
    const { user } = this.props;
    // The widget creation endpoint expects the application property to be
    // of array type
    const newWidget = {
      ...data.attributes,
      published: false,
      application: process.env.APPLICATIONS.split(','),
      env: process.env.API_ENV
    };

    logEvent('My RW', 'User creates new widget', this.state.datasets.find(d => d.id === this.state.selectedDataset).label);

    this.setState({ loading: true });

    createWidget(newWidget, selectedDataset, user.token)
      .then(() => {
        Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
        toastr.success('Success', 'Widget created successfully!');
      }).catch((err) => {
        this.setState({ loading: false });
        toastr.error('Error', err);
      });
  }

  loadDatasets() {
    fetchDatasets({ published: true, includes: 'metadata', 'page[size]': 999999 }).then((response) => {
      this.setState({
        datasets: [...this.state.datasets, ...response.map((dataset) => {
          const metadata = dataset.metadata[0];
          return ({
            id: dataset.id,
            type: dataset.type,
            provider: dataset.provider,
            tableName: dataset.tableName,
            label: metadata && metadata.info
              ? metadata.info.name
              : dataset.name,
            value: dataset.id
          });
        })],
        loadingPublishedDatasets: false
      });
    });

    fetchDatasets({ userId: this.props.user.id, includes: 'metadata' })
      .then((response) => {
        this.setState({
          datasets: [...this.state.datasets, ...response.map((dataset) => {
            const metadata = dataset.metadata[0];
            return ({
              id: dataset.id,
              type: dataset.type,
              provider: dataset.provider,
              tableName: dataset.tableName,
              label: metadata && metadata.info
                ? metadata.info.name
                : dataset.name,
              value: dataset.id
            });
          })],
          loadingUserDatasets: false
        });
      });
  }

  handleDatasetSelected = (value) => {
    this.setState({ selectedDataset: value });
  }

  render() {
    const {
      loading,
      datasets,
      selectedDataset,
      loadingUserDatasets,
      loadingPublishedDatasets
    } = this.state;

    return (
      <div className="c-myrw-widgets-new">
        <Spinner
          className="-light"
          isLoading={loading || loadingPublishedDatasets || loadingUserDatasets}
        />
        {datasets &&
          <div className="dataset-selector">
            <Field
              onChange={this.handleDatasetSelected}
              className="-fluid"
              options={datasets}
              properties={{
                name: 'dataset',
                label: 'Dataset',
                value: selectedDataset,
                default: selectedDataset,
                required: true,
                instanceId: 'selectDataset'
              }}
            >
              {Select}
            </Field>
          </div>
        }
        {selectedDataset &&
          <div>
            <WidgetEditor
              datasetId={selectedDataset}
              application="rw"
              onSave={this.onSaveWidget}
              theme={DefaultTheme}
              adapter={RwAdapter}
              authenticated
              disable={['advanced-editor']}
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, null)(WidgetsNew);
