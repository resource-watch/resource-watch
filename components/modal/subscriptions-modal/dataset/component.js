import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// components
import Field from 'components/form/Field';
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import DatasetsManager from '../dataset-manager';
import SubscriptionsPreview from '../subscriptions-preview';

class DatasetSubscriptionsModal extends PureComponent {
  static propTypes = {
    userSelection: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    userAreas: PropTypes.array.isRequired,
    areaFound: PropTypes.bool.isRequired,
    activeArea: PropTypes.object,
    activeDataset: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    setUserSelection: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    resetModal: PropTypes.func.isRequired,
    createSubscriptionToArea: PropTypes.func.isRequired,
    createSubscriptionOnNewArea: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired
  }

  static defaultProps = { activeArea: null }

  state = { showSubscribePreview: false }

  onChangeArea = (area = {}) => {
    const {
      activeDataset,
      onRequestClose,
      setUserSelection
    } = this.props;

    if (area.value === 'upload_area') {
      onRequestClose();

      Router.pushRoute('myrw_detail', {
        tab: 'areas',
        id: 'new',
        subscriptionDataset: activeDataset.id,
        subscriptionType: this.state.selectedType,
        subscriptionThreshold: this.state.selectedThreshold
      });
    } else {
      setUserSelection({ area });
    }
  }

  handleCancel = () => {
    const { resetModal, onRequestClose } = this.props;

    onRequestClose();
    resetModal();
  }

  handleShowSubscribePreview = () => {
    this.setState({ showSubscribePreview: true });
  }

  handleSubscribe = () => {
    const {
      userSelection,
      userAreas,
      areaFound,
      createSubscriptionToArea,
      createSubscriptionOnNewArea,
      updateSubscription
    } = this.props;
    const { showSubscribePreview } = this.state;

    if (userSelection.area) {
      if (userSelection.area.areaID) {
        if (areaFound) {
          // The user selected one of his/her areas - with subscriptions
          toastr.confirm(`There already exists a subscription for the selected area.
            Do you want to update it?`, {
            onOk: () => {
              updateSubscription();
            },
            onCancel: () => { }
          });
        } else {
          // The user selected one of his/her areas - with no subscriptions
          createSubscriptionToArea();
        }
        // ++++++++++ THE USER SELECTED A COUNTRY +++++++++++++++
        // Check if the user already has an area with that country
      } else if (userAreas.map(val => val.geostore).includes(userSelection.area.value)) {
        // The user selected a country for which he/she already has an area
        createSubscriptionToArea();
      } else {
        // The user selected a country he/she has no area for.
        // In this case, we create a new area on the fly
        createSubscriptionOnNewArea()
          .then(() => {
            if (showSubscribePreview) {
              this.setState({ showSubscribePreview: false });
            }
          });
      }
    } else {
      toastr.error('Data missing', 'Please select an area and a subscription type');
    }
  }

  handleGoToMySubscriptions = () => {
    this.props.onRequestClose();

    Router.pushRoute('myrw', { tab: 'areas' });
  }

  handleState = (bool) => { this.setState({ showSubscribePreview: bool }); }

  render() {
    const {
      areas,
      activeArea,
      activeDataset,
      userSelection,
      loading,
      subscription,
      onRequestClose
    } = this.props;

    const { showSubscribePreview } = this.state;

    let headerText = 'Subscription saved!';

    const { success } = subscription;

    const datasetName = activeDataset && activeDataset.metadata && activeDataset.metadata.name;
    if (Object.keys(activeDataset).length) headerText = `Subscribe to ${datasetName}`;
    if (activeArea) headerText = `${activeArea.name} subscriptions`;

    const paragraphText = success ?
      (
        <p>
          Your subscription was successfully created.
          <strong> Please check your email address to confirm it.</strong>
        </p>) : null;

    if (showSubscribePreview) {
      return (
        <SubscriptionsPreview
          handleCancel={this.handleCancel}
          handleSubscribe={this.handleSubscribe}
          onRequestClose={onRequestClose}
          handleState={this.handleState}
        />
      );
    }

    return (
      <div className="c-subscriptions-modal">
        <Spinner
          className="-light"
          isLoading={loading}
        />
        {!success &&
          <Fragment>
            <div className="header-div">
              <h2>{headerText}</h2>
              {paragraphText}
            </div>
            <div className="selectors-container">
              <Field
                properties={{
                  name: 'areas',
                  label: 'Areas'
                }}
              >
                <CustomSelect
                  placeholder="Select area"
                  options={areas}
                  className={classnames({ '-disabled': !!activeArea })}
                  clearable={!activeArea}
                  onValueChange={this.onChangeArea}
                  allowNonLeafSelection={false}
                  value={userSelection.area ? userSelection.area.value : null}
                />
              </Field>
            </div>
            <div className="separator" />
            <DatasetsManager activeArea={activeArea} />
          </Fragment>
        }

        {success &&
          <div className="icon-container">
            <img alt="success" src="/static/images/components/modal/widget-saved.svg" />
          </div>
        }

        {!success &&
          <div className="buttons">
            <button className="c-btn -primary" onClick={this.handleSubscribe}>
              Save
            </button>

            <button
              className={classnames({
                'c-btn': true,
                '-secondary': true,
                '-disabled': !!activeArea
              })}
              onClick={this.handleShowSubscribePreview}
              disabled={userSelection.area === null || (userSelection.datasets).length === 0}
            >
              Preview
            </button>
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Cancel
            </button>
          </div>
        }

        {success &&
          <div className="buttons">
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Ok
            </button>
            <button className="c-btn -primary" onClick={this.handleGoToMySubscriptions}>
              View my subscriptions
            </button>
          </div>
        }
      </div>
    );
  }
}

export default DatasetSubscriptionsModal;
