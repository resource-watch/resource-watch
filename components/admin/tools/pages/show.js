import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import ToolsForm from 'components/admin/tools/form/ToolsForm';

function ToolsShow(props) {
  const { id, user } = props;

  return (
    <div className="c-tools-show">
      <ToolsForm
        id={id}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_tools', { tab: 'tools' })}
      />
    </div>
  );
}

ToolsShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(ToolsShow);
