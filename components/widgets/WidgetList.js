import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

  @Autobind
  handleWidgetUnfavourited() {
    this.props.onWidgetUnfavourited();
  }

  render() {
    const { loading } = this.state;
    const {
      widgets,
      showRemove,
      showActions,
      showEmbed,
      showStar,
      showWidgetColllections,
      mode,
      widgetCollections,
      widgetCollectionsOptions
    } = this.props;

    const newClassName = classNames({
      column: true,
      'list-item': true,
      'small-12': true,
      'medium-4': mode === 'grid',
      [`-${mode}`]: true
    });

    return (
      <div className="c-widget-list">
        {this.state.loading &&
          <Spinner className="-light" isLoading={loading} />
        }
        <ul className="row list">
          {widgets.map(widget =>
            (<li
              key={widget.id}
              className={newClassName}
            >
              <WidgetCard
                widget={widget}
                onWidgetRemove={this.handleWidgetRemoved}
                onWidgetUnfavourited={this.handleWidgetUnfavourited}
                showActions={showActions}
                showRemove={showRemove}
                showEmbed={showEmbed}
                showStar={showStar}
                showWidgetColllections={showWidgetColllections}
                widgetCollections={widgetCollections && widgetCollections.filter(val => val.id === widget.id)} //eslint-disable-line
                widgetCollectionsOptions={widgetCollectionsOptions}
                onUpdateWidgetCollections={this.props.onUpdateWidgetCollections}
                mode={mode === 'grid' ? 'thumbnail' : 'full'}
              />
            </li>)
          )}
        </ul>
      </div>
    );
  }
}

WidgetCard.defaultProps = {
  showActions: false,
  showRemove: false,
  showEmbed: false,
  showStar: false,
  showWidgetColllections: false
};


WidgetList.propTypes = {
  widgets: PropTypes.array.isRequired,
  widgetCollections: PropTypes.array,
  widgetCollectionsOptions: PropTypes.array,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  showEmbed: PropTypes.bool,
  showStar: PropTypes.bool,
  showWidgetColllections: PropTypes.bool,
  mode: PropTypes.oneOf(['grid', 'list']).isRequired,
  // Callbacks
  onWidgetRemove: PropTypes.func,
  onWidgetUnfavourited: PropTypes.func,
  onUpdateWidgetCollections: PropTypes.func
};
