import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Aside from 'components/ui/Aside';

class CollectionListAside extends PureComponent {
  static defaultProps = {
    additionalTabs: [{}]
  };

  static propTypes = {
    collections: PropTypes.array,
    selected: PropTypes.string,
    additionalTabs: PropTypes.array
  }

  render() {
    const { collections, selected, additionalTabs } = this.props;
    const tabs = [...additionalTabs, ...collections];

    return (
      <Aside
        items={tabs}
        selected={selected}
      />
    );
  }
}

export default CollectionListAside;
