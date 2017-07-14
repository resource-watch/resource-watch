import React from 'react';


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
      console.warn('Oops, unable to copy');
    }
  }

  render() {
    const { widgetId } = this.props;
    const url = `http://staging.resourcewatch.org/embed/widget/${widgetId}`;
    const iframeText = `<iframe srce="${url}"</iframe>`;
    return (
      <div className="c-embed-my-widget-modal">
        <h1 className="c-text -header-big -thin">Share into my web</h1>
        <p>You may include this content on your webpage. To do this, copy the following html
        code and insert it into the source code of your page:</p>
        <div className="url-container">
          <input ref={(n) => { this.input = n; }} value={iframeText} className="url" readOnly />
          <button className="c-btn -primary -filled" onClick={() => this.onCopyClick()}>
            Copy
          </button>
        </div>
      </div>
    );
  }
}

EmbedMyWidgetModal.propTypes = {
  widgetId: React.PropTypes.string.isRequired
};

export default EmbedMyWidgetModal;
