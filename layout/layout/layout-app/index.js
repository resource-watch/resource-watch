import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';

// component
import LayoutApp from './component';

export default connect(
  (state) => ({
    modal: state.modal,
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading,
  },
)(LayoutApp);
