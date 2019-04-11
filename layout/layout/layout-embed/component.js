import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import { Router } from 'routes';

// vizzuality-components
import { Icons } from 'vizzuality-components';

import HeadApp from 'layout/head/app';
import Tooltip from 'components/ui/Tooltip';

class LayoutEmbed extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    className: PropTypes.string,
    toggleTooltip: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired,
    hostname: PropTypes.string.isRequired
  };

  static defaultProps = {
    thumbnailUrl: null,
    className: null
  }

  componentWillMount() {
    // When a tooltip is shown and the router navigates to
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
    const { title, description, className, thumbnailUrl, hostname } = this.props;
    return (
      <div className={`l-page ${className}`}>
        <HeadApp
          title={title}
          description={description}
          thumbnailUrl={thumbnailUrl}
          hostname={hostname}
        />

        <Icons />

        {this.props.children}

        <Tooltip />
      </div>
    );
  }
}

export default LayoutEmbed;
