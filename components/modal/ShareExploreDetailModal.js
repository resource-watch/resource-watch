import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Components
import Icon from 'components/ui/Icon';

class ShareExploreDetailModal extends React.Component {
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
    const { datasetId, showEmbed, url } = this.props;
    const { protocol, hostname, port } = window && window.location ? window.location : {};
    const embedHost = window && window.location ? `${protocol}//${hostname}${port !== '' ? `:${port}` : port}` : '';
    const embedSt = `<iframe src="${embedHost}/embed/dataset/${datasetId}" width="100%" height="474px" frameBorder="0"></iframe>`;

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
                  href={`https://twitter.com/share?url=${url}&text=${document.title}`}
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
              <label htmlFor="share-url">Code to embed</label>
              <div className="url-input-div">
                <input
                  id="share-url"
                  ref={(n) => { this.embedInput = n; }}
                  value={embedSt}
                  className="url"
                  readOnly
                />
                <div className="copy-button">
                  <a className="c-btn" tabIndex={0} role="button" onClick={() => this.onCopyClick('embed')}>
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

ShareExploreDetailModal.propTypes = {
  url: PropTypes.string,
  datasetId: PropTypes.string,
  showEmbed: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
};


export default ShareExploreDetailModal;
