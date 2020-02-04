import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';
import classnames from 'classnames';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/icon';

class SearchInput extends PureComponent {
  static defaultProps = {
    link: {},
    onlyDesktop: false
  }

  static propTypes = {
    input: PropTypes.object.isRequired,
    link: PropTypes.object,
    getRef: PropTypes.func,
    onKeyDown: PropTypes.func,
    isHeader: PropTypes.bool,
    escapeText: PropTypes.bool,
    onSearch: PropTypes.func.isRequired,
    onlyDesktop: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = { value: props.input.value || props.input.defaultValue || undefined };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { input } = nextProps;

    if (input.value) {
      this.setState({ value: input.value });
    }
  }

  onSearch = (e) => {
    this.setState({ value: e.currentTarget.value || '' }, () => {
      const { value } = this.state;
      if (this.props.escapeText) this.props.onSearch(escapeRegExp(value));
      if (!this.props.escapeText) this.props.onSearch(value);
    });
  }

  onKeyDown(c) {
    const { onKeyDown } = this.props;
    if (onKeyDown && typeof onKeyDown === 'function') {
      return onKeyDown(c);
    }
    return null;
  }

  getInputRef(c) {
    const { getRef } = this.props;
    if (getRef && typeof getRef === 'function') {
      return getRef(c);
    }
    return null;
  }


  render() {
    const { value } = this.state;
    const { link, input, isHeader } = this.props;
    const { onlyDesktop } = link;

    const classNames = classnames({ 'c-search-input--header': isHeader });

    const inputClassNames = classnames({ 'c-search-input--header': isHeader });

    const linkClassNames = classnames({
      '-desktopOnly': onlyDesktop,
      'c-button': true,
      '-primary': true
    });

    return (
      <div className={`c-search-input ${classNames}`}>
        <div className="c-field -fluid">
          <div className="field-container">
            <input
              className={`-fluid ${inputClassNames}`}
              ref={c => this.getInputRef(c)}
              onKeyDown={c => this.onKeyDown(c)}
              onChange={this.onSearch}
              placeholder={input.placeholder}
              value={value || ''}
              type="search"
            />
            {!isHeader && <Icon name="icon-search" className="-small" />}
          </div>
        </div>

        {link.route &&
          <Link route={link.route} params={link.params}>
            <a className={linkClassNames}>{link.label}</a>
          </Link>
        }
      </div>
    );
  }
}

export default SearchInput;
