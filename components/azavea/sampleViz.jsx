import Renderer from '@widget-editor/renderer';
import {giniConfig} from './customChart';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// Pending Qs

// 1) How to add endUserFilter with paramsConfig
// https://github.com/Vizzuality/widget-editor/wiki/Filters#end-user-filters
// 2) Are we able to use any of Vega's native event stream handling?
// https://vega.github.io/vega/docs/event-streams/
// 3) Any ways to join data from multiple RW sources using a lookup transform?
// https://vega.github.io/vega/docs/transforms/lookup/

function AzaveaSampleViz({ RWAdapter }) {
  return (
    <>
      <div>
        There should be a chart rendered below.
      </div>
      <div className="widget-container">
        <Renderer adapter={RWAdapter} widgetConfig={giniConfig} />
      </div>
    </>
  );
}

AzaveaSampleViz.propTypes = {
  RWAdapter: PropTypes.func.isRequired,
};


export default connect(
  (state) => ({
    RWAdapter: getRWAdapter(state),
  })
)(AzaveaSampleViz);
