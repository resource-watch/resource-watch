import { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/icon';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedEmbed extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { modalOpened: false };
  }

  getModal() {
    const { widget } = this.props;
    const { description } = widget;

    return (
      <div className="widget-modal">
        {!description
          && <p>No additional information is available</p>}

        {description && (
          <div>
            <h4>Description</h4>
            <p>{description}</p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      widget,
      loading,
      error,
      favourited,
      user,
      setIfFavorited,
    } = this.props;
    const { modalOpened } = this.state;
    const favouriteIcon = favourited ? 'star-full' : 'star-empty';
    const isExternal = isLoadedExternally();
    const {
      name,
      description,
      dataset,
      id,
      widgetConfig,
    } = widget;

    if (loading) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <div className="c-embed-widget">
            <Spinner isLoading className="-light" />
          </div>
        </LayoutEmbed>
      );
    }

    if (error) {
      return (
        <LayoutEmbed
          title="Resource Watch"
          description=""
        >
          <div className="c-embed-widget">
            <div className="widget-title">
              <h4>–</h4>
            </div>

            <div className="widget-content">
              <p>{'Sorry, the widget couldn\'t be loaded'}</p>
            </div>

            {isExternal && (
              <div className="widget-footer">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src="/static/images/logo-embed.png"
                    alt="Resource Watch"
                  />
                </a>
              </div>
            )}
          </div>
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed
        title={`${name}`}
        description={`${description || ''}`}
      >
        <div className="c-embed-widget">
          <div className="widget-title">
            <a
              href={`/data/explore/${dataset}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4>{name}</h4>
            </a>
            <div className="buttons">
              {
                user.id && (
                  <button
                    onClick={() => { setIfFavorited(id, !favourited); }}
                  >
                    <Icon
                      name={`icon-${favouriteIcon}`}
                      className="c-icon -small"
                    />
                  </button>
                )
              }
              <button
                aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                onClick={() => this.setState({ modalOpened: !modalOpened })}
              >
                <Icon
                  name={`icon-${modalOpened ? 'cross' : 'info'}`}
                  className="c-icon -small"
                />
              </button>
            </div>
          </div>
          <div className="widget-content">
            { !modalOpened
              && (
              <iframe
                title={name}
                src={widgetConfig.url}
                frameBorder="0"
              />
              )}
            {modalOpened && this.getModal()}
          </div>
          {isExternal && (
            <div className="widget-footer">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          )}
        </div>
      </LayoutEmbed>
    );
  }
}

LayoutEmbedEmbed.defaultProps = {
  error: null,
};

LayoutEmbedEmbed.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    dataset: PropTypes.string,
    widgetConfig: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  favourited: PropTypes.bool.isRequired,
  url: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  setIfFavorited: PropTypes.func.isRequired,
};

export default LayoutEmbedEmbed;
