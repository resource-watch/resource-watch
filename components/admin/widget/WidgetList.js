import React from 'react';
import sortBy from 'lodash/sortBy';

import Spinner from '../ui/Spinner';
import WidgetCard from './WidgetCard';

class WidgetList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widgets: [],
      loading: true,
      selected: props.selected
    };

    // BINDINGS
    this.triggerClick = this.triggerClick.bind(this);
  }

  componentWillMount() {
    this.getWidgets();
  }

  /**
   * HELPERS
   * - getWidgets
   * - validate
   * - isValid
  */
  getWidgets() {
    const { dataset, application } = this.props;
    const url = `${process.env.WRI_API_URL}/dataset/${dataset.id}/widget?application=${application.join(',')}&includes=widget&page[size]=9999&_d=${Date.now()}`;

    fetch(new Request(url))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const widgets = sortBy(response.data.map(widget =>
          Object.assign({}, widget.attributes, {
            id: widget.id
          })
        ), 'name');

        this.setState({ widgets, loading: false });
      })
      .catch(() => {
        this.setState({ message: 'Error loading datasets', loading: false });
      });
  }

  validate() {
    const valid = true;
    this.setState({ valid });
  }

  isValid() {
    return this.state.valid;
  }


  /**
   * UI EVENTS
   * - triggerClick
   * - triggerNewClick
  */
  triggerClick(selected) {
    this.setState({ selected }, () => {
      if (this.props.onChange) this.props.onChange(this.state.selected);
    });
  }

  render() {
    const { selected } = this.state;

    return (
      <div className="c-widgets-list">
        {this.state.loading &&
          <Spinner className="-light" isLoading={this.state.loading} />
        }
        <ul className="list">
          {this.state.widgets.map(widget =>
            (<li
              key={widget.id}
              className="list-item"
            >
              <WidgetCard
                widget={widget}
                properties={{
                  'data-id': widget.id,
                  className: (widget.id === selected) ? '-selected' : ''
                }}
                onClick={this.triggerClick}
              />
            </li>)
          )}
          <li
            className="list-item"
          >
            <WidgetCard
              widget={{
                name: 'New'
              }}
              properties={{}}
              onClick={this.triggerClick}
            />
          </li>
        </ul>
      </div>
    );
  }
}

WidgetList.propTypes = {
  application: React.PropTypes.array.isRequired,
  dataset: React.PropTypes.object.isRequired,
  selected: React.PropTypes.string,
  onChange: React.PropTypes.func
};

export default WidgetList;
