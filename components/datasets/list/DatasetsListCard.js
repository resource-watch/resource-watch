import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';

class DatasetsListCard extends React.Component {

  render() {
    const { dataset, routes } = this.props;

    return (
      <Link
        route={routes.detail}
        params={{ tab: 'datasets', id: dataset.id }}
      >
        <a className="c-card">
          <div className="card-container">
            <header className="card-header">
              <Title className="-default">
                {dataset.name}
              </Title>
              <Title className="-small">
                {dataset.provider}
              </Title>
            </header>

            <div className="card-content">

            </div>
          </div>
        </a>
      </Link>
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
