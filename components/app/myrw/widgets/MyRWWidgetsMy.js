import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';


// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetList from 'components/widgets/WidgetList';
import Icon from 'components/ui/Icon';

class MyRWWidgetsMy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      myWidgetsLoaded: false,
      myWidgets: null,
      mode: 'grid',
      orderDirection: 'asc'
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    if (!this.props.user.id) {
      this.waitForUserToBeLoaded();
    } else {
      this.loadWidgets();
    }
  }

  waitForUserToBeLoaded() {
    setTimeout(() => {
      if (this.props.user.id) {
        this.loadWidgets();
      } else {
        this.waitForUserToBeLoaded();
      }
    }, 1000);
  }

  loadWidgets() {
    const { orderDirection } = this.state;
    this.setState({
      myWidgetsLoaded: false
    });
    this.widgetService.getUserWidgets(this.props.user.id, true, orderDirection)
    .then((response) => {
      this.setState({
        myWidgetsLoaded: true,
        myWidgets: response
      });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  @Autobind
  handleWidgetRemoved() {
    this.loadWidgets(this.props);
  }

  @Autobind
  setMode(value) {
    this.setState({
      mode: value
    });
  }

  @Autobind
  handleOrderChange() {
    const newOrder = this.state.orderDirection === 'asc' ? 'desc' : 'asc';
    this.setState({
      orderDirection: newOrder
    },
    () => this.loadWidgets());
  }

  render() {
    const { myWidgetsLoaded, myWidgets, mode, orderDirection } = this.state;
    return (
      <div className="c-myrw-widgets-my">
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
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
                  <Icon name="icon-view-list" />
                </button>
              </div>
            </div>
            <Spinner
              isLoading={!myWidgetsLoaded}
              className="-fixed -light"
            />
            {myWidgets &&
            <WidgetList
              widgets={myWidgets}
              mode={mode}
              onWidgetRemove={this.handleWidgetRemoved}
              showActions
              showRemove
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
