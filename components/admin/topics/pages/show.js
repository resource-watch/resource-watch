import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import TopicsForm from 'components/topics/form/TopicsForm';

function TopicsShow(props) {
  const { id, user } = props;

  return (
    <div className="c-topics-show">
      <TopicsForm
        id={id}
        user={user}
        onSubmit={() => Router.pushRoute('admin_topics', { tab: 'topics' })}
      />
    </div>
  );
}

TopicsShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(TopicsShow);
