import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';
import { setLocale } from 'redactions/common';

import LayoutAdminComponent from './layout-admin-component';

export default connect(
  (state) => ({
    modal: state.modal,
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading,
    setLocale,
  },
)(LayoutAdminComponent);
