import React from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

class ShareExploreDetailModal extends React.Component {
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

  getContent() {
    const { url } = this.props;
    const content = (
      <div className="url-container">
        <input ref={(n) => { this.input = n; }} value={url} className="url" readOnly />
        <button className="c-btn -primary -filled" onClick={() => this.onCopyClick()}>
          Copy
        </button>
      </div>
    );

    return (
      <div className="share-content">
        <h1 className="c-text -header-normal -thin title">Share this page</h1>
        {content}
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

  render() {
    const { datasetId, showEmbed } = this.props;
    const embedSt = `<iframe src="http://staging.resourcewatch.org/embed/dataset/${datasetId}" width="100%" height="474px" frameBorder="0"></iframe>`;

    return (
      <div className="share-modal">
        {this.getContent()}
        {showEmbed &&
          <div className="embed-content">
            <h1 className="c-text -thin title">Share into your web</h1>
            <p>You may include this content on your webpage. To do this, copy the following html
            code and insert it into the source code of your page:</p>
            <div className="url-container">
              <input ref={(n) => { this.input = n; }} value={embedSt} className="url" readOnly />
              <button className="c-btn -primary -filled" onClick={() => this.onCopyClick()}>
                Copy
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

ShareExploreDetailModal.propTypes = {
  url: PropTypes.string,
  datasetId: PropTypes.string,
  showEmbed: PropTypes.bool.isRequired
};


export default ShareExploreDetailModal;
