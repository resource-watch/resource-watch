import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'redactions/modal';

// component
import LayoutSplashDetail from './component';

export default connect(
  state => ({
    routes: state.routes,
    modal: state.modal,
    responsive: state.responsive
  }),
  {
    toggleModal,
    setModalOptions
  }
)(LayoutSplashDetail);
