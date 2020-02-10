import React from 'react';
import PropTypes from 'prop-types';

// components
import AreasIndex from 'components/app/myrw/areas/pages/index';
import AreasNew from 'components/app/myrw/areas/pages/new';
import AreasEdit from 'components/app/myrw/areas/pages/show';
import AreasAlerts from 'components/app/myrw/areas/pages/alerts';

const AreasTabs = (props) => {
  const {
    tab,
    subtab,
    id,
    user
  } = props;

  return (
    <div className="c-areas-tab">
      {!id && user.token && (<AreasIndex />)}

      {id && id === 'new' && user.token &&
        <AreasNew tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' && (subtab !== 'alerts') && user.token &&
        <AreasEdit tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' && (subtab === 'alerts') && user.token &&
        <AreasAlerts tab={tab} subtab={subtab} id={id} user={user} />
      }

    </div>
  );
};

AreasTabs.propTypes = {
  user: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  id: PropTypes.string,
  subtab: PropTypes.string
};

AreasTabs.defaultProps = {
  id: null,
  subtab: null
};

export default AreasTabs;
