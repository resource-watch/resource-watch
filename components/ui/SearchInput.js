import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class SearchInput extends PureComponent {
  static defaultProps = {
    input: {},
    link: {},
    escapeText: true
  }

  static propTypes = {
    input: PropTypes.object.isRequired,
    link: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    escapeText: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.input.value || undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    const { input } = nextProps;

    this.setState({ value: input.value });
  }

  onSearch = (e) => {
    this.setState({
      value: e.currentTarget.value || ''
    }, () => {
      if (this.props.escapeText) this.props.onSearch(escapeRegExp(this.state.value));
      if (!this.props.escapeText) this.props.onSearch(this.state.value);
    });
  }

  render() {
    const { value } = this.state;
    const { link, input } = this.props;

    return (
      <div className="c-search-input">
        <div className="c-field -fluid">
          <input
            className="-fluid"
            onChange={this.onSearch}
            placeholder={input.placeholder}
            value={value}
            type="search"
          />
          <Icon name="icon-search" className="-small" />
        </div>
        {link.route &&
          <Link route={link.route} params={link.params}>
            <a className="c-button -primary">{link.label}</a>
          </Link>
        }
      </div>
    );
  }
}

export default SearchInput;
