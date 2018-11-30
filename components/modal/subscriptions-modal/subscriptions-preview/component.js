import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';


import SubscriptionsModal from '../../subscriptions-modal';

//Components
import Spinner from 'components/ui/Spinner';

class SubscriptionsPreview extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    getUserSubscriptionsPreview: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    resetModal: PropTypes.func.isRequired,
  }

  static defaultProps = { activeArea: null }

  state = {
    showSubscribeModal: false
  }

  componentWillMount() {
    const {
      getUserSubscriptionsPreview,
    } = this.props;

    getUserSubscriptionsPreview();
    const {
      data,
    } = this.state
  }
  
  handleEdit = () => {
    this.setState({ showSubscribeModal: true });

    console.log(showSubscribeModal, 'showSubscribePreview')
  }

  handleCancel = () => {
    const { resetModal, onRequestClose } = this.props;
    onRequestClose();
    resetModal();
  }

  handleSubscribe = () => {
    const {
      userSelection,
      subscriptions,
      userAreas,
      activeArea,
      areaFound,
      createSubscriptionToArea,
      createSubscriptionOnNewArea,
      updateSubscription
    } = this.props;

    if (userSelection.area) {
      if (userSelection.area.areaID) {
        // user selects an area previously created
        if (areaFound) {
          toastr.confirm(`There already exist a subscription for the selected area.
            Do you want to update it?`, {
              onOk: () => {
                if (!activeArea) {
                  const subscriptionToUpdate = subscriptions.find(_subscription =>
                    _subscription.attributes.params.area === userSelection.area.areaID);
                  updateSubscription(subscriptionToUpdate);
                } else {
                  const { subscription } = activeArea;
                  updateSubscription(subscription);
                }
              },
              onCancel: () => { }
            });
        } else {
          createSubscriptionToArea();
        }
        // ++++++++++ THE USER SELECTED A COUNTRY +++++++++++++++
        // Check if the user already has an area with that country
      } else if (userAreas.map(val => val.value).includes(userSelection.area.value)) {
        createSubscriptionToArea();
      } else {
        // In the case there's no user area for the selected country we create one on the fly
        createSubscriptionOnNewArea();
      }
    } else {
      toastr.error('Data missing', 'Please select an area and a subscription type');
    }
  }

  toggleSubscribeModalPreview = (bool) => {
    this.setState({ showSubscribeModalPreview: bool });
  }

  checkKey = (key, data) => {
    if (key === 'geom') {
      const geom = data.map((element) => JSON.parse(element.geom))
      const coordinates = geom.map(c => c.coordinates)
      console.log(coordinates, 'coordenadas')
      return coordinates; //**revisar */
    }
    console.log('nada')
  }

  render() {
    const {
      loading,
      preview,
      datasetTitle,
    } = this.props;

    const { showSubscribeModal } = this.state;
    console.log(loading, 'loading')
    if (loading) {
      return <Spinner
        className="-light"
        isLoading={loading}
      />
    }
    const previewDetails = preview.list
      .map(row => ({ ...row, ...JSON.parse(row.geom) }))
      .map(({ geom, type, acq_date, coordinates, ...rest }) => ({
        ...rest,
        latitude: coordinates[0],
        longitude: coordinates[1],
        date: acq_date
      }))

    const tableTitle = datasetTitle[0].label
    const tableHeaders = Object.keys(previewDetails[0] || []);
    const tableData = previewDetails

    console.log(preview)


    return (
      <div className="c-subscriptions-preview">
        {!showSubscribeModal &&
          <Fragment>
            <div className="header-div">
              <h2>{tableTitle}</h2>
              <h3>Subtítulo</h3>
            </div>
            <div className="subscriptions-preview">
              <table className="subscriptions-preview">
                <thead>
                  <tr className="preview-data-row">
                    {tableHeaders.map(title => <th className="preview-data-title">{title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(row =>
                    <tr className="preview-data-row">
                      {tableHeaders.map(k => <td className="preview-data-element">{row[k]}</td>)}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>



            <div className="buttons">
              <button className="c-btn -primary" onClick={this.handleSubscribe}>
                Done
          </button>
              <button className="c-btn -secondary" onClick={this.handleEdit}>
                Edit
          </button>
              <button className="c-btn -secondary" onClick={this.handleCancel}>
                Cancel
          </button>
            </div>
          </Fragment>
        }
        {showSubscribeModal &&
          <SubscriptionsModal />
        }
      </div>
    );
  }
}

export default SubscriptionsPreview;
