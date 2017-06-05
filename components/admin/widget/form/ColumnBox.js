import React from 'react';

class ColumnBox extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
  }

  render() {
    const { name } = this.props;
    return (
      <div>
        {name}
      </div>
    );
  }
}

ColumnBox.propTypes = {
  name: React.PropTypes.string,
  type: React.PropTypes.string
};

export default ColumnBox;
