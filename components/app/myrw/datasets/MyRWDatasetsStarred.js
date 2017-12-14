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
    const { user } = this.props;

    const favourites = user.favourites;
    const datasetIds = favourites.filter(f => f.attributes.resourceType === 'dataset').map(elem => elem.attributes.resourceId);

    DatasetService.getDatasets(datasetIds, this.props.locale, 'widget,layer,vocabulary,metadata')
      .then((resp) => {
        this.setState({
          favourites,
          starredDatasets: resp,
          starredDatasetsLoaded: true
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  @Autobind
  handleFavoriteRemoved() {
    this.setState({
      starredDatasets: this.state.starredDatasets
        .filter(dataset => dataset.id !== favourite.attributes.resourceId)
    });
  }

  render() {
    const { starredDatasets, starredDatasetsLoaded, favourites } = this.state;
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
                favourites={favourites}
                mode="grid"
                onFavoriteRemoved={this.handleFavoriteRemoved}
                showActions={false}
                showFavorite
              />
            }

            {starredDatasetsLoaded === false && starredDatasets && starredDatasets.length === 0 &&
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
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(MyRWDatasetsStarred);
