import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { toastr } from 'react-redux-toastr';

// Components
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';

class ShareModalComponent extends PureComponent {
  static propTypes = {
    links: PropTypes.object.isRequired,
    shortLinks: PropTypes.object,
    loading: PropTypes.bool,
    /**
     * Define the category and action for the analytics
     * event
     */
    analytics: PropTypes.shape({
      facebook: PropTypes.func.isRequired,
      twitter: PropTypes.func.isRequired,
      copy: PropTypes.func.isRequired
    }),

    // Actions
    fetchShortUrl: PropTypes.func,
    resetShortLinks: PropTypes.func
  };

  static defaultProps = {
    links: {},
    loading: true,
    analytics: {
      facebook: () => {},
      twitter: () => {},
      copy: () => {}
    }
  };


  constructor(props) {
    super(props);
    this.inputs = {};

    this.state = {
      copied: {}
    };
  }

  componentDidMount() {
    const { links } = this.props;
    if (links.link) {
      this.props.fetchShortUrl({
        longUrl: links.link
      });
    }
  }

  componentWillUnmount() {
    this.props.resetShortLinks();
  }

  /**
   * - onCopyClick
   * @param  {string} type
   * @return
   */
  onCopyClick = (type) => {
    const input = this.inputs[type];
    input.select();

    try {
      document.execCommand('copy');

      this.setState({
        copied: {
          ...this.state.copied,
          [type]: true
        }
      });

      this.props.analytics.copy(type);

      setTimeout(() => {
        this.setState({
          copied: {
            ...this.state.copied,
            [type]: false
          }
        });
      }, 1000);
    } catch (err) {
      toastr.warning('Oops, unable to copy');
    }
  }


  render() {
    const { links, shortLinks, loading } = this.props;

    return (
      <div className="c-share-modal">

        <h2>Share</h2>

        <div className="share-content">
          {Object.keys(links).map((type) => {
            const htmlFor = `share-${type}`;
            const url = shortLinks[type] || links[type];

            switch (type) {
              case 'link':

                return (
                  <div key={type} className="c-field">
                    <label htmlFor={htmlFor}>
                      Public url to share
                    </label>

                    <div className="share-input-container">
                      {loading && <Spinner className="-light -tiny" isLoading />}

                      <input
                        ref={(n) => { this.inputs[type] = n; }}
                        id={htmlFor}
                        name={htmlFor}
                        className="share-input"
                        value={url}
                        readOnly
                      />

                      <div className="share-buttons">
                        <a
                          className="c-btn -secondary -compressed -square"
                          href={`http://www.facebook.com/sharer/sharer.php?u=${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => this.props.analytics.facebook(type)}
                        >
                          <Icon name="icon-facebook" className="-small" />
                        </a>

                        <a
                          className="c-btn -secondary -compressed -square"
                          href={`https://twitter.com/share?url=${url}&text=${encodeURIComponent(document.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => this.props.analytics.twitter(type)}
                        >
                          <Icon name="icon-twitter" className="-small" />
                        </a>

                        <a
                          className="c-btn -secondary -compressed"
                          tabIndex={0}
                          role="button"
                          onClick={() => this.onCopyClick(type)}
                        >
                          {this.state.copied[type] ? 'Copied' : 'Copy link'}
                        </a>
                      </div>
                    </div>
                  </div>
                );

              case 'embed':
                return (
                  <div key={type} className="c-field">
                    <label htmlFor={htmlFor}>
                      Code to embed
                    </label>

                    <div className="share-input-container">
                      <input
                        ref={(n) => { this.inputs[type] = n; }}
                        id={htmlFor}
                        name={htmlFor}
                        className="share-input"
                        value={`<iframe src="${url}" width="100%" height="500px" frameBorder="0" />`}
                        readOnly
                      />

                      <div className="share-buttons">
                        <a
                          className="c-btn -secondary -compressed"
                          tabIndex={0}
                          role="button"
                          onClick={() => this.onCopyClick(type)}
                        >
                          {this.state.copied[type] ? 'Copied' : 'Copy link'}
                        </a>
                      </div>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  }
}

export default ShareModalComponent;
