import { connect } from 'react-redux';

import { setBounds, setAOI } from 'layout/explore/actions';

import PowerGenerationMapComponent from './component';

export default connect(
    null,
    { setBounds, setAOI }
  )(PowerGenerationMapComponent);