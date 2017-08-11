import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';

class DatasetsListCard extends React.Component {

  render() {
    const { dataset, routes } = this.props;

    return (
      <div className="c-card">
        <div className="card-container">
          <header className="card-header">
            <Link
              route={routes.detail}
              params={{ tab: 'datasets', id: dataset.id }}
            >
              <a>
                <Title className="-default">
                  {dataset.name}
                </Title>
              </a>
            </Link>
            <Title className="-small">
              {dataset.provider}
            </Title>
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
  routes: PropTypes.object
};

export default DatasetsListCard;
