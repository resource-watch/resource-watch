import { useCallback } from 'react';
import classnames from 'classnames';
import { Tooltip } from 'vizzuality-components';
import pick from 'lodash/pick';

// components
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import CollectionsPanel from 'components/collections-panel';

import { fetchUserData, createUserData, updateUserData } from 'services/user';
import { useMe } from 'hooks/user';

import type { User, UserData, RWApplicationData } from 'types/user';

export default function WidgetHeader({
  widget,
  params = {},
  isInACollection,
  onToggleInfo,
  onToggleShare,
  isInfoVisible = false,
}) {
  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });
  const modalIcon = classnames({
    'icon-cross': isInfoVisible,
    'icon-info': !isInfoVisible,
  });

  const { data: user } = useMe();

  const handleAfterToggleCollection = useCallback(async () => {
    let userData: Partial<UserData> = {};
    try {
      userData = await fetchUserData(user?.token);
    } catch (error) {
      // data user are linked to user accounts but are not the same thing,
      // so we must create a data user instance if it doesn't exist before
      if (error.message === 'User not found') {
        const splitName = user.name.split(' ');
        const userObject: User = {
          ...pick(user, ['email']),
          firstName: splitName[0],
          ...(splitName[1] && { lastName: splitName[1] }),
          applicationData: {
            [process.env.NEXT_PUBLIC_APPLICATIONS]: {},
          },
        };
        userData = await createUserData(user?.token, userObject);
      }
    }

    const RWDataApplication = (userData.applicationData[process.env.NEXT_PUBLIC_APPLICATIONS] || {
      [process.env.NEXT_PUBLIC_APPLICATIONS]: { widgets: {} },
    }) as RWApplicationData;

    // if applies, updates the data application
    const newDataApplication = {
      ...RWDataApplication,
      widgets: {
        ...RWDataApplication.widgets,
        ...(Object.keys(params).length && {
          [widget.id]: params,
        }),
      },
    };

    // updates user data adding or removing the widget and its custom parametrization
    try {
      await updateUserData(user, {
        applicationData: {
          ...userData.applicationData,
          [process.env.NEXT_PUBLIC_APPLICATIONS]: newDataApplication,
        },
      });
    } catch (error) {
      throw new Error(`something went wrong updating the user data: ${error.message}`);
    }
  }, [user, widget, params]);

  return (
    <header className="c-widget-header">
      <div className="header-container">
        <div className="title-container">
          <Title className="-default">{widget?.name}</Title>
        </div>
        <div className="button-list">
          <ul>
            <li>
              <button type="button" className="c-btn -tertiary -clean" onClick={onToggleShare}>
                <Icon name="icon-share" className="-small" />
              </button>
            </li>
            <li>
              <LoginRequired>
                <Tooltip
                  overlay={
                    <CollectionsPanel
                      resource={widget}
                      resourceType="widget"
                      onToggleFavorite={handleAfterToggleCollection}
                      onToggleCollection={handleAfterToggleCollection}
                    />
                  }
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{ color: '#fff' }}
                  placement="bottomLeft"
                  trigger="click"
                >
                  <button type="button" className="c-btn -clean" tabIndex={-1}>
                    <Icon name={starIconName} className="-star -small" />
                  </button>
                </Tooltip>
              </LoginRequired>
            </li>
            <li>
              <button type="button" className="c-btn -clean" onClick={onToggleInfo}>
                <Icon name={modalIcon} className="-small" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
