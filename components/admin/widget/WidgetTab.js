import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import WidgetIndex from 'components/admin/widget/pages/index';
import WidgetNew from 'components/admin/widget/pages/new';
import WidgetShow from 'components/admin/widget/pages/show';

function WidgetTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-widgets-tab">
      {!id && user.token &&
        <WidgetIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {id && id === 'new' && user.token &&
        <WidgetNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {id && id !== 'new' && user.token &&
        <WidgetShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

WidgetTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetTab);
