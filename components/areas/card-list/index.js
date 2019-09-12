import { connect } from 'react-redux';

import AreaCardList from './component';


export default connect(
  state => ({ query: state.routes.query }),
  null
)(AreaCardList);
