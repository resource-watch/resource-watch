import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';
import { setLocale } from 'redactions/common';

import LayoutAppComponent from './layout-app-component';

export default connect(
  state => ({
    modal: state.modal,
    user: state.user,
    routes: state.routes
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading,
    setLocale
  }
)(LayoutAppComponent);
