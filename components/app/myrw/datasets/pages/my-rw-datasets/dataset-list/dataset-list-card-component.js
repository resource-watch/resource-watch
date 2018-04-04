import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import ToggleFavorite from 'components/favorites/toggle-favorite';

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

  getDatasetName() {
    const { dataset } = this.props;
    const metadata = dataset.metadata[0];

    if (metadata && metadata.attributes.info && metadata.attributes.info.name) {
      return metadata.attributes.info.name;
    }

    return dataset.name;
  }

  handleDelete = () => {
    const { dataset } = this.props;
    this.props.onDatasetRemoved(dataset);
  }

  render() {
    const { dataset, routes, user } = this.props;

    const isOwnerOrAdmin = (dataset.userId === user.id || user.role === 'ADMIN');

    const classNames = classnames({
      '-owner': isOwnerOrAdmin
    });

    return (
      <div className={`c-card c-datasets-list-card ${classNames}`}>
        <div className="card-container">
          <header className="card-header">
            {isOwnerOrAdmin &&
              <Link
                route={routes.detail}
                params={{ tab: 'datasets', id: dataset.id }}
              >
                <a>
                  <Title className="-default">
                    {this.getDatasetName()}
                  </Title>
                </a>
              </Link>
            }

            {!isOwnerOrAdmin &&
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

            <Title className="-small">
              {dataset.provider}
            </Title>

            <ToggleFavorite data={dataset} type="dataset" />

          </header>

          <div className="card-content">
            {dataset.status !== 'saved' &&
              dataset.status
            }
          </div>

          {isOwnerOrAdmin &&
            <div className="actions">
              <a
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
