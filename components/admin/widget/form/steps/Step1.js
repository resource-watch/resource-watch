import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

// Components
import Field from 'components/form/Field';
import SelectInput from 'components/form/SelectInput';

// Store
import { FORM_ELEMENTS } from 'components/admin/widget/form/constants';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      message: null,
      datasets: []
    };
  }

  componentDidMount() {
    this.getDatasets();
  }

  getDatasets() {
    const url = [
      process.env.WRI_API_URL,
      '/dataset?application=',
      this.props.application.join(','),
      '&includes=widget,layer,metadata,vocabulary&page[size]=',
      Date.now() / 100000
    ].join('');

    fetch(new Request(url))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const datasets = sortBy(response.data.map(dataset => ({
          label: dataset.attributes.name,
          value: dataset.id
        })), 'label');
        this.setState({ datasets, loading: false });
      })
      .catch(() => {
        this.setState({ message: 'Error loading datasets', loading: false });
      });
  }

  render() {
    return (
      <fieldset className="c-field-container">
        {this.state.loading && 'Loading...'}
        {!this.state.loading && this.state.message}
        {!this.state.loading && !this.state.message && (
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
            onChange={value => this.props.onChange({ dataset: value })}
            validations={['required']}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              required: true
            }}
            options={this.state.datasets}
            defaultValue={this.props.dataset || null}
          >
            {SelectInput}
          </Field>
        )}
      </fieldset>
    );
  }
}

Step1.propTypes = {
  application: PropTypes.arrayOf(PropTypes.string),
  dataset: PropTypes.string,
  onChange: PropTypes.func
};

export default Step1;
