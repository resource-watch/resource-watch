import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tooltip } from 'vizzuality-components';

// components
import Title from 'components/ui/Title';
import Icon from 'components/ui/icon';
import CollectionsPanel from 'components/collections-panel';
import ForwardLink from 'components/forward-link';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

const DatasetsListCard = ({
  dataset,
  user,
  getDatasetsByTab,
  onDatasetRemoved,
}) => {
  const {
    query: {
      subtab,
    },
  } = useRouter();
  const {
    isInACollection,
  } = useBelongsToCollection(dataset.id, user.token);

  const getDatasetName = useCallback(() => {
    const metadata = dataset.metadata[0];

    if (metadata && metadata.info && metadata.info.name) {
      return metadata.info.name;
    }

    return dataset.name;
  }, [dataset]);

  const handleDelete = useCallback(() => {
    onDatasetRemoved(dataset);
  }, [dataset, onDatasetRemoved]);

  const handleCollections = useCallback(() => {
    getDatasetsByTab(subtab);
  }, [subtab, getDatasetsByTab]);

  const isOwner = dataset.userId === user.id;
  const isAdmin = user.role === 'ADMIN';

  const classNames = classnames('c-card c-datasets-list-card', { '-owner': isOwner && !isAdmin });

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });

  const hrefLink = useMemo(() => {
    if (isAdmin) return `/admin/data/datasets/${dataset.id}`;
    if (!isAdmin && isOwner) return `/myrw-detail/datasets/${dataset.id}`;

    return `/explore/${dataset.slug}`;
  }, [isAdmin, isOwner, dataset.id, dataset.slug]);

  return (
    <div className={classNames}>
      <div className="card-container">
        <header className="card-header">
          <Link
            href={hrefLink}
            passHref
          >
            <ForwardLink>
              <Title className="-default">
                {getDatasetName()}
              </Title>
            </ForwardLink>
          </Link>

          <Title className="-small">
            {dataset.provider}
          </Title>

          <Tooltip
            overlay={(
              <CollectionsPanel
                resource={dataset}
                resourceType="dataset"
                onToggleCollection={handleCollections}
                onToggleFavorite={handleCollections}
              />
            )}
            overlayClassName="c-rc-tooltip"
            overlayStyle={{ color: '#fff' }}
            placement="bottomLeft"
            trigger="click"
          >
            <button
              type="button"
              className="c-btn favourite-button"
            >
              <Icon
                name={starIconName}
                className="-star -small"
              />
            </button>
          </Tooltip>
        </header>

        <div className="card-content">
          {dataset.status !== 'saved' && (dataset.status)}
        </div>

        {isOwner && !isAdmin && (
          <div className="actions">
            <button
              type="button"
              className="c-button -secondary -compressed"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

DatasetsListCard.defaultProps = { dataset: {} };

DatasetsListCard.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    status: PropTypes.string,
    provider: PropTypes.string,
    userId: PropTypes.string,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDatasetRemoved: PropTypes.func.isRequired,
  getDatasetsByTab: PropTypes.func.isRequired,
};

export default DatasetsListCard;
