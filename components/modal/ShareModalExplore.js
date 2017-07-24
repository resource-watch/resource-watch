import React from 'react';
import Icon from 'components/ui/Icon';

class ShareModal extends React.Component {
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
    const { url } = this.props;
    return (
      <div className="c-share-modal-explore">
        <h1 className="c-text -header-normal -thin title">Share this page</h1>
        <div className="url-container">
          <input ref={(n) => { this.input = n; }} value={url} className="url" readOnly />
          <button className="c-btn -primary -filled" onClick={() => this.onCopyClick()}>
          Copy
        </button>
        </div>
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
      </div>
    );
  }
}

ShareModal.propTypes = {
  url: React.PropTypes.string
};


export default ShareModal;
