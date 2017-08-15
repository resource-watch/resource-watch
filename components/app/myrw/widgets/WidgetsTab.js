import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import WidgetsIndex from 'components/app/myrw/widgets/pages/index';
import WidgetsEdit from 'components/app/myrw/widgets/pages/edit';
import WidgetsNew from 'components/app/myrw/widgets/pages/new';

function WidgetsTab(props) {
  const { tab, subtab, id, user } = props;
  return (
    <div className="c-widgets-tab">
      {!id && user.token &&
        <WidgetsIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && subtab === 'edit' && user.token &&
        <WidgetsEdit tab={tab} subtab={subtab} id={id} />
      }

      {subtab === 'new' && user.token &&
        <WidgetsNew tab={tab} subtab={subtab} />
      }
    </div>
  );
}

WidgetsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsTab);
