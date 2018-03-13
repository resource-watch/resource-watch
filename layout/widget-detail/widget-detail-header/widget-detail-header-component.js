import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Components
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/Icon';

// Tooltip
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// Modal
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// Constants
class WidgetDetailHeader extends PureComponent {
  static propTypes = {
    widget: PropTypes.object,
    user: PropTypes.object
  }

  state = {
    showShareModal: false
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showShareModal: bool });
  }

  render() {
    const { widget, user } = this.props;
    const isInACollection = belongsToACollection(user, { id: widget.id });

    // Favorites
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });

    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
    });

    return (
      <div className="page-header-content">
        <h1>{widget.name}</h1>

        <h3>{widget.description}</h3>

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
                      link: typeof window !== 'undefined' && window.location.href,
                      embed: typeof window !== 'undefined' && `${window.location.origin}/embed/${widget.widgetConfig.type || 'widget'}/${widget.id}`
                    }}
                    analytics={{
                      facebook: () => logEvent('Share', `Share widget: ${widget.name}`, 'Facebook'),
                      twitter: () => logEvent('Share', `Share widget: ${widget.name}`, 'Twitter'),
                      copy: type => logEvent('Share', `Share widget: ${widget.name}`, `Copy ${type}`)
                    }}
                  />
                </Modal>
              </button>
            </li>

            {/* Favorite widget icon */}
            {user && user.id &&
              <li>
                <Tooltip
                  overlay={
                    <CollectionsPanel
                      resource={{ id: widget.id }}
                      resourceType="widget"
                    />
                  }
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{
                    color: '#c32d7b'
                  }}
                  placement="bottomLeft"
                  trigger="click"
                >
                  <button
                    className="c-btn -tertiary -alt -clean"
                    tabIndex={-1}
                  >
                    <Icon
                      name={starIconName}
                      className={starIconClass}
                    />
                    <span>Favorite</span>
                  </button>
                </Tooltip>
              </li>
            }
            {/* Favorites */}
          </ul>
        </div>
      </div>
    );
  }
}

export default WidgetDetailHeader;
