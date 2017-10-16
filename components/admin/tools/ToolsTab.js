import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import ToolsIndex from 'components/admin/tools/pages/index';
import ToolsNew from 'components/admin/tools/pages/new';
import ToolsShow from 'components/admin/tools/pages/show';

function ToolsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-tools-tab">
      {user.token && !id &&
        <ToolsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <ToolsNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <ToolsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

ToolsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(ToolsTab);
