import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import TopicsForm from 'components/topics/form/TopicsForm';

function TopicsNew(props) {
  const { user } = props;

  return (
    <div className="c-topics-new">
      <TopicsForm
        user={user}
        onSubmit={() => Router.pushRoute('admin_topics', { tab: 'topics' })}
      />
    </div>
  );
}

TopicsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(TopicsNew);
