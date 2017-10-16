import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Components
import Icon from 'components/widgets/editor/ui/Icon';

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  onCopyClick(input) {
    const copyTextarea = (input === 'embed') ? this.embedInput : this.input;
    copyTextarea.select();

    try {
      document.execCommand('copy');
      this.setState({ copied: true });
    } catch (err) {
      toastr.warning('Oops, unable to copy');
    }
  }

  render() {
    const { url, layerGroups, zoom, latLng } = this.props;
    const showEmbed = layerGroups && layerGroups.length > 0;
    const { protocol, hostname, port } = window && window.location ? window.location : {};
    const embedHost = window && window.location ? `${protocol}//${hostname}${port !== '' ? `:${port}` : port}` : '';

    const embedParams = {
      layers: JSON.stringify(layerGroups),
      zoom,
      latLng: JSON.stringify(latLng)
    };

    const embedSerializedParams = Object.keys(embedParams)
      .map(k => `${k}=${encodeURIComponent(embedParams[k])}`)
      .join('&');

    return (
      <div className="c-share-modal-explore">
        <h2>Share</h2>
        <div className="url-container">
          <div className="c-field">
            <label htmlFor="share-url">Public url to share</label>
            <div className="url-input-div">
              <input id="share-url" ref={(n) => { this.input = n; }} value={url} className="url" readOnly />
              <div className="media">
                <a
                  href={`http://www.facebook.com/sharer/sharer.php?u=${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="icon-facebook" className="-medium" />
                </a>
                <a
                  href={`https://twitter.com/share?url=${url}&text=Resource watch, explore datasets`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="icon-twitter" className="-medium" />
                </a>
              </div>
              <div className="copy-button">
                <a className="c-btn" tabIndex={0} role="button" onClick={() => this.onCopyClick('url')}>
                  Copy link
                </a>
              </div>
            </div>
          </div>
        </div>
        {showEmbed &&
          <div className="url-container">
            <div className="c-field">
              <label htmlFor="embed-url">Code to embed</label>
              <div className="url-input-div">
                <input
                  id="embed-url"
                  ref={(n) => { this.embedInput = n; }}
                  value={`<iframe src="${embedHost}/embed/layers/?${embedSerializedParams}" width="100%" height="474px" frameBorder="0"></iframe>`}
                  className="url"
                  readOnly
                />
                <div className="copy-button">
                  <a tabIndex={0} role="button" onClick={() => this.onCopyClick('embed')}>
                    Copy code
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
        <div className="buttons">
          <button className="c-button -primary" onClick={() => this.props.toggleModal()}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

ShareModal.propTypes = {
  url: PropTypes.string.isRequired,
  layerGroups: PropTypes.array,
  zoom: PropTypes.number,
  latLng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  toggleModal: PropTypes.func.isRequired
};


export default ShareModal;
