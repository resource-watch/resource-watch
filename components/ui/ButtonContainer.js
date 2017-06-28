import React from 'react';
import classnames from 'classnames';

// Next components
import { Link } from 'routes';

class ButtonContainer extends React.Component {
  render() {
    const containerClassName = classnames({ [this.props.className]: !!this.props.className });

    return (
      <div className={`c-button-container ${containerClassName}`}>
        <ul>
          {this.props.buttons.map((button, i) => {
            const buttonClassName = classnames({ [button.className]: !!button.className });
            return (
              <li key={i}>
                <Link route={button.route} params={button.params}>
                  <a className={`c-button ${buttonClassName}`}>
                    {button.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}


ButtonContainer.propTypes = {
  buttons: React.PropTypes.array.isRequired,
  className: React.PropTypes.string
};

export default ButtonContainer;
