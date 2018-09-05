import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';

// Services
import WidgetService from 'services/WidgetService';
import DatasetsService from 'services/DatasetsService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'widget-editor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// Utils
import { logEvent } from 'utils/analytics';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

class WidgetsNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingPublishedDatasets: true,
      loadingUserDatasets: true,
      submitting: false,
      datasets: [],
      selectedDataset: props.dataset,
      widget: {}
    };

    // Services
    this.widgetService = new WidgetService(null, { apiURL: process.env.WRI_API_URL });
    this.datasetsService = new DatasetsService({
      language: props.locale
    });

    // ------------------- Bindings -----------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDatasetSelected = this.handleDatasetSelected.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadDatasets();
  }

  async onSubmit(event) {
    if (event) event.preventDefault();

    const { widget, selectedDataset } = this.state;
    const { user } = this.props;

    logEvent('My RW', 'User creates new widget', this.state.datasets.find(d => d.id === this.state.selectedDataset).label);

    this.setState({ loading: true });

    setTimeout(async () => {
      const widgetConfig = (this.onGetWidgetConfig) ? await this.getWidgetConfig() : {};

      const widgetObj = Object.assign(
        {},
        widget,
        { widgetConfig }
      );

      this.widgetService.saveUserWidget(widgetObj, selectedDataset, user.token)
        .then((response) => {
          if (response.errors) {
            const errorMessage = response.errors[0].detail;
            this.setState({
              saved: false,
              loading: false
            });

            toastr.error('Error', errorMessage);
          } else {
            Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
            toastr.success('Success', 'Widget created successfully!');
          }
        }).catch((err) => {
          this.setState({
            saved: false,
            loading: false
          });
          toastr.err('Error', err);
        });
    }, 0);
  }

  getWidgetConfig() {
    return this.onGetWidgetConfig()
      .then(widgetConfig => widgetConfig)
      .catch(() => ({}));
  }

  loadDatasets() {
    this.datasetsService.fetchAllData({ filters: { published: true }, includes: 'metadata' }).then((response) => {
      this.setState({
        datasets: [...this.state.datasets, ...response.map((dataset) => {
          const metadata = dataset.metadata[0];
          return ({
            id: dataset.id,
            type: dataset.type,
            provider: dataset.provider,
            tableName: dataset.tableName,
            label: metadata && metadata.attributes.info
              ? metadata.attributes.info.name
              : dataset.name,
            value: dataset.id
          });
        })],
        loadingPublishedDatasets: false
      });
    });

    this.datasetsService.fetchAllData(
      { filters: { userId: this.props.user.id }, includes: 'metadata' }).then((response) => {
      this.setState({
        datasets: [...this.state.datasets, ...response.map((dataset) => {
          const metadata = dataset.metadata[0];
          return ({
            id: dataset.id,
            type: dataset.type,
            provider: dataset.provider,
            tableName: dataset.tableName,
            label: metadata && metadata.attributes.info
              ? metadata.attributes.info.name
              : dataset.name,
            value: dataset.id
          });
        })],
        loadingUserDatasets: false
      });
    });
  }

  handleChange(value) {
    const newWidgetObj = Object.assign({}, this.state.widget, value);
    this.setState({ widget: newWidgetObj });
  }

  handleDatasetSelected(value) {
    this.setState({
      selectedDataset: value
    });
  }

  render() {
    const {
      loading,
      submitting,
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
            widgetId={null}
            saveButtonMode="never"
            embedButtonMode="never"
            titleMode="never"
            provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
          />
          <div className="form-container">
            <form className="form-container" onSubmit={this.onSubmit}>
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                  onChange={value => this.handleChange({ name: value })}
                  validations={['required']}
                  properties={{
                    title: 'title',
                    label: 'Title',
                    type: 'text',
                    required: true,
                    placeholder: 'Widget title'
                  }}
                >
                  {Input}
                </Field>
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
                  onChange={value => this.handleChange({ description: value })}
                  properties={{
                    title: 'description',
                    label: 'Description',
                    type: 'text',
                    placeholder: 'Widget description'
                  }}
                >
                  {Input}
                </Field>
              </fieldset>
              <div className="buttons-container">
                <Button
                  properties={{
                    type: 'submit',
                    disabled: submitting,
                    className: '-a'
                  }}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    );
  }
}

WidgetsNew.propTypes = {
  dataset: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(WidgetsNew);
