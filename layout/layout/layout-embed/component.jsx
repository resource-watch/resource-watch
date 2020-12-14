import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Icons,
} from 'vizzuality-components';

// components
import HeadApp from 'layout/head/app';
import IconsRW from 'components/icons';

const LayoutEmbed = ({
  title,
  description,
  className,
  thumbnailUrl,
  children,
}) => (
  <div className={classnames(
    'l-page',
    {
      [className]: !!className,
    },
  )}
  >
    <HeadApp
      title={title}
      description={description}
      thumbnail={thumbnailUrl}
    />
    <Icons />
    <IconsRW />
    {children}
  </div>
);

LayoutEmbed.defaultProps = {
  thumbnailUrl: null,
  className: null,
};

LayoutEmbed.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LayoutEmbed;
