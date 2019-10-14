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

class AreaSubscriptionsModal extends PureComponent {
  static propTypes = {
    userSelection: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    activeArea: PropTypes.object,
    subscription: PropTypes.object.isRequired,
    subscriptionCreation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    resetModal: PropTypes.func.isRequired,
    createSubscriptionToArea: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired
  }

  static defaultProps = { activeArea: null }

  state = { showSubscribePreview: false }

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
      subscription,
      activeArea,
      createSubscriptionToArea,
      updateSubscription
    } = this.props;

    if (subscription.datasets.length > 0) {
      if (!activeArea.subscriptions) {
        createSubscriptionToArea();
      } else {
        updateSubscription();
      }
    } else if (activeArea.subscriptions) {
      // Case where an area that had subscriptions associated to it has been 'cleaned' by the user
      // so that it no longers has any subscriptions associated to it
      updateSubscription();
    } else {
      toastr.error('Data missing', 'Please select at least one dataset and a subscription type');
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
      userSelection,
      loading,
      subscriptionCreation,
      onRequestClose
    } = this.props;
    const { showSubscribePreview } = this.state;
    const { success } = subscriptionCreation;
    const paragraphText = success ?
      (
        <p>
            Your subscription was successfully created.
          <strong> Please check your email address to confirm it.</strong>
        </p>) : null;
    let headerText = `${activeArea.name} subscriptions`;
    if (success) headerText = 'Subscription saved!';

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
                  className="-disabled"
                  allowNonLeafSelection={false}
                  value={(activeArea || {}).id}
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
                '-disabled': !userSelection.datasets.length
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

export default AreaSubscriptionsModal;
