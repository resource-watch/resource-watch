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

// components
import StoryStep from './component';

export default function StoryStepContainer({
  data,
  geostore,
  params,
}) {
  const query = useMemo(() => {
    if (data.isPlaceholder || !data.content.widget || !data.content.widget.length) return null;

    const blockWithQuery = data.content.widget.find(({ query: _query }) => _query);

    if (blockWithQuery) return replace(blockWithQuery.query, params);

    return null;
  }, [data, params]);

  const {
    data: queryData,
  } = useSQLQuery(
    query,
    {},
    {
      placeholderData: data,
      select: (_data) => {
        const blockWithQueryIndex = data.content.widget.findIndex(({ query: _query }) => _query);

        const blockQueryWithValue = {
          ...data.content.widget[blockWithQueryIndex],
          value: _data?.rows?.[0]?.value,
        };

        return ({
          ...data,
          content: {
            ...data.content,
            widget: data.content.widget.map((block, index) => {
              if (blockWithQueryIndex === index) return blockQueryWithValue;
              return block;
            }),
          },
        });
      },
    },
  );

  return (
    <StoryStep
      data={query ? queryData : data}
      geostore={geostore}
      params={params}
    />
  );
}

StoryStepContainer.defaultProps = {
  geostore: null,
  params: {},
};

StoryStepContainer.propTypes = {
  data: PropTypes.shape({
    isPlaceholder: PropTypes.bool,
    content: PropTypes.shape({
      widget: PropTypes.arrayOf(
        PropTypes.shape({}),
      ),
    }),
  }).isRequired,
  params: PropTypes.shape({}),
  geostore: PropTypes.string,
};
