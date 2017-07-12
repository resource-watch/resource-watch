import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import CategoryContainer from 'components/widgets/CategoryContainer';
import ValueContainer from 'components/widgets/ValueContainer';
import ColorContainer from 'components/widgets/ColorContainer';
import SizeContainer from 'components/widgets/SizeContainer';

class DimensionsContainer extends React.Component {

  render() {
    const { chartType } = this.props.widgetEditor;
  
    return (
      <div className="c-dimensions-container">
        <CategoryContainer />
        <ValueContainer />
        {false && <ColorContainer />  /* temporal while we have legends*/}
        { chartType && chartType === 'scatter' &&
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

export default withRedux(initStore, mapStateToProps, null)(DimensionsContainer);
