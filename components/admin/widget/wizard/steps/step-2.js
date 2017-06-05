import React from 'react';

import Title from 'components/ui/Title';
import DatasetFilter from 'components/admin/dataset/DatasetFilter';

class Step2 extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.triggerChange = this.triggerChange.bind(this);
  }

  triggerChange(obj) {
    this.props.onChange(obj);
  }

  render() {
    const { dataset, wizard } = this.props;
    return (
      <fieldset className="c-field-container">
        <Title className="-primary -big">
          Filter your dataset
        </Title>
        <DatasetFilter
          dataset={dataset}
          wizard={wizard}
          onChange={this.triggerChange}
        />
      </fieldset>
    );
  }
}

Step2.propTypes = {
  dataset: React.PropTypes.object,
  wizard: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step2;
