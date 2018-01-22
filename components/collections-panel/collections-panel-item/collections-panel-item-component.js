import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Spinner from 'components/ui/Spinner';

// styles
import styles from '../collections-panel-styles.scss';

class CollectionPanelItem extends PureComponent {
  onCheck = (evt) => {
    const isChecked = evt.currentTarget.checked;
    const { onToggleCollection, collection } = this.props;
    onToggleCollection(isChecked, collection);
  }

  render() {
    const { collection, isChecked, loading } = this.props;
    const { name } = collection;

    const collectionItemClass = classnames({
      'collection-item': true,
      '-selected': isChecked
    });

    return (
      <li className={collectionItemClass}>
        <style jsx>
          {styles}
        </style>
        {loading && <Spinner
          isLoading={loading}
          className="-transparent -tiny -yellow-icon"
          style={{
            left: 'auto',
            right: 5
          }}
        />}
        <span className="fake-checkbox" />
        <input
          type="checkbox"
          name={name}
          onChange={this.onCheck}
          defaultChecked={isChecked}
        />
        <span className="collection-name">{name}</span>
      </li>
    );
  }
}

CollectionPanelItem.defaultProps = {
  collection: {},
  isChecked: false,
  onToggleCollection: () => {}
};

CollectionPanelItem.propTypes = {
  collection: PropTypes.object,
  isChecked: PropTypes.bool,
  loading: PropTypes.bool,
  onToggleCollection: PropTypes.func
};

export default CollectionPanelItem;
