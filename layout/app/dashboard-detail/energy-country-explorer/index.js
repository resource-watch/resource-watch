import { connect } from 'react-redux';
import EnergyCountryExplorerComponent from './component';

export default connect(
    state => ({ selectedCountry: state.routes.query.country }),
    null
  )(EnergyCountryExplorerComponent);
