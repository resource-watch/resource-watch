import React from 'react';
import PropTypes from 'prop-types';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class SearchInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.input.value || undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    const { input } = nextProps;
    const { value } = this.state;
    if (input && input.value && input.value !== value) {
      this.setState({
        value: input.value
      });
    }
  }

  onSearch = (e) => {
    this.setState({
      value: e.currentTarget.value || ''
    }, () => {
      if (this.props.onSearch) this.props.onSearch(this.state.value);
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
            <a className="c-button -secondary">{link.label}</a>
          </Link>
        }
      </div>
    );
  }
}

SearchInput.propTypes = {
  input: PropTypes.object.isRequired,
  link: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired
};

SearchInput.defaultProps = {
  input: {},
  link: {}
};

export default SearchInput;
