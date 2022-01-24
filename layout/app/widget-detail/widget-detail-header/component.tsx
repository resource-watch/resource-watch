import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';

// hooks
import { useMe } from 'hooks/user';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// types
import type { APIWidgetSpec } from 'types/widget';

const WidgetShareModal = dynamic(() => import('../../../../components/widgets/share-modal'), {
  ssr: false,
});

const WidgetDetailHeader = ({
  widget,
  params = {},
}: {
  widget: APIWidgetSpec;
  params: Record<string, string | number>;
}) => {
  const [shareModalVisibility, setShareModalVisibility] = useState(false);
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widget.id, user?.token);

  const handleOpenShareModal = useCallback(() => {
    setShareModalVisibility(true);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setShareModalVisibility(false);
  }, []);

  return (
    <>
      <div className="page-header-content">
        <h1>{widget.name}</h1>
        <h3>{widget.description}</h3>
        <ul className="flex">
          <li className="ml-5 first:m-0">
            <button
              type="button"
              className="c-btn -tertiary -alt -clean"
              onClick={handleOpenShareModal}
            >
              <Icon name="icon-share" className="-small fill-white" />
              <span className="text-white">Share</span>
            </button>
          </li>

          {user?.id && (
            <li className="ml-5 first:m-0">
              <Tooltip
                overlay={<CollectionsPanel resource={widget} resourceType="widget" />}
                overlayClassName="c-rc-tooltip"
                overlayStyle={{ color: '#c32d7b' }}
                placement="bottomLeft"
                trigger="click"
              >
                <button type="button" className="c-btn -tertiary -alt -clean">
                  <Icon
                    name={classnames({
                      'icon-star-full': isInACollection,
                      'icon-star-empty': !isInACollection,
                    })}
                    className={classnames({
                      'transition-colors duration-300 -small': true,
                      'fill-yellow': isInACollection,
                      'fill-white': !isInACollection,
                    })}
                  />
                  <span className="text-white">Favorite</span>
                </button>
              </Tooltip>
            </li>
          )}
        </ul>
      </div>
      {shareModalVisibility && (
        <WidgetShareModal
          isVisible
          widget={widget}
          onClose={handleCloseShareWidget}
          params={params}
        />
      )}
    </>
  );
};

export default WidgetDetailHeader;
