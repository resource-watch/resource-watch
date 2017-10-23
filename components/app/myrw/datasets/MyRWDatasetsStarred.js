import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/app/explore/DatasetList';

class MyRWDatasetsStarred extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      favorites: [],
      starredDatasets: [],
      starredDatasetsLoaded: null
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    this.loadDatasets();
  }

  loadDatasets() {
    this.setState({
      starredDatasets: false
    });
    this.userService.getFavouriteDatasets(this.props.user.token)
      .then((response) => {
        const favorites = response;
        const datasetIds = favorites.map(elem => elem.attributes.resourceId);
        DatasetService.getDatasets(datasetIds, 'widget,layer,vocabulary,metadata')
          .then((resp) => {
            this.setState({
              favorites,
              starredDatasets: resp,
              starredDatasetsLoaded: true
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }).catch((err) => {
        console.error(err);
        toastr.error('Error', err);
      });
  }

  @Autobind
  handleFavoriteRemoved(favorite) {
    this.setState({
      starredDatasets: this.state.starredDatasets
        .filter(dataset => dataset.id !== favorite.attributes.resourceId)
    });
  }

  render() {
    const { starredDatasets, starredDatasetsLoaded, favorites } = this.state;
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
                favorites={favorites}
                mode="grid"
                onFavoriteRemoved={this.handleFavoriteRemoved}
                showActions={false}
                showFavorite
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
