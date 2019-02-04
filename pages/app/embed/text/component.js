import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import TextChart from 'components/widgets/charts/TextChart';
import Spinner from 'components/ui/Spinner';

// utils
import { isLoadedExternally } from 'utils/embed';

class EmbedTextPage extends PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    url: PropTypes.object.isRequired,
    referer: PropTypes.string,
    getWidget: PropTypes.func.isRequired
  };

  static defaultProps = { referer: '' }

  state = { isLoading: this.props.loading };

  componentWillMount() {
    const { getWidget, url } = this.props;

    getWidget(url.query.id);
  }

  handleToggleLoading = (isLoading) => {
    this.setState({ isLoading }, () => { window.WEBSHOT_READY = true; });
  }

  render() {
    const { widget, referer, loading } = this.props;
    const { isLoading } = this.state;
    const isExternal = isLoadedExternally(referer);
    const {
      name,
      description,
      widgetConfig
    } = widget;

    if (loading) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <Spinner isLoading className="-light" />
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed
        title={`${name}`}
        description={`${description || ''}`}
      >
        <div className="c-embed-widget">
          <div className="visualization">
            <Spinner isLoading={isLoading} className="-light" />
            <div className="widget-title">
              <h4>{name}</h4>
            </div>
            <div className="widget-content">
              <TextChart
                widgetConfig={widgetConfig}
                toggleLoading={this.handleToggleLoading}
              />
            </div>
            <p className="widget-description">
              {description}
            </p>
          </div>
          {isExternal &&
            <img
              className="embed-logo"
              height={21}
              width={129}
              src="/static/images/logo-embed.png"
              alt="Resource Watch"
            /> }
        </div>
      </LayoutEmbed>
    );
  }
}

export default EmbedTextPage;
