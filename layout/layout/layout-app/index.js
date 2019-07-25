import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';

// selectors
import { isFullScreen } from './selectors';

// component
import LayoutApp from './component';

export default connect(
  state => ({
    modal: state.modal,
    user: state.user,
    isFullScreen: isFullScreen(state)
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading
  }
)(LayoutApp);
