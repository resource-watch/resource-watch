import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/app/explore/DatasetList';

class MyRWDatasetsStarred extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      starredDatasets: false,
      starredDatasetsLoaded: null
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    this.loadWidgets();
  }

  loadWidgets() {
    this.setState({
      starredDatasets: false
    });
    this.userService.getFavouriteDatasets(this.props.user.token)
      .then((response) => {
        this.setState({
          starredDatasets: response.map((elem) => {
            const favouriteId = elem.id;
            return Object.assign({}, elem.attributes.resource, { favouriteId });
          }),
          starredDatasetsLoaded: true
        });
      }).catch(err => toastr.error('Error', err));
  }

  @Autobind
  handleWidgetRemoved() {
    this.loadWidgets(this.props);
  }

  @Autobind
  handleWidgetUnfavourited() {
    this.loadWidgets(this.props);
  }

  render() {
    const { starredDatasets, starredDatasetsLoaded } = this.state;
    return (
      <div className="c-myrw-datasets-starred">
        <div className="row">
          <div className="column small-12">
            <Spinner
              isLoading={!starredDatasetsLoaded}
              className="-relative -light"
            />
            {starredDatasets &&
              <DatasetList
                list={starredDatasets}
                mode="grid"
                showActions
                onTagSelected={this.handleTagSelected}
              />
            }
            {starredDatasets && starredDatasets.length === 0 &&
            <div className="no-datasets-div">
              You currently have no starred datasets
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

MyRWDatasetsStarred.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(MyRWDatasetsStarred);
