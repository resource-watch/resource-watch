/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';

class Switch extends React.Component {
  static defaultProps = {
    active: false,
    onChange: () => ({})
  };

  static propTypes = {
    active: PropTypes.bool,
    classNames: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { active: !!props.active };

    // BINDINGS
    this.onToggle = this.onToggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ active: nextProps.active });
  }

  onToggle() {
    this.setState({ active: !this.state.active }, () => {
      if (this.props.onChange) this.props.onChange(this.state.active);
    });
  }

  render() {
    const activeClass = (this.state.active) ? '-active' : null;
    return (
      <div className={`c-switch ${this.props.classNames}`}>
        <span
          className={`switch-element ${activeClass}`}
          onClick={this.onToggle}
        >
          <span />
        </span>
      </div>
    );
  }
}

export default Switch;
