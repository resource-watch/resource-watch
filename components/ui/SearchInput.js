import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class SearchInput extends PureComponent {
  static defaultProps = {
    link: {}
  }

  static propTypes = {
    input: PropTypes.object.isRequired,
    link: PropTypes.object,
    escapeText: PropTypes.bool,
    onSearch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.input.value || undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    const { input } = nextProps;

    if (input.value) {
      this.setState({ value: input.value });
    }
  }

  onSearch = (e) => {
    this.setState({
      value: e.currentTarget.value || ''
    }, () => {
      const { value } = this.state;
      if (this.props.escapeText) this.props.onSearch(escapeRegExp(value));
      if (!this.props.escapeText) this.props.onSearch(value);
    });
  }

  render() {
    const { value } = this.state;
    const { link, input } = this.props;

    return (
      <div className="c-search-input">
        <div className="c-field -fluid">
          <div className="field-container">
            <input
              className="-fluid"
              onChange={this.onSearch}
              placeholder={input.placeholder}
              value={value || ''}
              type="search"
            />
            <Icon name="icon-search" className="-small" />
          </div>
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
