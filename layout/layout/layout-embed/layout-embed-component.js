import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Router } from 'routes';

// Wri-api-components
import { Icons } from 'wri-api-components';

import Head from 'layout/head/app';
import Tooltip from 'components/ui/Tooltip';

class LayoutEmbed extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    className: PropTypes.string,
    // Store
    toggleTooltip: PropTypes.func,
    updateIsLoading: PropTypes.func
  };

  componentWillMount() {
    // When a tooltip is shown and the router navigates to a
    // another page, the tooltip stays in place because it is
    // managed in Redux
    // The way we prevent this is by listening to the router
    // and whenever we navigate, we hide the tooltip
    // NOTE: we can't just call this.props.toggleTooltip here
    // because for some pages, we don't re-mount the LayoutEmbed
    // component. If we listen for events from the router,
    // we're sure to not miss any page.
    this.props.toggleTooltip(false);
  }

  componentDidMount() {
    Router.onRouteChangeStart = () => {
      this.props.toggleTooltip(false);
      this.props.updateIsLoading(true);
    };
    Router.onRouteChangeComplete = () => {
      this.props.updateIsLoading(false);
    };
  }

  render() {
    const { title, description, className } = this.props;

    return (
      <div className={`l-page ${className}`}>
        <Head
          title={title}
          description={description}
        />

        <Icons />

        {this.props.children}

        <Tooltip />
      </div>
    );
  }
}

export default LayoutEmbed;
