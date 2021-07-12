// hoc
import {
  withUser,
} from 'hoc/auth';

// component
import WidgetsTable from './component';

export default withUser(WidgetsTable);
