import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

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

class SubscriptionsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      areaOptions: [],
      loadingAreaOptions: false,
      loadingDatasets: false,
      selectedArea: null,
      loading: false,
      name: ''
    };
  }

  @Autobind
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('onSubmit!');
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      selectedArea,
      loading,
      name,
      datasets,
      loadingDatasets,
      selectedDataset
    } = this.state;
    return (
      <div className="c-subscriptions-form">
        <form className="c-form" onSubmit={this.onSubmit} noValidate>
          <fieldset className="c-field-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
              onChange={this.handleNameChange}
              properties={{
                name: 'name',
                label: 'Name',
                type: 'text',
                value: name
              }}
            >
              {Input}
            </Field>
          </fieldset>
          <div className="selectors-container">
            <Spinner isLoading={loadingAreaOptions || loadingDatasets || loading} className="-light -small" />
            <CustomSelect
              placeholder="Select area"
              options={areaOptions}
              onValueChange={this.onChangeSelectedArea}
              allowNonLeafSelection={false}
              value={selectedArea && selectedArea.value}
              waitForChangeConfirmation
            />
            <CustomSelect
              placeholder="Select a dataset"
              options={datasets}
              onValueChange={this.onChangeSelectedDataset}
              allowNonLeafSelection={false}
              value={selectedDataset && selectedDataset.value}
            />
          </div>
          <div className="buttons-div">
            <button type="submit" className="c-btn -primary">
            Subscribe
          </button>
          </div>
        </form>
      </div>
    );
  }
}

SubscriptionsForm.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(SubscriptionsForm);
