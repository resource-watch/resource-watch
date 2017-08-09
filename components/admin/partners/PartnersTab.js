import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import PartnersIndex from 'components/admin/partners/pages/index';
import PartnersNew from 'components/admin/partners/pages/new';
import PartnersShow from 'components/admin/partners/pages/show';

function PartnersTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-partners-tab">
      {user.token && !id &&
        <PartnersIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <PartnersNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <PartnersShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

PartnersTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(PartnersTab);
