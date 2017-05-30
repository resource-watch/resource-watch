import React from 'react';

import Step from '../../form/steps/Step1';
import Title from '../../../ui/Title';
import WidgetPreview from '../../preview/WidgetPreview';

class Step5 extends Step {
  render() {
    return (
      <fieldset className="c-field-container">
        <Title className="-primary -big">
          Preview
        </Title>
        <WidgetPreview
          wizard={this.props.wizard}
        />
      </fieldset>
    );
  }
}

Step5.propTypes = {
  wizard: React.PropTypes.object
};

export default Step5;
