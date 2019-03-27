import React from 'react';
import PropTypes from 'prop-types';

// components
import { Router } from 'routes';

// vizzuality-components
import { Icons } from 'vizzuality-components';

import HeadApp from 'layout/head/app';
import Tooltip from 'components/ui/Tooltip';

class LayoutEmbed extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    className: PropTypes.string,
    toggleTooltip: PropTypes.func,
    updateIsLoading: PropTypes.func
  };

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
    const { title, description, className, thumbnailUrl } = this.props;
    return (
      <div className={`l-page ${className}`}>
        <HeadApp
          title={title}
          description={description}
          thumbnailUrl={thumbnailUrl}
        />

        <Icons />

        {this.props.children}

        <Tooltip />
      </div>
    );
  }
}

export default LayoutEmbed;
