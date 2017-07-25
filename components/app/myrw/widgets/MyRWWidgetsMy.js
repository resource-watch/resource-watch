import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

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
      mode: 'grid'
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
    this.setState({
      myWidgetsLoaded: false
    });
    this.widgetService.getUserWidgets(this.props.user.id).then((response) => {
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

  render() {
    const { myWidgetsLoaded, myWidgets, mode } = this.state;
    return (
      <div className="c-myrw-widgets-my">
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
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
            <Spinner
              isLoading={!myWidgetsLoaded}
              className="-relative -light"
            />
            {myWidgets &&
            <WidgetList
              widgets={myWidgets}
              mode={mode}
              onWidgetRemove={this.handleWidgetRemoved}
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

export default withRedux(initStore, mapStateToProps, null)(MyRWWidgetsMy);
