// Redux
import { connect } from 'react-redux';
import * as actions from '../search-actions';

import SearchListComponent from './search-list-component';

export default connect(
  state => ({
    ...state.search
  }),
  actions
)(SearchListComponent);
