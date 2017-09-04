import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import AreasIndex from 'components/app/myrw/areas/pages/index';
import AreasNew from 'components/app/myrw/areas/pages/new';
import AreasEdit from 'components/app/myrw/areas/pages/show';

function AreasTab(props) {
  const { tab, subtab, id, user } = props;
  return (
    <div className="c-areas-tab">
      {!id && user.token &&
        <AreasIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && id === 'new' && user.token &&
        <AreasNew tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' && user.token &&
        <AreasEdit tab={tab} subtab={subtab} id={id} />
      }
    </div>
  );
}

AreasTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(AreasTab);
