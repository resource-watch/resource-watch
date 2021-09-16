// hoc
import {
  withUser,
} from 'hoc/auth';

// component
import DeleteAction from './component';

export default withUser(DeleteAction);
