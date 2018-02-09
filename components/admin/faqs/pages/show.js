import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

function FaqsShow(props) {
  const { id, user } = props;

  return (
    <div className="c-faqs-show">
      <FaqsForm
        id={id}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_faqs', { tab: 'faqs' })}
      />
    </div>
  );
}

FaqsShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(FaqsShow);
