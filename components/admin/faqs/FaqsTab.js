import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import FaqsIndex from 'components/admin/faqs/pages/index';
import FaqsNew from 'components/admin/faqs/pages/new';
import FaqsShow from 'components/admin/faqs/pages/show';

function FaqsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-faqs-tab">
      {user.token && !id &&
        <FaqsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <FaqsNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <FaqsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

FaqsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(FaqsTab);
