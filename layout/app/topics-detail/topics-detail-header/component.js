import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/Icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';

class TopicDetailHeader extends PureComponent {
  static propTypes = { topic: PropTypes.object.isRequired }

  state = { showShareModal: false }

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
  }

  render() {
    const { topic } = this.props;
    const { showShareModal } = this.state;

    return (
      <div className="page-header-content">
        <h1>{topic.name}</h1>

        {topic.summary &&
          <h3>{topic.summary}</h3>
        }

        <div className="page-header-info">
          <ul>
            <li>
              <button
                className="c-btn -tertiary -alt -clean"
                onClick={() => this.handleToggleShareModal(true)}
              >
                <Icon name="icon-share" className="-small" />
                <span>Share</span>

                <Modal
                  isOpen={showShareModal}
                  className="-medium"
                  onRequestClose={() => this.handleToggleShareModal(false)}
                >
                  <ShareModal
                    links={{ link: typeof window !== 'undefined' && window.location.href }}
                    analytics={{
                      facebook: () => logEvent('Share', `Share topic: ${topic.name}`, 'Facebook'),
                      twitter: () => logEvent('Share', `Share topic: ${topic.name}`, 'Twitter'),
                      email: () => logEvent('Share', `Share topic: ${topic.name}`, 'Email'),
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
