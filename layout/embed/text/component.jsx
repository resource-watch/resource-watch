import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import TextChart from 'components/widgets/charts/TextChart';
import Spinner from 'components/ui/Spinner';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedText extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isLoading: props.loading };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const {
      getWidget,
      routes: { query: { id } },
    } = this.props;

    getWidget(id);
  }

  handleToggleLoading = (isLoading) => {
    this.setState({ isLoading }, () => { window.WEBSHOT_READY = true; });
  }

  render() {
    const { widget, loading } = this.props;
    const { isLoading } = this.state;
    const isExternal = isLoadedExternally();
    const {
      name,
      description,
      widgetConfig,
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
        title={name}
        description={description || ''}
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
          {isExternal
            && (
            <img
              className="embed-logo"
              height={21}
              width={129}
              src="/static/images/logo-embed.png"
              alt="Resource Watch"
            />
            ) }
        </div>
      </LayoutEmbed>
    );
  }
}

LayoutEmbedText.propTypes = {
  widget: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    widgetConfig: PropTypes.shape({}),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  routes: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  getWidget: PropTypes.func.isRequired,
};

export default LayoutEmbedText;
