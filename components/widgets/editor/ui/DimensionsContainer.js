import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import CategoryContainer from 'components/widgets/editor/ui/CategoryContainer';
import ColorContainer from 'components/widgets/editor/ui/ColorContainer';
import ValueContainer from 'components/widgets/editor/ui/ValueContainer';
import SizeContainer from 'components/widgets/editor/ui/SizeContainer';

class DimensionsContainer extends React.Component {
  render() {
    const { chartType } = this.props.widgetEditor;
    const showSize = chartType && (chartType === 'scatter' || chartType === '1d_scatter' || chartType === '1d_tick');
    return (
      <div className="c-dimensions-container">
        <CategoryContainer />
        <ValueContainer />
        {false && <ColorContainer /> /* temporal while we have legends */}
        {showSize &&
        <SizeContainer />
        }
      </div>
    );
  }
}

DimensionsContainer.propTypes = {
  // Store
  widgetEditor: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

export default connect(mapStateToProps, null)(DimensionsContainer);
