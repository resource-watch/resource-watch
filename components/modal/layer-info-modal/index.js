import { connect } from 'react-redux';
import LayerInfoModalComponent from './layer-info-modal-component';

export default connect(
  state => ({
    embed: state.common.embed
  }),
  null
)(LayerInfoModalComponent);
