import {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import {
  useMe,
} from 'hooks/user';

// utils
import {
  getParametrizedWidget,
} from 'utils/widget';

// component
import WidgetItem from './component';

export default function WidgetItemContainer({
  widgetId,
  params,
  adapter,
}) {
  const [isShareVisible, setShareVisibility] = useState(false);
  const {
    data: user,
  } = useMe();
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, user?.token);

  const widgetState = useFetchWidget(
    widgetId,
    {
      includes: 'metadata',
    },
    {
      enabled: !!widgetId,
      refetchOnWindowFocus: false,
      placeholderData: {},
      select: (_widget) => getParametrizedWidget(_widget, params),
    },
  );

  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareWidget = useCallback(() => {
    setShareVisibility(true);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setShareVisibility(false);
  }, []);

  return (
    <WidgetItem
      adapter={adapter}
      widgetState={widgetState}
      isInACollection={isInACollection}
      isInfoVisible={isInfoWidgetVisible}
      isShareVisible={isShareVisible}
      handleInfoToggle={handleInfoToggle}
      handleShareToggle={handleShareWidget}
      handleCloseShareWidget={handleCloseShareWidget}
    />
  );
}

WidgetItemContainer.defaultProps = {
  params: {},
};

WidgetItemContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
