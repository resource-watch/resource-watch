import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

class EmbedMyWidgetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  onCopyClick() {
    const copyTextarea = this.input;
    copyTextarea.select();

    try {
      document.execCommand('copy');
      this.setState({ copied: true });
    } catch (err) {
      toastr.warning('Oops, unable to copy');
    }
  }

  render() {
    const { widgetId, visualizationType } = this.props;
    const { protocol, hostname, port } = window && window.location ? window.location : {};
    const embedHost = window && window.location ? `${protocol}//${hostname}${port !== '' ? `:${port}` : port}` : '';

    let embedType;
    switch (visualizationType) {
      case 'map':
        embedType = 'map';
        break;

      case 'embed':
        embedType = 'embed';
        break;

      // Case for the "chart" and "raster_chart"
      default:
        embedType = 'widget';
        break;
    }

    const url = `${embedHost}/embed/${embedType}/${widgetId}`;
    const iframeText = `<iframe src="${url}" width="100%" height="474" frameBorder="0"></iframe>`;
    return (
      <div className="c-embed-my-widget-modal">
        <h2>Share into my web</h2>
        <p>You may include this content on your webpage. To do this, copy the following html
        code and insert it into the source code of your page:</p>
        <div className="url-container">
          <div className="c-field">
            <label htmlFor="share-url">Code to embed</label>
            <div className="url-input-div">
              <input
                id="share-url"
                ref={(n) => { this.input = n; }}
                value={iframeText}
                className="url"
                readOnly
              />
              <div className="copy-button">
                <a
                  className="c-btn"
                  tabIndex={0}
                  role="button"
                  onClick={() => this.onCopyClick()}
                >
                  Copy code
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button className="c-button -primary" onClick={() => this.props.toggleModal()}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

EmbedMyWidgetModal.propTypes = {
  widgetId: PropTypes.string.isRequired,
  visualizationType: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default EmbedMyWidgetModal;
