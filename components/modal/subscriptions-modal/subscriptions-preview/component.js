import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';


import SubscriptionsModal from '../../subscriptions-modal';

//Components
import Spinner from 'components/ui/Spinner';

class SubscriptionsPreview extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    getUserSubscriptionsPreview: PropTypes.func.isRequired,
    handleState: PropTypes.func.isRequired
  }

  static defaultProps = { activeArea: null }

  componentWillMount() {
    const {
      getUserSubscriptionsPreview,
    } = this.props;

    getUserSubscriptionsPreview();
  }

  handleEdit = () => {
    const { handleState } = this.props;
    handleState(false);
  }

  render() {
    const {
      loading,
      preview,
      datasetTitle,
      activeDataset,
      handleCancel,
      handleSubscribe
    } = this.props;

    if (loading) {
      return <Spinner
        className="-light"
        isLoading={loading}
      />
    }
    const previewDetails = preview.list
      .map(row => ({ ...row, ...JSON.parse(row.geom) }))
      .map(({ geom, type, coordinates, ...rest }) => ({
        ...rest,
        latitude: coordinates[0],
        longitude: coordinates[1],
      }))

    const tableTitle = datasetTitle[0].label
    const tableHeaders = Object.keys(previewDetails[0] || []);
    const tableData = previewDetails

    return (
      <div className="c-subscriptions-preview c-subscriptions-modal">
        <Fragment>
          <div className="header-div">
            <h2>{tableTitle}</h2>
            <h3>Subtítulo</h3>
          </div>
          {/* <div className="subscriptions-preview"> */}
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
          {/* </div> */}
          <div className="buttons">
            <button className="c-btn -primary" onClick={handleSubscribe}>
              Done
          </button>
            <button className="c-btn -secondary" onClick={this.handleEdit}>
              Edit
          </button>
            <button className="c-btn -secondary" onClick={handleCancel}>
              Cancel
          </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export default SubscriptionsPreview;
