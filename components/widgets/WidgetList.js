import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

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

  @Autobind
  handleWidgetRemoved() {
    this.props.onWidgetRemove();
  }

  render() {
    const { loading } = this.state;
    const { widgets } = this.props;

    return (
      <div className="c-widget-list">
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
  widgets: PropTypes.array.isRequired,
  // Callbacks
  onWidgetRemove: PropTypes.func.isRequired
};
