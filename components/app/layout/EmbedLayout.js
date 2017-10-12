import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateIsLoading } from 'redactions/page';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import { Router } from 'routes';
import Icons from 'components/app/layout/icons';
import Tooltip from 'components/ui/Tooltip';
import Head from 'components/app/layout/head';

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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  // Store
  toggleTooltip: PropTypes.func,
  updateIsLoading: PropTypes.func
};

const mapStateToProps = state => ({
  modal: state.modal,
  isLoading: state.page.isLoading
});

const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  updateIsLoading: bindActionCreators(isLoading => updateIsLoading(isLoading), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
