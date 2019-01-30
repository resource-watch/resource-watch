import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

class Head extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
  };

  static defaultProps = {
    title: null,
    description: null
  }

  render() {
    const { title, description } = this.props;

    return (
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </HeadNext>
    );
  }
}

export default Head;
