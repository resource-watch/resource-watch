import { connect } from 'react-redux';
import SectionComponent from './component';

export default connect(
    state => ({ user: state.user }),
    null
  )(SectionComponent);