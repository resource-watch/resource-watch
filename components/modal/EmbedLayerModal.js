import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

class EmbedLayerModal extends React.Component {
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
    const { protocol, hostname, port } = window && window.location ? window.location : {};
    const embedHost = window && window.location ? `${protocol}//${hostname}${port !== '' ? `:${port}` : port}` : '';
    return (
      <div className="c-embed-layer-modal">
        <h2>Share into my web</h2>
        <p>You may include this content on your webpage. To do this, copy the following html
        code and insert it into the source code of your page:</p>
        <div className="url-container">
          <div className="c-field">
            <label htmlFor="embed-url">Code to embed</label>
            <input
              id="embed-url"
              ref={(n) => { this.input = n; }}
              value={`<iframe src="${embedHost}/embed/layers?layers=${encodeURIComponent(JSON.stringify(this.props.layerGroups))}" width="100%" height="474px" frameBorder="0"></iframe>`}
              className="url"
              readOnly
            />
            <button className="c-btn -primary" onClick={() => this.onCopyClick()}>
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  }
}

EmbedLayerModal.propTypes = {
  layerGroups: PropTypes.array.isRequired
};

export default EmbedLayerModal;
