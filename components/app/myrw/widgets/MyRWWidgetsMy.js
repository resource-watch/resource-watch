import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetList from 'components/widgets/list/WidgetList';
import Icon from 'components/ui/Icon';

class MyRWWidgetsMy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      myWidgetsLoaded: false,
      myWidgets: null,
      mode: 'grid',
      orderDirection: 'desc'
    };

    // User service
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });

    // ------------------- Bindings -----------------------
    this.setMode = this.setMode.bind(this);
    this.handleWidgetRemoved = this.handleWidgetRemoved.bind(this);
    this.handleOrderChange = this.handleOrderChange.bind(this);
    this.handleSelectedWidgetCollectionChange =
      this.handleSelectedWidgetCollectionChange.bind(this);
    this.handleUpdateWidgetCollections = this.handleUpdateWidgetCollections.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadWidgets();
    this.loadWidgetCollections();
  }

  setMode(value) {
    this.setState({
      mode: value
    });
  }

  loadWidgetCollections() {
    this.widgetService.getUserWidgetCollections(this.props.user)
      .then((response) => {
        this.setState({ widgetCollections: response });
      });
  }

  loadWidgets() {
    const { orderDirection } = this.state;
    this.setState({
      myWidgetsLoaded: false
    });
    this.widgetService.getUserWidgets(this.props.user.id, true, orderDirection, 'vocabulary,metadata')
      .then((response) => {
        this.setState({
          myWidgetsLoaded: true,
          myWidgets: response
        });
      }).catch(err => toastr.error('Error', err));
  }

  handleWidgetRemoved() {
    this.loadWidgets(this.props);
  }

  handleWidgetClick = (w) => {
    Router.pushRoute('myrw_detail', { tab: 'widgets', subtab: 'edit', id: w.id });
  }

  handleOrderChange() {
    const newOrder = this.state.orderDirection === 'asc' ? 'desc' : 'asc';
    this.setState({
      orderDirection: newOrder
    },
    () => this.loadWidgets());
  }

  handleSelectedWidgetCollectionChange(value) {
    this.setState({ selectedWidgetCollection: value.value });
  }

  handleUpdateWidgetCollections() {
    this.loadWidgets();
    this.loadWidgetCollections();
  }

  render() {
    const {
      myWidgetsLoaded,
      myWidgets,
      mode,
      orderDirection
    } = this.state;

    const { user } = this.props;

    return (
      <div className="c-myrw-widgets-my">
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
              <div className="left-container">
                <button
                  className="c-btn -a"
                  onClick={() => Router.pushRoute('myrw_detail', { tab: 'widgets', id: 'new' })}
                >
                  New widget
                </button>
              </div>
              <div className="buttons-container">
                <div
                  role="button"
                  tabIndex={0}
                  className="last-modified-container"
                  onClick={this.handleOrderChange}
                >
                  <a>
                    Last modified
                  </a>
                  {orderDirection === 'asc' &&
                    <Icon className="-small" name="icon-arrow-up" />
                  }
                  {orderDirection === 'desc' &&
                    <Icon className="-small" name="icon-arrow-down" />
                  }
                </div>
                <div className="mode-buttons">
                  <button
                    className={(mode === 'grid' ? '-active' : '')}
                    onClick={() => this.setMode('grid')}
                    title="Grid view"
                  >
                    <Icon name="icon-view-grid" />
                  </button>
                  <button
                    className={(mode === 'list' ? '-active' : '')}
                    onClick={() => this.setMode('list')}
                    title="List view"
                  >
                    <Icon name="icon-list-mode" />
                  </button>
                </div>
              </div>
            </div>
            <Spinner
              isLoading={!myWidgetsLoaded}
              className="-fixed -light"
            />
            {myWidgets &&
            <WidgetList
              widgets={[]}
              mode={mode}
              onWidgetRemove={this.handleWidgetRemoved}
              showActions
              showRemove
              onWidgetClick={this.handleWidgetClick}
            />
            }
            {myWidgets && myWidgets.length === 0 &&
            <div className="no-widgets-div">
              You currently have no widgets
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

MyRWWidgetsMy.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(MyRWWidgetsMy);
