import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';
import AlertsTable from './table';

class SubscriptionsPreview extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    activeDataset: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    getUserSubscriptionsPreview: PropTypes.func.isRequired,
    handleState: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubscribe: PropTypes.func.isRequired
  }

  static defaultProps = { data: [] }

  componentWillMount() {
    const { getUserSubscriptionsPreview } = this.props;

    getUserSubscriptionsPreview();
  }

  handleEdit = () => {
    const { handleState } = this.props;
    handleState(false);
  }

  render() {
    const {
      loading,
      data,
      handleCancel,
      handleSubscribe,
      activeDataset
    } = this.props;

    if (loading) {
      return (
        <Spinner
          className="-light"
          isLoading
        />);
    }

    return (
      <div className="c-subscriptions-preview">
        <div className="header">
          <h2>{activeDataset.name}</h2>
        </div>
        {data.map(_d => (<AlertsTable alerts={_d} />))}
        <div className="buttons">
          <button
            className="c-btn -primary"
            onClick={handleSubscribe}
          >
            Done
          </button>
          <button
            className="c-btn -secondary"
            onClick={this.handleEdit}
          >
            Edit
          </button>
          <button
            className="c-btn -secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

export default SubscriptionsPreview;
