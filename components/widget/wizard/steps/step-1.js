import React from 'react';

import Step from '../../form/steps/Step1';
import Title from '../../../ui/Title';
import DatasetList from '../../../dataset/DatasetList';

class Step1 extends Step {
  render() {
    return (
      <fieldset className="c-field-container">
        <Title className="-primary -big">
          Select a dataset
        </Title>
        <DatasetList
          ref={(c) => { if (c) this.children.push(c); }}
          application={['rw']}
          selected={this.props.wizard.dataset}
          onChange={value => this.props.onChange({ dataset: value })}
        />
      </fieldset>
    );
  }
}

Step1.propTypes = {
  wizard: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step1;
