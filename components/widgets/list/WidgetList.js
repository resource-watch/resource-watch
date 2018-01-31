import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// components
import Spinner from 'components/ui/Spinner';
import WidgetCard from 'components/widgets/list/WidgetCard';

class WidgetList extends PureComponent {
  static defaultProps = {
    showActions: false,
    showRemove: false,
    showEmbed: false
  }

  static propTypes = {
    widgets: PropTypes.array.isRequired,
    showActions: PropTypes.bool,
    showRemove: PropTypes.bool,
    showEmbed: PropTypes.bool,
    showFavourite: PropTypes.bool,
    loading: PropTypes.bool,
    mode: PropTypes.oneOf(['grid', 'list']).isRequired,
    onWidgetClick: PropTypes.func,
    onWidgetRemove: PropTypes.func
  };

  handleWidgetRemoved = () => this.props.onWidgetRemove();

  render() {
    const {
      widgets,
      showRemove,
      showActions,
      showEmbed,
      showFavourite,
      mode,
      loading
    } = this.props;

    const newClassName = classNames({
      column: true,
      'list-item': true,
      'small-12': true,
      [`-${mode}`]: true,
      'medium-4': mode === 'grid'
    });

    return (
      <div className="c-widget-list">
        {loading && <Spinner className="-light" isLoading />}
        <ul className="row list">
          {/* REMOVE THIS!! */ }
          {widgets.map(widget =>
            (<li
              key={widget.id}
              className={newClassName}
            >
              <WidgetCard
                widget={widget}
                onWidgetClick={this.props.onWidgetClick}
                onWidgetRemove={this.handleWidgetRemoved}
                showActions={showActions}
                showRemove={showRemove}
                showEmbed={showEmbed}
                showFavourite={showFavourite}
                mode={mode === 'grid' ? 'thumbnail' : 'full'}
              />
            </li>)
          )}
        </ul>
      </div>
    );
  }
}

export default WidgetList;
