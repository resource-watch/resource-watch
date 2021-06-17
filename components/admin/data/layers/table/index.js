// hoc
import {
  withUser,
} from 'hoc/auth';

// component
import LayersTable from './component';

export default withUser(LayersTable);
