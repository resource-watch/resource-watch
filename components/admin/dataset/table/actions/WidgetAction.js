import React from 'react';

class WidgetAction extends React.Component {

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
            Widgets
          </a>
        }
      </span>
    );
  }
}

WidgetAction.propTypes = {
  data: React.PropTypes.object,
  action: React.PropTypes.object
};

export default WidgetAction;
