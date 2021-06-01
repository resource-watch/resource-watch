import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Tooltip,
} from 'vizzuality-components';

// components
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import {
  logEvent,
} from 'utils/analytics';

// styles
import './styles.scss';

export default function WidgetHeader({
  widget,
  isInACollection,
  onToggleInfo,
  isInfoVisible,
}) {
  const [shareVisible, setShareVisibility] = useState(false);

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });
  const modalIcon = classnames({
    'icon-cross': isInfoVisible,
    'icon-info': !isInfoVisible,
  });

  return (
    <header className="c-widget-header">
      <div className="header-container">
        <div className="title-container">
          <Title className="-default">{widget?.name}</Title>
        </div>
        <div className="button-list">
          <ul>
            <li>
              <button
                type="button"
                className="c-btn -tertiary -clean"
                onClick={() => setShareVisibility(true)}
              >
                <Icon
                  name="icon-share"
                  className="-small"
                />
              </button>

              <Modal
                isOpen={shareVisible}
                className="-medium"
                onRequestClose={() => setShareVisibility(false)}
              >
                <ShareModal
                  links={{
                    link: typeof window !== 'undefined' && `${window.location.origin}/embed/${widget.type}/${widget.id}`,
                    embed: typeof window !== 'undefined' && `${window.location.origin}/embed/${widget.type}/${widget.id}`,
                  }}
                  analytics={{
                    facebook: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Facebook'),
                    twitter: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Twitter'),
                    email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                    copy: (type) => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`),
                  }}
                />
              </Modal>
            </li>

            <li>
              <LoginRequired redirect={false}>
                <Tooltip
                  overlay={(
                    <CollectionsPanel
                      resource={widget}
                      resourceType="widget"
                    />
                  )}
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{ color: '#fff' }}
                  placement="bottomLeft"
                  trigger="click"
                >
                  <button
                    type="button"
                    className="c-btn -clean"
                    tabIndex={-1}
                  >
                    <Icon
                      name={starIconName}
                      className="-star -small"
                    />
                  </button>
                </Tooltip>
              </LoginRequired>
            </li>
            <li>
              <button
                type="button"
                className="c-btn -clean"
                onClick={onToggleInfo}
              >
                <Icon name={modalIcon} className="-small" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

WidgetHeader.defaultProps = {
  isInfoVisible: false,
};

WidgetHeader.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isInACollection: PropTypes.bool.isRequired,
  isInfoVisible: PropTypes.bool,
  onToggleInfo: PropTypes.func.isRequired,
};
