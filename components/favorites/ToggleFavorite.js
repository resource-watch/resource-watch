import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { connect } from 'react-redux';

import { toggleFavourite } from 'redactions/user';

// Selectors
import { parseFavourites } from 'selectors/user/favorites';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Components
import Icon from 'components/ui/Icon';
import LoginRequired from 'components/ui/login-required';

class ToggleFavorite extends React.Component {
  toggleFavorite() {
    const {
      toggleFavourite,
      favourites,
      data,
      type,
      user
    } = this.props;

    const favourite = favourites.find(fav => fav.resourceId === data.id) || {};

    if (user.favourites.loading) return;

    toggleFavourite({
      favourite,
      resource: {
        resourceId: data.id,
        resourceType: type
      }
    });
  }

  render() {
    const {
      data, user
    } = this.props;

    const isInACollection = belongsToACollection(user, data);

    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
    });

    const favoriteButtonClass = classnames({
      'c-btn': true,
      'favourite-button': true,
      '-loading': user.favourites.loading === data.id
    });

    return (
      <LoginRequired text="Log in or sign up to save items in favorites">
        <button
          onClick={() => this.toggleFavorite()}
          className={favoriteButtonClass}
          tabIndex={-1}
        >
          <Icon
            name={starIconName}
            className={starIconClass}
          />
        </button>
      </LoginRequired>
    );
  }
}

ToggleFavorite.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object,
  favourites: PropTypes.array,
  type: PropTypes.string,
  toggleFavourite: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  favourites: parseFavourites(state)
});

const mapDispatchToProps = dispatch => ({
  toggleFavourite: fav => dispatch(toggleFavourite(fav))
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavorite);
