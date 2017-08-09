import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

const AREAS = [
  {
    label: 'Custom area',
    value: 'custom',
    items: [
      {
        label: 'Upload new area',
        value: 'upload',
        as: 'Custom area'
      }
    ]
  }
];

class NewSubscription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      subscriptions: []
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  render() {
    const { loading } = this.state;
    const { user } = this.props;

    return (
      <div className="c-page-section c-myrw-subscriptions">
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />

        </div>
      </div>
    );
  }
}

NewSubscription.propTypes = {
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSubscription);
