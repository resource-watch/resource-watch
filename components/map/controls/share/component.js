import React, { PureComponent } from 'react';

// components
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import Icon from 'components/ui/icon';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class ShareControls extends PureComponent {
  state = { showShareModal: false }

  handleToggleShareModal = (modalVisibility) => {
    this.setState({ showShareModal: modalVisibility });
  }

  render() {
    const { showShareModal } = this.state;
    const location = typeof window !== 'undefined' && window.location;

    return (
      <div className="c-share-control">
        <button
          type="button"
          className="share-control--btn"
          onClick={() => this.handleToggleShareModal(true)}
        >
          <Icon
            name="icon-share"
            className="-small"
          />

          <Modal
            isOpen={showShareModal}
            className="-medium"
            onRequestClose={() => this.handleToggleShareModal(false)}
          >
            <ShareModal
              links={{
                link: location && location.href,
                embed: location && `${location.origin}/embed${location.pathname}${location.search}`
              }}
              analytics={{
                facebook: () => logEvent('Share', 'Share explore', 'Facebook'),
                twitter: () => logEvent('Share', 'Share explore', 'Twitter'),
                email: () => logEvent('Share', 'Share explore', 'Email'),
                copy: type => logEvent('Share', 'Share explore', `Copy ${type}`)
              }}
            />
          </Modal>
        </button>
      </div>
    );
  }
}

export default ShareControls;
