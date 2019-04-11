import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedEmbed extends PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    favourited: PropTypes.bool.isRequired,
    url: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    referer: PropTypes.string,
    getWidget: PropTypes.func.isRequired,
    hostname: PropTypes.string.isRequired,
    checkIfFavorited: PropTypes.func.isRequired,
    setIfFavorited: PropTypes.func.isRequired
  };

  static defaultProps = {
    referer: '',
    error: null
  }

  state = { modalOpened: false }

  componentWillMount() {
    const {
      url,
      user,
      getWidget,
      checkIfFavorited
    } = this.props;

    getWidget(url.query.id);
    if (user.id) checkIfFavorited(url.query.id);
  }

  getModal() {
    const { widget } = this.props;
    const { description } = widget;

    return (
      <div className="widget-modal">
        {!description &&
          <p>No additional information is available</p>
        }

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
      referer,
      hostname
    } = this.props;
    const { modalOpened } = this.state;
    const favouriteIcon = favourited ? 'star-full' : 'star-empty';
    const isExternal = isLoadedExternally(referer);
    const {
      name,
      description,
      dataset,
      id,
      widgetConfig
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
        hostname={hostname}
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
                    onClick={() => this.props.setIfFavorited(id, !this.props.favourited)}
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
            { !modalOpened &&
              <iframe
                title={name}
                src={widgetConfig.url}
                frameBorder="0"
              />
            }
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

export default LayoutEmbedEmbed;
