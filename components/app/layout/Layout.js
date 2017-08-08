import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { setUser } from 'redactions/user';

// Components
import Icons from 'components/app/layout/icons';
import Header from 'components/app/layout/Header';
import Footer from 'components/app/layout/Footer';
import Tooltip from 'components/ui/Tooltip';
import Head from 'components/app/layout/head';
import Modal from 'components/ui/Modal';

const fullScreenPages = [
  '/app/Explore',
  '/app/Pulse'
];


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
    const { title, description, url, user, pageHeader, modal, className } = this.props;
    const fullScreen = url.pathname && fullScreenPages.indexOf(url.pathname) !== -1;

    return (
      <div className={`l-page ${className}`}>
        <Head
          title={title}
          description={description}
        />

        <Icons />

        <Header
          user={user}
          pageHeader={pageHeader}
        />

        {this.props.children}

        {!fullScreen && <Footer />}

        <Tooltip />

        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

      </div>
    );
  }

}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  user: PropTypes.object,
  url: PropTypes.object,
  pageHeader: PropTypes.bool,
  // Store
  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  toggleTooltip: PropTypes.func,
  setModalOptions: PropTypes.func,
  setUser: PropTypes.func.isRequired
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
