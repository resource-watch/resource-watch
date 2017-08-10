import React from 'react';

class Button extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.triggerClick = this.triggerClick.bind(this);
    this.triggerMouseOver = this.triggerMouseOver.bind(this);
    this.triggerMouseOut = this.triggerMouseOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      className: nextProps.className
    });
  }

  triggerClick(e) {
    this.props.onClick(e);
  }

  triggerMouseOver(e) {
    this.props.onMouseOver(e);
  }

  triggerMouseOut(e) {
    this.props.onMouseOut(e);
  }


  render() {
    const { children, properties, onClick, onMouseOver, onMouseOut, disabled } = this.props;

    if (disabled) {
      return (
        <button
          {...properties}
          disabled={true}
          className={`c-button ${properties.className || ''}`}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        {...properties}
        className={`c-button ${properties.className || ''}`}
        onClick={(onClick) ? this.triggerClick : null}
        onMouseOver={(onMouseOver) ? this.triggerMouseOver : null}
        onMouseOut={(onMouseOut) ? this.triggerMouseOut : null}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: React.PropTypes.any,
  properties: React.PropTypes.object,

  onClick: React.PropTypes.func,
  onMouseOver: React.PropTypes.func,
  onMouseOut: React.PropTypes.func
};

export default Button;
