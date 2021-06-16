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

// styles
import './styles.scss';

export default function WidgetHeader({
  widget,
  isInACollection,
  onToggleInfo,
  onToggleShare,
  isInfoVisible,
}) {
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
                onClick={onToggleShare}
              >
                <Icon
                  name="icon-share"
                  className="-small"
                />
              </button>
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
    name: PropTypes.string.isRequired,
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }),
  }).isRequired,
  isInACollection: PropTypes.bool.isRequired,
  isInfoVisible: PropTypes.bool,
  onToggleInfo: PropTypes.func.isRequired,
  onToggleShare: PropTypes.func.isRequired,
};
