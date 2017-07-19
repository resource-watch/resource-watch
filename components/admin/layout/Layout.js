import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { setUser } from 'redactions/user';

// Components
import Header from 'components/admin/layout/Header';
import Head from 'components/admin/layout/head';
import Icons from 'components/admin/layout/icons';
import Tooltip from 'components/ui/Tooltip';

class Layout extends React.Component {

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

  render() {
    const { title, description, url, user } = this.props;
    return (
      <div className="c-page">
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
  toggleTooltip: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  toggleModal: () => {
    dispatch(toggleModal());
  },
  setModalOptions: () => {
    dispatch(setModalOptions());
  },
  setUser: (user) => {
    dispatch(setUser(user));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(Layout);
