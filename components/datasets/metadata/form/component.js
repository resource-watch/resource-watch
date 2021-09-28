import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toastr } from 'react-redux-toastr';

// Service
import { fetchDataset, createMetadata, updateMetadata } from 'services/dataset';
import { fetchFields } from 'services/fields';

// Contants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/datasets/metadata/form/constants';

// Components
import Spinner from 'components/ui/Spinner';
import Navigation from 'components/form/Navigation';
import Step1 from 'components/datasets/metadata/form/steps/Step1';

// utils
import { getFieldUrl, getFields } from 'utils/fields';

class DatasetMetadataForm extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    setSources: PropTypes.func.isRequired,
    resetSources: PropTypes.func.isRequired,
  }

  static defaultProps = { onSubmit: null }

  state = {
    ...STATE_DEFAULT,
    metadata: [],
    columns: [],
    loading: !!this.props.dataset,
    loadingColumns: true,
    form: STATE_DEFAULT.form,
  };

  componentDidMount() {
    const { dataset, setSources } = this.props;
    const { form } = this.state;

    if (dataset) {
      fetchDataset(dataset, { includes: 'metadata' })
        .then((result) => {
          const {
            metadata,
            type,
            provider,
            env,
          } = result;
          this.setState({
            form: metadata && metadata.length ? this.setFormFromParams(metadata[0]) : form,
            metadata,
            type: type || 'tabular',
            env,
            // Stop the loading
            loading: false,
          });

          if (metadata[0]) {
            setSources(metadata[0].info.sources || []);
          }

          if (provider !== 'wms') {
            // fetchs column fields based on dataset type
            const url = getFieldUrl(result);
            fetchFields(url)
              .then((rawFields) => {
                const columns = getFields(rawFields, provider, type);
                this.setState({
                  columns,
                  loadingColumns: false,
                });
              })
              .catch(() => {
                this.setState({ loadingColumns: false });
              });
          } else {
            this.setState({ loadingColumns: false });
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          toastr.error('Error', err);
        });
    }
  }

  componentWillUnmount() {
    this.props.resetSources();
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   */
  onSubmit = (event) => {
    const {
      user: { token },
      onSubmit,
    } = this.props;
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid();
      if (valid) {
        const { dataset } = this.props;
        const { metadata, form } = this.state;

        // Start the submitting
        this.setState({ submitting: true });

        // Check if the metadata alerady exists
        const thereIsMetadata = Boolean(
          metadata.find((m) => {
            const hasLang = m.language === form.language;
            const hasApp = m.application === form.application;

            return hasLang && hasApp;
          }),
        );

        // Set the request
        const requestOptions = { type: dataset && thereIsMetadata ? 'PATCH' : 'POST' };

        // update metadata flow
        if (requestOptions.type === 'PATCH') {
          updateMetadata(dataset, form, token)
            .then(() => {
              toastr.success('Success', 'Metadata has been updated correctly');
              if (onSubmit) onSubmit();
            })
            .catch(() => { toastr.error('Error', 'There was an error updating the metadata.'); })
            .finally(() => { this.setState({ submitting: false }); });
        }

        // creation metadata flow
        if (requestOptions.type === 'POST') {
          createMetadata(dataset, form, token)
            .then(() => {
              toastr.success('Success', 'Metadata has been updated correctly');
              if (onSubmit) onSubmit();
            })
            .catch(() => { toastr.error('Error', 'There was an error updateing the metadata.'); })
            .finally(() => { this.setState({ submitting: false }); });
        }
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange = (obj) => {
    const form = { ...this.state.form, ...obj.form };
    this.setState({ form });
  }

  onStepChange = (step) => {
    this.setState({ step });
  }

  // HELPERS
  setFormFromParams(params) {
    const form = Object.keys(this.state.form);
    const newForm = {};

    form.forEach((f) => {
      if (params[f] || this.state.form[f]) {
        newForm[f] = params[f] || this.state.form[f];
      }
    });

    return newForm;
  }

  render() {
    const {
      loading,
      columns,
      type,
      form,
      loadingColumns,
      stepLength,
      submitting,
      step,
      env,
    } = this.state;
    const disabled = process.env.NEXT_PUBLIC_ENVS_EDIT.split(',').findIndex((d) => d === env) < 0;

    return (
      <div
        className={cx({
          'c-metadata-form': true,
          '-disabled': disabled,
        })}
      >
        <form
          className="c-form"
          onSubmit={this.onSubmit}
          noValidate
        >
          {loading && (
            <Spinner
              isLoading={loading}
              className="-light"
            />
          )}
          {!loading && (
            <Step1
              onChange={(value) => this.onChange(value)}
              columns={columns}
              type={type}
              form={form}
              loadingColumns={loadingColumns}
            />
          )}

          {!loading && (
            <Navigation
              step={step}
              stepLength={stepLength}
              submitting={submitting}
              onStepChange={this.onStepChange}
            />
          )}
        </form>
      </div>
    );
  }
}

export default DatasetMetadataForm;
