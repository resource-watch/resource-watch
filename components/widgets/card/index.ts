import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'redactions/modal';

// component
import WidgetCard from './component';

export default connect(() => ({}), {
  toggleModal,
  setModalOptions,
})(WidgetCard);
