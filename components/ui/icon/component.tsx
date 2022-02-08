import type { CSSProperties } from 'react';
import classnames from 'classnames';

export interface IconProps {
  name: string;
  className?: string;
  style?: CSSProperties;
}

const Icon = ({ name, className = null, style = {}, ...restProps }: IconProps): JSX.Element => (
  <svg
    className={classnames('inline-block w-5 h-5 align-baseline c-icon shrink-0', {
      [className]: !!className,
    })}
    style={style}
    {...restProps}
  >
    <use xlinkHref={`#${name}`} />
  </svg>
);

export default Icon;
