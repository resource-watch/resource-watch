import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import Icon from 'components/ui/icon';
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

class DatasetsListCard extends PureComponent {
  static defaultProps = { dataset: {} };

  static propTypes = {
    dataset: PropTypes.object,
    user: PropTypes.object.isRequired,
    onDatasetRemoved: PropTypes.func.isRequired
  };

  getDatasetName() {
    const { dataset } = this.props;
    const metadata = dataset.metadata[0];

    if (metadata && metadata.info && metadata.info.name) {
      return metadata.info.name;
    }

    return dataset.name;
  }

  handleDelete = () => {
    const { dataset } = this.props;
    this.props.onDatasetRemoved(dataset);
  }

  render() {
    const { dataset, user } = this.props;

    const isOwner = dataset.userId === user.id;
    const isAdmin = user.role === 'ADMIN';
    const isInACollection = belongsToACollection(user, dataset);

    const classNames = classnames({ '-owner': isOwner && !isAdmin });

    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });

    return (
      <div className={`c-card c-datasets-list-card ${classNames}`}>
        <div className="card-container">
          <header className="card-header">
            {isAdmin &&
              <Link
                route="admin_data_detail"
                params={{ tab: 'datasets', id: dataset.id }}
              >
                <a>
                  <Title className="-default">
                    {this.getDatasetName()}
                  </Title>
                </a>
              </Link>
            }

            {!isAdmin && !isOwner &&
              <Link
                route="explore_detail"
                params={{ id: dataset.id }}
              >
                <a>
                  <Title className="-default">
                    {this.getDatasetName()}
                  </Title>
                </a>
              </Link>
            }

            {!isAdmin && isOwner &&
              <Link
                route="myrw_detail"
                params={{ tab: 'datasets', id: dataset.id }}
              >
                <a>
                  <Title className="-default">
                    {this.getDatasetName()}
                  </Title>
                </a>
              </Link>
            }

            <Title className="-small">
              {dataset.provider}
            </Title>

            <Tooltip
              overlay={
                <CollectionsPanel
                  resource={dataset}
                  resourceType="dataset"
                />
              }
              overlayClassName="c-rc-tooltip"
              overlayStyle={{ color: '#fff' }}
              placement="bottomLeft"
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
            {dataset.status !== 'saved' &&
              dataset.status
            }
          </div>

          {isOwner && !isAdmin &&
            <div className="actions">
              <a
                onKeyPress={this.handleDelete}
                role="button"
                className="c-button -secondary -compressed"
                tabIndex={0}
                onClick={this.handleDelete}
              >
                Delete
              </a>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default DatasetsListCard;
