import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';

import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { setUser } from 'redactions/user';

// Components
import Header from 'components/admin/layout/Header';
import Head from 'components/admin/layout/head';
import Icons from 'components/admin/layout/icons';
import Modal from 'components/ui/Modal';
import Tooltip from 'components/ui/Tooltip';
import Toastr from 'react-redux-toastr';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  componentWillMount() {
    // When a tooltip is shown and the router navigates to a
    // another page, the tooltip stays in place because it is
    // managed in Redux
    // The way we prevent this is by listening to the router
    // and whenever we navigate, we hide the tooltip
    // NOTE: we can't just call this.props.toggleTooltip here
    // because for some pages, we don't re-mount the Layout
    // component. If we listen for events from the router,
    // we're sure to not miss any page.
    if (!Router.onRouteChangeStart) {
      Router.onRouteChangeStart = () => {
        this.props.toggleTooltip(false);
      };
    }
  }

  componentDidMount() {
    this.props.setUser(this.props.user);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const { title, description, url, user, modal } = this.props;
    return (
      <div className="l-page">
        <Head
          title={title}
          description={description}
        />

        <Icons />

        <Header url={url} user={user} />

        <div className="container">
          { this.props.children }
        </div>

        <Tooltip />

        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Toastr
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />
      </div>
    );
  }

}

Layout.propTypes = {
  user: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  // Store
  setUser: PropTypes.func.isRequired,

  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  setModalOptions: PropTypes.func,
  toggleTooltip: PropTypes.func
};

const mapStateToProps = state => ({
  modal: state.modal
});


const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  toggleModal: open => dispatch(toggleModal(open, {}, true)),
  setModalOptions: options => dispatch(setModalOptions(options)),
  setUser: (user) => {
    dispatch(setUser(user));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
