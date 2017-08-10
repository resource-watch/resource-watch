import React from 'react';
import PropTypes from 'prop-types';

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
      console.warn('Oops, unable to copy');
    }
  }

  render() {
    return (
      <div className="c-embed-layer-modal">
        <h1 className="c-text -header-big -thin title">Share into my web</h1>
        <p>You may include this content on your webpage. To do this, copy the following html
        code and insert it into the source code of your page:</p>
        <h5>Code to embed</h5>
        <div className="url-container">
          <input
            ref={(n) => { this.input = n; }}
            value={`<iframe src="https://staging.resourcewatch.org/embed/layers?layers=${encodeURIComponent(JSON.stringify(this.props.layerGroups))}" width="100%" height="474px" frameBorder="0"></iframe>`}
            className="url"
            readOnly
          />
          <button className="c-btn -primary -filled" onClick={() => this.onCopyClick()}>
            Copy
          </button>
        </div>
      </div>
    );
  }
}

EmbedLayerModal.propTypes = {
  layerGroups: PropTypes.array.isRequired
};

export default EmbedLayerModal;
