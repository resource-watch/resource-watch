import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// components
import Spinner from 'components/ui/Spinner';
import AreaCardList from 'components/areas/card-list';

// styles
import './styles.scss';

const AreasIndex = ({ areas }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (areas.length) setLoading(false);
  }, [areas]);

  return (
    <div className="c-areas-index">
      <Spinner
        isLoading={loading}
        className="-light"
      />
      <div className="c-button-container">
        <ul>
          <li>
            <Link
              route="myrw_detail"
              params={{ id: 'new', tab: 'areas' }}
            >
              <a className="c-button -secondary">New area</a>
            </Link>
          </li>
        </ul>
      </div>

      {!loading && (
        <AreaCardList
          areas={areas}
          className="user-areas-list"
        />)}

      {(areas.length === 0 && !loading) && (
        <div className="no-areas-container">
          <p>Create an area of interest to sign up for alerts.</p>
        </div>
      )}
    </div>
  );
};

AreasIndex.propTypes = { areas: PropTypes.array.isRequired };

export default AreasIndex;
