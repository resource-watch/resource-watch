import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';
import Icon from 'components/ui/Icon';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

class DatasetsListCard extends PureComponent {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    dataset: {}
  };

  static propTypes = {
    dataset: PropTypes.object,
    routes: PropTypes.object,
    user: PropTypes.object.isRequired,
    onDatasetRemoved: PropTypes.func.isRequired
  };

  handleDelete = () => {
    const { dataset } = this.props;
    this.props.onDatasetRemoved(dataset);
  }

  render() {
    const { dataset, routes, user } = this.props;
    const metadata = dataset.metadata[0];
    const isInACollection = belongsToACollection(user, dataset);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });

    return (
      <div className="c-card c-datasets-list-card">
        <div className="card-container">
          <header className="card-header">
            <Link
              route={routes.detail}
              params={{ tab: 'datasets', id: dataset.id }}
            >
              <a>
                <Title className="-default">
                  {metadata && metadata.attributes.info ? metadata.attributes.info.name :
                    dataset.name}
                </Title>
              </a>
            </Link>
            <Title className="-small">
              {dataset.provider}
            </Title>
            <Tooltip
              overlay={<CollectionsPanel
                resource={dataset}
                resourceType="dataset"
              />}
              overlayClassName="c-rc-tooltip"
              overlayStyle={{
                color: '#fff'
              }}
              placement="bottom"
              trigger="click"
            >
              <button
                className="c-btn favourite-button"
                tabIndex={-1}
              >
                <Icon
                  name={starIconName}
                  className="-star -small"
                />
              </button>
            </Tooltip>
          </header>

          <div className="card-content">
            {dataset.status === 'saved' &&
              <DatasetsRelatedContent
                dataset={dataset}
                route={routes.detail}
              />
            }
            {dataset.status !== 'saved' &&
              dataset.status
            }
          </div>

          <div className="actions">
            <a
              role="button"
              tabIndex={0}
              onClick={this.handleDelete}
            >
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default DatasetsListCard;
