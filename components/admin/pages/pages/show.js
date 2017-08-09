import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import PagesForm from 'components/admin/pages/form/PagesForm';

function PagesShow(props) {
  const { id, user } = props;

  return (
    <div className="c-pages-show">
      <PagesForm
        id={id}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_pages', { tab: 'pages' })}
      />
    </div>
  );
}

PagesShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(PagesShow);
