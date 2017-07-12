import React from 'react';
import CategoryContainer from 'components/widgets/CategoryContainer';
import ValueContainer from 'components/widgets/ValueContainer';
import ColorContainer from 'components/widgets/ColorContainer';
import SizeContainer from 'components/widgets/SizeContainer';

class DimensionsContainer extends React.Component {

  render() {
    return (
      <div className="c-dimensions-container">
        <CategoryContainer />
        <ValueContainer />
        {false && <ColorContainer />  /* temporal while we have legends*/}
        <SizeContainer />
      </div>
    );
  }
}

export default DimensionsContainer;
