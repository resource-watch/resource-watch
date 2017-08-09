import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import PagesForm from 'components/admin/pages/form/PagesForm';

function PagesNew(props) {
  const { user } = props;

  return (
    <div className="c-pages-new">
      <PagesForm
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_pages', { tab: 'pages' })}
      />
    </div>
  );
}

PagesNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(PagesNew);
