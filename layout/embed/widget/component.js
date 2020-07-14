import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import d3 from 'd3';
import Renderer from '@widget-editor/renderer';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Icon from 'components/ui/icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedWidget extends PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    bandDescription: PropTypes.string,
    bandStats: PropTypes.object.isRequired,
    error: PropTypes.string,
    favourited: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    webshot: PropTypes.bool.isRequired,
    referer: PropTypes.string,
    setIfFavorited: PropTypes.func.isRequired
  };

  static defaultProps = {
    bandDescription: null,
    error: null,
    referer: ''
  }

  state = {
    modalOpened: false,
    shareWidget: null
  }

  getModal() {
    const { widget, bandDescription, bandStats } = this.props;
    const widgetAtts = widget;
    const widgetLinks = (widgetAtts.metadata && widgetAtts.metadata.length > 0 &&
      widgetAtts.metadata[0].info &&
      widgetAtts.metadata[0].info.widgetLinks) || [];
    const noAdditionalInfo = !widget.description && !bandDescription &&
      isEmpty(bandStats) && widgetLinks.length === 0;
    return (
      <div className="widget-modal">
        {noAdditionalInfo &&
          <p>No additional information is available</p>}
        {widgetLinks.length > 0 &&
          <div className="widget-links-container">
            <h4>Links</h4>
            <ul>
              {widgetLinks.map(link => (
                <li>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
        {widget.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.description}</p>
          </div>
        )}

        {bandDescription && (
          <div>
            <h4>Band description</h4>
            <p>{bandDescription}</p>
          </div>
        )}

        {!isEmpty(bandStats) && (
          <div>
            <h4>Statistical information</h4>
            <div className="c-table">
              <table>
                <thead>
                  <tr>
                    {Object.keys(bandStats).map(name => <th key={name}>{name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.keys(bandStats).map((name) => {
                      const number = d3.format('.4s')(bandStats[name]);
                      return (<td key={name}>{number}</td>);
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  handleToggleLoading = (isLoading) => {
    if (!isLoading) window.WEBSHOT_READY = true;
  }

  handleToggleShareModal = (shareWidget) => { this.setState({ shareWidget }); }

  render() {
    const {
      widget,
      error,
      favourited,
      user,
      webshot,
      referer
    } = this.props;
    const { modalOpened } = this.state;
    const favouriteIcon = favourited ? 'star-full' : 'star-empty';
    const widgetAtts = widget && widget;
    const widgetLinks = (widgetAtts && widgetAtts.metadata && widgetAtts.metadata.length > 0 &&
      widgetAtts.metadata[0].info &&
      widgetAtts.metadata[0].info.widgetLinks) || [];
    const isExternal = isLoadedExternally(referer);

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

    return (
      <LayoutEmbed
        title={widget.name}
        description={`${widget.description || ''}`}
        {...widget.thumbnailUrl && { thumbnailUrl: widget.thumbnailUrl }}
      >
        <div className="c-embed-widget">
          {!webshot && (
          <div className="widget-title">
            {widgetLinks.length === 0 &&
              <a
                href={`/data/explore/${widget.dataset}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>{widget.name}</h4>
              </a>}
            {widgetLinks.length > 0 &&
              <h4>{widget.name}</h4>}
            <div className="buttons">
              <ul>
                <li>
                  <button
                    className="c-btn -tertiary -clean"
                    onClick={() => this.handleToggleShareModal(widget)}
                  >
                    <Icon
                      name="icon-share"
                      className="-small"
                    />
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
                        email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                        copy: type => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`)
                      }}
                    />
                  </Modal>
                </li>
                {user.id && (
                  <li>
                    <button
                      onClick={() => this.props.setIfFavorited(widget.id, !this.props.favourited)}
                    >
                      <Icon name={`icon-${favouriteIcon}`} className="c-icon -small" />
                    </button>
                  </li>
                  )}
                <li>
                  <button
                    aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                    onClick={() => this.setState({ modalOpened: !modalOpened })}
                  >
                    <Icon
                      name={`icon-${modalOpened ? 'cross' : 'info'}`}
                      className="c-icon -small"
                    />
                  </button>
                </li>
              </ul>
            </div>
          </div>)}
          <div className="widget-content">
            {typeof window !== 'undefined' && 
            
              <Renderer widgetConfig={widget.widgetConfig} />
            }
            {modalOpened && this.getModal()}
          </div>
          {(isExternal && !webshot) && (
            <div className="widget-footer">
              Powered by
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

export default LayoutEmbedWidget;
