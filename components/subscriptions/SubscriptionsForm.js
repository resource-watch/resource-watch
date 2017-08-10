import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';

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
        <div>
          <div className="name-container">
            <h5>Name</h5>
            <input value={name} onChange={this.handleNameChange} />
          </div>
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
        </div>
        <div className="buttons-div">
          <button className="c-btn -primary" onClick={this.handleSubscribe}>
            Subscribe
          </button>
        </div>
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
