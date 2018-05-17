import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

function FaqsNew(props) {
  const { user } = props;

  return (
    <div className="c-faqs-new">
      <FaqsForm
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_faqs', { tab: 'faqs' })}
      />
    </div>
  );
}

FaqsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(FaqsNew);
