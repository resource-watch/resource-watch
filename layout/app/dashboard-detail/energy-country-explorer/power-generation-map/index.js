import { connect } from 'react-redux';

import { setBounds } from 'layout/explore/actions';

import PowerGenerationMapComponent from './component';

export default connect(
    null,
    { setBounds }
  )(PowerGenerationMapComponent);