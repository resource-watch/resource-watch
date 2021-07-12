// hoc
import {
  withUser,
} from 'hoc/auth';

// component
import LoginRequired from './component';

export default withUser(LoginRequired);
