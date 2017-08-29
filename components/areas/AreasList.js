import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import AreaCard from 'components/areas/AreaCard';

class AreasList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      areas: []
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadAreas();
  }

  loadAreas() {
    this.setState({ loading: true });
    this.userService.getUserAreas(this.props.user.token)
      .then((data) => {
        this.setState({
          loading: false,
          areas: data
        });
      })
      .catch((err) => {
        toastr.error('Error', err);
        this.setState({ loading: false });
      });
  }

  @Autobind
  handleAreaRemoved() {
    this.loadAreas();
  }

  render() {
    const { loading, areas } = this.state;
    const { user } = this.props;

    return (
      <div className="c-areas-list">
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />
          <div className="actions-div">
            <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
              <a className="c-button -primary">
                New
              </a>
            </Link>
          </div>
          <div className="row">
            {areas && areas.map(val =>
              (
                <div key={val.id} className="column small-12 medium-6">
                  <div
                    className="card-container"
                  >
                    <AreaCard
                      token={user.token}
                      area={val}
                      onAreaRemoved={this.handleAreaRemoved}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

AreasList.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(AreasList);
