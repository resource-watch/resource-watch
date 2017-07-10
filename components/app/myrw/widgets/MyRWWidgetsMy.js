import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/app/explore/DatasetList';

class MyRWWidgetsMy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      myWidgetsLoaded: false,
      myWidgets: null
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillReceiveProps(props) {
    if (!this.state.myWidgetsLoaded) {
      this.widgetService.getUserWidgets(props.user.id).then((response) => {
        this.setState({
          myWidgetsLoaded: true,
          myWidgets: response
        });
      }).catch(err => console.log(err));
    }
  }

  render() {
    const { myWidgetsLoaded, myWidgets } = this.state;
    return (
      <div className="my-widgets">
        <div className="row">
          <div className="column small-12">
            <Spinner
              isLoading={!myWidgetsLoaded}
              className="-relative -light"
            />
            {myWidgets &&
            <DatasetList
              active={[]}
              list={myWidgets}
              mode="grid"
              showActions={false}
            />
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
