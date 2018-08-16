import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import d3 from 'd3';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed } from 'redactions/common';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Page from 'layout/page';
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Widget editor
import { VegaChart, getVegaTheme } from 'widget-editor';

const defaultTheme = getVegaTheme();

class EmbedWidget extends Page {
  static propTypes = {
    widget: PropTypes.object,
    getWidget: PropTypes.func,
    checkIfFavorited: PropTypes.func,
    setIfFavorited: PropTypes.func,
    bandDescription: PropTypes.string,
    bandStats: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    favourited: PropTypes.bool
  };

  static defaultProps = {
    widget: {}
  };

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
    return !/localhost|(staging\.)?resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: props.isLoading,
      modalOpened: false,
      shareWidget: null
    };
  }

  componentDidMount() {
    const { url } = this.props;
    this.props.getWidget(url.query.id, 'metadata');
    if (this.props.user.id) this.props.checkIfFavorited(url.query.id);
  }

  handleToggleShareModal(widget) {
    this.setState({ shareWidget: widget });
  }

  getModal() {
    const { widget, bandDescription, bandStats } = this.props;
    const widgetAtts = widget.attributes;
    const widgetLinks = (widgetAtts.metadata && widgetAtts.metadata.length > 0 &&
      widgetAtts.metadata[0].attributes.info &&
      widgetAtts.metadata[0].attributes.info.widgetLinks) || [];
    const noAdditionalInfo = !widget.attributes.description && !bandDescription &&
      isEmpty(bandStats) && widgetLinks.length === 0;
    return (
      <div className="widget-modal">
        { noAdditionalInfo &&
          <p>No additional information is available</p>
        }

        { widgetLinks.length > 0 &&
          <div className="widget-links-container">
            <h4>Links</h4>
            <ul>
              { widgetLinks.map(link => (
                <li>
                  <a
                    href={link.link}
                    target="_blank"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }

        { widget.attributes.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.attributes.description}</p>
          </div>
        ) }

        { bandDescription && (
          <div>
            <h4>Band description</h4>
            <p>{bandDescription}</p>
          </div>
        ) }

        { !isEmpty(bandStats) && (
          <div>
            <h4>Statistical information</h4>
            <div className="c-table">
              <table>
                <thead>
                  <tr>
                    { Object.keys(bandStats).map(name => <th key={name}>{name}</th>) }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    { Object.keys(bandStats).map((name) => {
                      const number = d3.format('.4s')(bandStats[name]);
                      return (
                        <td key={name}>{number}</td>
                      );
                    }) }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) }
      </div>
    );
  }

  render() {
    const {
      widget, loading, error, favourited, user
    } = this.props;
    const { isLoading, modalOpened } = this.state;

    const favouriteIcon = favourited ? 'star-full' : 'star-empty';

    const widgetAtts = widget && widget.attributes;
    const widgetLinks = (widgetAtts && widgetAtts.metadata && widgetAtts.metadata.length > 0 &&
      widgetAtts.metadata[0].attributes.info &&
      widgetAtts.metadata[0].attributes.info.widgetLinks) || [];

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
          <Spinner isLoading={isLoading} className="-light" />
          <div className="widget-title">
            {widgetLinks.length === 0 &&
              <a href={`/data/explore/${widget.attributes.dataset}`} target="_blank" rel="noopener noreferrer">
                <h4>{widget.attributes.name}</h4>
              </a>
            }
            {widgetLinks.length > 0 &&
              <h4>{widget.attributes.name}</h4>
            }
            <div className="buttons">
              <ul>
                <li>
                  <button className="c-btn -tertiary -clean" onClick={() => this.handleToggleShareModal(widget)}>
                    <Icon name="icon-share" className="-small" />
                  </button>

                  <Modal
                    isOpen={this.state.shareWidget === widget}
                    className="-medium"
                    onRequestClose={() => this.handleToggleShareModal(null)}
                  >
                    <ShareModal
                      links={{
                        link: typeof window !== 'undefined' && `${window.location.origin}/embed/widget/${widget.id}`,
                        embed: typeof window !== 'undefined' && `${window.location.origin}/embed/widget/${widget.id}`
                      }}
                      analytics={{
                        facebook: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Facebook'),
                        twitter: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Twitter'),
                        copy: type => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`)
                      }}
                    />
                  </Modal>
                </li>
                {
                  user.id && (
                  <li>
                    <button
                      onClick={() => this.props.setIfFavorited(widget.id, !this.props.favourited)}
                    >
                      <Icon name={`icon-${favouriteIcon}`} className="c-icon -small" />
                    </button>
                  </li>
                  )
                }
                <li>
                  <button
                    aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                    onClick={() => this.setState({ modalOpened: !modalOpened })}
                  >
                    <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="widget-content">
            <VegaChart
              data={widget.attributes.widgetConfig}
              theme={defaultTheme}
              toggleLoading={l => this.setState({ isLoading: l })}
              reloadOnResize
            />
            { modalOpened && this.getModal() }
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              Powered by
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

const mapStateToProps = state => ({
  widget: state.widget.data,
  loading: state.widget.loading,
  error: state.widget.error,
  bandDescription: state.widget.bandDescription,
  bandStats: state.widget.bandStats,
  favourited: state.widget.favourite.favourited,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch),
  checkIfFavorited: bindActionCreators(checkIfFavorited, dispatch),
  setIfFavorited: bindActionCreators(setIfFavorited, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedWidget);
