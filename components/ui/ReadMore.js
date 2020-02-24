import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';
import ReactMarkdown from 'react-markdown';

class ReadMore extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    limitChar: PropTypes.number,
    markdown: PropTypes.bool
  };

  static defaultProps = {
    text: '',
    limitChar: 1120,
    markdown: false
  };

  state = { visible: false };

  render() {
    const { text, limitChar, markdown } = this.props;
    const { visible } = this.state;

    if (text.length <= limitChar) {
      return (
        <div className="c-read-more">
          { markdown && <ReactMarkdown linkTarget="_blank" source={text} />}
          { !markdown && <p>{text}</p> }
        </div>
      );
    }

    const shortenedText = (visible) ?
      text :
      truncate(text, { length: limitChar, separator: '', omission: '...' });

    return (
      <div className="c-read-more">
        { markdown && <ReactMarkdown linkTarget="_blank" source={shortenedText} />}
        { !markdown && <p>{shortenedText}</p> }

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
