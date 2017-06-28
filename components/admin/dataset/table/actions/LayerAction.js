import React from 'react';

class LayerAction extends React.Component {

  parseHref() {
    const { action, data } = this.props;
    const id = data.id;
    const path = action.path;

    return path.replace(':id', id);
  }

  render() {
    const { data } = this.props;
    return (
      <span>
        {(data.status === 'saved') &&
          <a href={this.parseHref()}>
            Layers
          </a>
        }
      </span>
    );
  }
}

LayerAction.propTypes = {
  data: React.PropTypes.object,
  action: React.PropTypes.object
};

export default LayerAction;
