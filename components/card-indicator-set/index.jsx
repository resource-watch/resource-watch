import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';

// hooks
import {
  useMe,
} from 'hooks/user';
import {
  useFetchWidget,
} from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import CardIndicatorSet from './component';

export default function CardIndicatorSetContainer({
  config: {
    indicators,
  },
  ...restProps
}) {
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  const {
    data: user,
  } = useMe();

  const defaultIndicator = useMemo(
    () => indicators.find(({ default: isDefault }) => isDefault) || indicators?.[0],
    [indicators],
  );
  const [currentIndicator, setIndicator] = useState(defaultIndicator || null);
  const handleClickCard = useCallback((idSelected) => {
    setIndicator(indicators.find(({ id }) => idSelected === id));
  }, [indicators]);

  const defaultSection = useMemo(
    () => {
      if (!currentIndicator) return null;
      if (!currentIndicator?.sections) return null;

      return (currentIndicator?.sections || []).find(
        ({ default: isDefault }) => isDefault,
      ) || currentIndicator.sections[0];
    },
    [currentIndicator],
  );

  const mainWidgetAvailable = useMemo(
    () => {
      if (defaultSection) return defaultSection.widgets?.[0]?.id;

      return currentIndicator?.widgets?.[0]?.id;
    },
    [currentIndicator, defaultSection],
  );

  const {
    data: mainWidget,
  } = useFetchWidget(
    mainWidgetAvailable,
    {
      includes: 'metadata',
    },
    {
      enabled: !!(mainWidgetAvailable),
      refetchOnWindowFocus: false,
      placeholderData: {},
    },
  );

  const {
    isInACollection,
  } = useBelongsToCollection(mainWidget?.id, user?.token);

  return (
    <CardIndicatorSet
      {...restProps}
      isInACollection={isInACollection}
      RWAdapter={RWAdapter}
      indicator={currentIndicator}
      handleClickCard={handleClickCard}
    />
  );
}

CardIndicatorSetContainer.propTypes = {
  config: PropTypes.shape({
    indicators: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};
