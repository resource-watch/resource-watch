import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

// component
import WidgetCard from './component';

export default connect(
  state => ({ user: state.user }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip
  }
)(WidgetCard);
