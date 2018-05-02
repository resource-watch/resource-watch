import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DropdownTreeSelect from 'react-dropdown-tree-select';

class TreeSelector extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    classNames: PropTypes.string,
    onChange: PropTypes.func,
    placeholderText: PropTypes.string,
    showDropdown: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    showDropdown: true,
    onChange: () => { }
  };

  render() {
    const { showDropdown, placeholderText, data, onChange, classNames } = this.props;
    const datasetFilterClass = classnames({
      'c-tree-selector': true,
      classNames: !!classNames
    });

    return (
      <div className={datasetFilterClass}>
        <DropdownTreeSelect
          showDropdown={showDropdown}
          placeholderText={placeholderText}
          data={data}
          onChange={((currentNode, selectedNodes) => { onChange(currentNode, selectedNodes); })}
        />
      </div>
    );
  }
}

export default TreeSelector;
