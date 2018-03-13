import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Icon from 'components/ui/Icon';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Constants
class TopicDetailHeader extends React.Component {
  static propTypes = {
    topic: PropTypes.object
  }

  state = {
    showShareModal: false
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
  }

  render() {
    const { topic } = this.props;

    return (
      <div className="page-header-content">
        <h1>{topic.name}</h1>

        {topic.summary &&
          <h3>{topic.summary}</h3>
        }

        <div className="page-header-info">
          <ul>
            <li>
              <button className="c-btn -tertiary -alt -clean" onClick={() => this.handleToggleShareModal(true)}>
                <Icon name="icon-share" className="-small" />
                <span>Share</span>

                <Modal
                  isOpen={this.state.showShareModal}
                  className="-medium"
                  onRequestClose={() => this.handleToggleShareModal(false)}
                >
                  <ShareModal
                    links={{
                      link: typeof window !== 'undefined' && window.location.href
                    }}
                    analytics={{
                      facebook: () => logEvent('Share', `Share topic: ${topic.name}`, 'Facebook'),
                      twitter: () => logEvent('Share', `Share topic: ${topic.name}`, 'Twitter'),
                      copy: type => logEvent('Share', `Share topic: ${topic.name}`, `Copy ${type}`)
                    }}
                  />
                </Modal>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TopicDetailHeader;
