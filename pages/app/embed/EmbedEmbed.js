import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed } from 'redactions/common';

// Components
import Page from 'layout/page';
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';

class EmbedEmbed extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req } = context;

    store.dispatch(setEmbed(true));

    return {
      ...props,
      referer: isServer ? req.headers.referer : window.location.href
    };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false
    };
  }

  componentDidMount() {
    const { url } = this.props;
    this.props.getWidget(url.query.id);
    if (this.props.user.id) this.props.checkIfFavorited(url.query.id);
  }

  getModal() {
    const { widget } = this.props;
    return (
      <div className="widget-modal">
        { !widget.attributes.description &&
          <p>No additional information is available</p>
        }

        { widget.attributes.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.attributes.description}</p>
          </div>
        ) }
      </div>
    );
  }

  render() {
    const {
      widget, loading, error, favourited, user
    } = this.props;

    const { modalOpened } = this.state;

    const favouriteIcon = favourited ? 'star-full' : 'star-empty';

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

            { this.isLoadedExternally() && (
              <div className="widget-footer">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src="/static/images/logo-embed.png"
                    alt="Resource Watch"
                  />
                </a>
              </div>
            ) }
          </div>
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed
        title={`${widget.attributes.name}`}
        description={`${widget.attributes.description || ''}`}
      >
        <div className="c-embed-widget">
          <div className="widget-title">
            <a href={`/data/explore/${widget.attributes.dataset}`} target="_blank" rel="noopener noreferrer">
              <h4>{widget.attributes.name}</h4>
            </a>
            <div className="buttons">
              {
                user.id && (
                  <button
                    onClick={() => this.props.setIfFavorited(widget.id, !this.props.favourited)}
                  >
                    <Icon name={`icon-${favouriteIcon}`} className="c-icon -small" />
                  </button>
                )
              }
              <button
                aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                onClick={() => this.setState({ modalOpened: !modalOpened })}
              >
                <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
              </button>
            </div>
          </div>
          <div className="widget-content">
            { !modalOpened &&
              <iframe
                title={widget.attributes.name}
                src={widget.attributes.widgetConfig.url}
                frameBorder="0"
              />
            }
            { modalOpened && this.getModal() }
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          ) }
        </div>
      </LayoutEmbed>
    );
  }
}

EmbedEmbed.propTypes = {
  widget: PropTypes.object,
  getWidget: PropTypes.func,
  checkIfFavorited: PropTypes.func,
  setIfFavorited: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  favourited: PropTypes.bool
};

EmbedEmbed.defaultProps = {
  widget: {}
};

const mapStateToProps = state => ({
  widget: state.widget.data,
  loading: state.widget.loading,
  error: state.widget.error,
  favourited: state.widget.favourite.favourited,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch),
  checkIfFavorited: bindActionCreators(checkIfFavorited, dispatch),
  setIfFavorited: bindActionCreators(setIfFavorited, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedEmbed);
