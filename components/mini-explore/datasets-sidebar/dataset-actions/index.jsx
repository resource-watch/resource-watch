// import { useCallback } from 'react';
import { connect } from 'react-redux';

// component
import MiniExploreDatasetsActions from './component';

export default connect(
  (state) => ({
    userToken: state.user.token,
  }),
  null,
)(MiniExploreDatasetsActions);
