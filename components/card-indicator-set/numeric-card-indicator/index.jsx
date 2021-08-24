import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  replace,
} from '@vizzuality/layer-manager-utils';

// hooks
import {
  useSQLQuery,
} from 'hooks/sql';

import NumericCardIndicator from './component';

export default function NumericCardIndicatorContainer({
  id,
  theme,
  isSelected,
  data,
  params,
  onClickCard,
}) {
  const {
    query,
  } = data;

  const parametrizedQuery = useMemo(() => {
    if (!query) return null;

    return replace(query, params);
  }, [query, params]);

  const {
    data: queryData,
  } = useSQLQuery(
    parametrizedQuery,
    {},
    {
      placeholderData: data,
      select: (_data) => ({
        ...data,
        value: _data?.rows?.[0]?.x,
      }),
    },
  );

  return (
    <NumericCardIndicator
      id={id}
      data={queryData}
      isSelected={isSelected}
      theme={theme}
      onClickCard={onClickCard}
    />
  );
}

NumericCardIndicatorContainer.defaultProps = {
  params: {},
  isSelected: false,
  theme: 'primary',
};

NumericCardIndicatorContainer.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    query: PropTypes.string.isRequired,
    format: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({}),
  isSelected: PropTypes.bool,
  theme: PropTypes.string,
  onClickCard: PropTypes.func.isRequired,
};
