import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// utils
import { logEvent } from 'utils/analytics';

const WidgetDetailHeader = ({
  widget,
  user,
}) => {
  const [shareModalVisibility, setShareModalVisibility] = useState(false);

  const handleToggleShareModal = useCallback((_visibility) => {
    setShareModalVisibility(_visibility);
  }, []);

  const {
    isInACollection,
  } = useBelongsToCollection(widget.id, user?.token);

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });
  const starIconClass = classnames({
    '-small': true,
    '-filled': isInACollection,
    '-empty': !isInACollection,
  });

  return (
    <div className="page-header-content">
      <h1>{widget.name}</h1>

      <h3>{widget.description}</h3>

      <div className="page-header-info">
        <ul>
          <li>
            <button
              type="button"
              className="c-btn -tertiary -alt -clean"
              onClick={() => handleToggleShareModal(true)}
            >
              <Icon name="icon-share" className="-small" />
              <span>Share</span>

              <Modal
                isOpen={shareModalVisibility}
                className="-medium"
                onRequestClose={() => handleToggleShareModal(false)}
              >
                <ShareModal
                  links={{
                    link: typeof window !== 'undefined' && window.location.href,
                    embed: typeof window !== 'undefined' && `${window.location.origin}/embed/${widget.widgetConfig.type || 'widget'}/${widget.id}`,
                  }}
                  analytics={{
                    facebook: () => logEvent('Share', `Share widget: ${widget.name}`, 'Facebook'),
                    twitter: () => logEvent('Share', `Share widget: ${widget.name}`, 'Twitter'),
                    email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                    copy: (type) => logEvent('Share', `Share widget: ${widget.name}`, `Copy ${type}`),
                  }}
                />
              </Modal>
            </button>
          </li>

          {(user && user.id) && (
            <li>
              <Tooltip
                overlay={(
                  <CollectionsPanel
                    resource={{ id: widget.id }}
                    resourceType="widget"
                  />
                )}
                overlayClassName="c-rc-tooltip"
                overlayStyle={{ color: '#c32d7b' }}
                placement="bottomLeft"
                trigger="click"
              >
                <button
                  type="button"
                  className="c-btn -tertiary -alt -clean"
                >
                  <Icon
                    name={starIconName}
                    className={starIconClass}
                  />
                  <span>Favorite</span>
                </button>
              </Tooltip>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

WidgetDetailHeader.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
};

export default WidgetDetailHeader;
