import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';
import Icon from 'components/ui/Icon';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// Redux
import { connect } from 'react-redux';

// Services
import DatasetsService from 'services/DatasetsService';


// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

class DatasetsListCard extends React.Component {
  constructor(props) {
    super(props);

    // SERVICES
    this.service = new DatasetsService({
      authorization: props.user.token,
      language: props.locale
    });

    // ------------------- Bindings -----------------------
    this.handleDelete = this.handleDelete.bind(this);
    // ----------------------------------------------------
  }

  handleDelete() {
    const { dataset } = this.props;
    const metadata = dataset.metadata[0];
    toastr.confirm(`Are you sure you want to delete the dataset: ${metadata && metadata.attributes.info ? metadata.attributes.info.name : dataset.name}?`, {
      onOk: () => {
        this.service.deleteData(dataset.id)
          .then(() => {
            toastr.success('Success', 'Dataset removed successfully');
            this.props.onDatasetRemoved(dataset.id);
          })
          .catch(err => toastr.error('Error deleting the dataset', err));
      }
    });
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

DatasetsListCard.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  dataset: {}
};

DatasetsListCard.propTypes = {
  dataset: PropTypes.object,
  routes: PropTypes.object,
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  onDatasetRemoved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale,
  user: state.user
});

export default connect(mapStateToProps, null)(DatasetsListCard);
