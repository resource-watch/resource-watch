import { handleModule } from 'redux-tools';

import topics from './topics';

export default { topics: handleModule(topics) };

