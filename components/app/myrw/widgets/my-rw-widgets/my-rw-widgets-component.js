import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Router } from 'routes';

// components
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import WidgetList from 'components/widgets/list/WidgetList';

class MyRWWidgets extends PureComponent {
  static defaultProps = {
    mode: 'grid'
  }

  static propTypes = {
    mode: PropTypes.oneOf(['grid', 'list']),
    orderDirection: PropTypes.oneOf(['asc', 'desc']),
    loading: PropTypes.bool,
    widgets: PropTypes.array,
    setOrderDirection: PropTypes.func
  }

  constructor(props) {
    super(props);

    const { mode } = props;

    this.state = { mode };
  }

  setListMode = () => { this.setState({ mode: 'list' }); }
  setGridMode = () => { this.setState({ mode: 'grid' }); }

  handleNewWidget = () => {
    Router.pushRoute('myrw_detail', { tab: 'widgets', id: 'new' });
  }

  handleOrderChange = () => {
    const { setOrderDirection } = this.props;
    const orderDirection = this.props.orderDirection === 'asc' ? 'desc' : 'asc';

    setOrderDirection(orderDirection);
  }

  // TO-DO
  handleWidgetRemoved = () => {}

  // TO-DO
  handleWidgetClick = () => {}

  render() {
    const { mode } = this.state;
    const { widgets, loading, orderDirection } = this.props;

    const iconName = classnames({
      'icon-arrow-up': orderDirection === 'asc',
      'icon-arrow-down': orderDirection !== 'asc'
    });

    return (
      <div className="c-myrw-widgets-my">
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
              <div className="left-container">
                <button
                  className="c-btn -a"
                  onClick={this.handleNewWidget}
                >
                  New widget
                </button>
              </div>
              <div className="buttons-container">
                <button
                  className="last-modified-container"
                  onClick={this.handleOrderChange}
                >
                  <a>Last modified</a>
                  <Icon className="-small" name={iconName} />
                </button>
                <div className="mode-buttons">
                  <button
                    className={(mode === 'grid' ? '-active' : '')}
                    onClick={this.setGridMode}
                    title="Grid view"
                  >
                    <Icon name="icon-view-grid" />
                  </button>
                  <button
                    className={(mode === 'list' ? '-active' : '')}
                    onClick={this.setListMode}
                    title="List view"
                  >
                    <Icon name="icon-list-mode" />
                  </button>
                </div>
              </div>
            </div>
            {loading && <Spinner isLoading className="-fixed -light" />}
            {!!(widgets.length) &&
              <WidgetList
                isLoading={loading}
                widgets={widgets}
                mode={mode}
                onWidgetRemove={this.handleWidgetRemoved}
                showActions
                showRemove
                onWidgetClick={this.handleWidgetClick}
              />}
            {!(widgets.length) &&
              <div className="no-widgets-div">
                You currently have no widgets
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default MyRWWidgets;
