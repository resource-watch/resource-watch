import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';


class ReadMore extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    limitChar: PropTypes.number
  };

  static defaultProps = {
    text: '',
    limitChar: 1120
  };

  state = {
    visible: false
  };

  render() {
    const { text, limitChar } = this.props;
    const { visible } = this.state;

    if (text.length <= limitChar) {
      return (
        <div className="c-read-more">
          <p>{text}</p>
        </div>
      );
    }

    const shortenedText = (visible) ?
      text :
      truncate(text, { length: limitChar, separator: '', omission: '...' });

    return (
      <div className="c-read-more">
        {shortenedText}

        <button
          className="c-button -clean"
          onClick={() => this.setState({ visible: !visible })}
        >
          {visible ? 'Read less' : 'Read more'}
        </button>
      </div>

    );
  }
}

export default ReadMore;
