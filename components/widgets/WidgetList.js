import React from 'react';
import PropTypes from 'prop-types';

import Spinner from 'components/ui/Spinner';
import WidgetCard from 'components/widgets/WidgetCard';

export default class WidgetList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: !props.widgets
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.loading && props.widgets) {
      this.setState({
        loading: false
      });
    }
  }

  handleWidgetRemoved() {

  }

  render() {
    const { loading } = this.state;
    const { widgets } = this.props;

    return (
      <div className="c-widgets-list">
        {this.state.loading &&
          <Spinner className="-light" isLoading={loading} />
        }
        <ul className="list">
          {widgets.map(widget =>
            (<li
              key={widget.id}
              className="list-item"
            >
              <WidgetCard
                widget={widget}
                onClick={this.triggerClick}
                onWidgetRemove={this.handleWidgetRemoved}
              />
            </li>)
          )}
        </ul>
      </div>
    );
  }
}

WidgetList.propTypes = {
  widgets: PropTypes.array.isRequired
};
