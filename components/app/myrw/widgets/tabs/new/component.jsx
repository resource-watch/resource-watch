import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'next/router';
import WidgetEditor from '@widget-editor/widget-editor';

// components
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// services
import { createWidget, createWidgetMetadata } from 'services/widget';
import { fetchDatasets } from 'services/dataset';

// constants
import {
  WIDGET_EDITOR_DEFAULT_THEME,
  WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES,
  WIDGET_EDITOR_COLOUR_SCHEMES,
  WIDGET_EDITOR_MAPBOX_PROPS,
} from 'constants/widget-editor';

class MyRWWidgetNewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingPublishedDatasets: true,
      loadingUserDatasets: true,
      datasets: [],
      selectedDataset: props.dataset,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.loadDatasets();
  }

  onSaveWidget = (data) => {
    const { datasets, selectedDataset } = this.state;
    const { user, router } = this.props;
    // The widget creation endpoint expects the application property to be
    // of array type

    const newWidget = {
      name: data.name,
      description: data.description,
      widgetConfig: data.widgetConfig,
      published: false,
      application: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
      env: process.env.NEXT_PUBLIC_API_ENV,
    };

    this.setState({ loading: true });

    createWidget(newWidget, selectedDataset, user.token)
      .then((widgetResult) => {
        // we need to create the metadata object for the new widget in the case
        // where the user entered a caption value for it
        createWidgetMetadata(
          widgetResult.id,
          widgetResult.dataset,
          {
            language: 'en',
            info: { caption: data.metadata.caption },
          },
          user.token,
        ).then(() => {
          router.push('/myrw/widgets/my_widgets');
          toastr.success('Success', 'Widget created successfully!');
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        toastr.error('Error', err);
      });
  };

  handleDatasetSelected = (value) => {
    this.setState({ selectedDataset: value });
  };

  loadDatasets() {
    const { user } = this.props;
    fetchDatasets({
      published: true,
      includes: 'metadata',
      sort: 'name',
      'page[size]': 999999,
    }).then((response) => {
      this.setState((prevState) => ({
        datasets: [
          ...prevState.datasets,
          ...response.map((dataset) => {
            const metadata = dataset.metadata[0];
            return {
              id: dataset.id,
              type: dataset.type,
              provider: dataset.provider,
              tableName: dataset.tableName,
              label: metadata && metadata.info ? metadata.info.name : dataset.name,
              value: dataset.id,
            };
          }),
        ],
        loadingPublishedDatasets: false,
      }));
    });

    fetchDatasets({ userId: user.id, includes: 'metadata' }).then((response) => {
      this.setState((prevState) => ({
        datasets: [
          ...prevState.datasets,
          ...response.map((dataset) => {
            const metadata = dataset.metadata[0];
            return {
              id: dataset.id,
              type: dataset.type,
              provider: dataset.provider,
              tableName: dataset.tableName,
              label: metadata && metadata.info ? metadata.info.name : dataset.name,
              value: dataset.id,
            };
          }),
        ],
        loadingUserDatasets: false,
      }));
    });
  }

  render() {
    const { loading, datasets, selectedDataset, loadingUserDatasets, loadingPublishedDatasets } =
      this.state;
    const { RWAdapter } = this.props;

    return (
      <div className="c-myrw-widgets-new">
        <Spinner
          className="-light"
          isLoading={loading || loadingPublishedDatasets || loadingUserDatasets}
        />
        {datasets && (
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
                instanceId: 'selectDataset',
              }}
            >
              {Select}
            </Field>
          </div>
        )}
        {selectedDataset && (
          <WidgetEditor
            datasetId={selectedDataset}
            onSave={this.onSaveWidget}
            theme={WIDGET_EDITOR_DEFAULT_THEME}
            adapter={RWAdapter}
            map={WIDGET_EDITOR_MAPBOX_PROPS}
            schemes={WIDGET_EDITOR_COLOUR_SCHEMES}
            authenticated
            disable={[...WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES, 'advanced-editor']}
          />
        )}
      </div>
    );
  }
}

MyRWWidgetNewTab.defaultProps = {
  dataset: null,
};

MyRWWidgetNewTab.propTypes = {
  dataset: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  RWAdapter: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(MyRWWidgetNewTab);
