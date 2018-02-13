import { connect } from 'react-redux';
import ShareModalComponent from './share-modal-component';

import * as actions from './share-modal-actions';
import * as reducers from './share-modal-reducers';

const initialState = {
  /** @type {{ category: bool, action: bool }} open */
  open: false,
  /** @type {{ category: array, action: array }} tabs */
  tabs: ['link', 'embed'],
  /** @type {{ category: object, action: object }} links */
  links: {
    link: '',
    embed: ''
  },
  /** @type {{ category: string, action: string }} tab */
  tab: 'link',
  /** @type {{ category: string, action: string }} analytics */
  analytics: null
};

export { initialState, actions, reducers };

const mapStateToProps = state => ({
  ...state.shareModal
});

const mapDispatchToProps = {
  ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareModalComponent);
