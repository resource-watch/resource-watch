import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Spinner from 'components/widgets/editor/ui/Spinner';
import DockWidgetsCard from './DockWidgetsCard';

export default class DockWidgetList extends React.Component {
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

  /**
   * UI HELPERS
   * - onSelect
  */
  onSelect = (widget) => {
    this.props.onSelect(widget);
  }

  render() {
    const { loading } = this.state;
    const {
      widgets,
      widgetsSelected
    } = this.props;

    const newClassName = classNames({
      column: true,
      'list-item': true,
      'small-12': true,
      'medium-4': true
    });

    return (
      <div className="c-widget-list">
        {this.state.loading &&
          <Spinner className="-light" isLoading={loading} />
        }

        {!widgets.length && !this.state.loading &&
          'No widgets available'
        }

        {!!widgets.length &&
          <ul className="row list">
            {widgets.map(widget => (
              <li
                key={widget.id}
                className={newClassName}
              >
                <DockWidgetsCard
                  widget={widget}
                  selected={widgetsSelected.includes(widget.id)}
                  onSelect={this.onSelect}
                />
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

DockWidgetList.defaultProps = {
};


DockWidgetList.propTypes = {
  widgets: PropTypes.array.isRequired,
  widgetsSelected: PropTypes.array.isRequired,
  // Callbacks
  onSelect: PropTypes.func
};
