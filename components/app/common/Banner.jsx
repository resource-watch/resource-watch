import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Banner({
  styles,
  useBackground,
  className,
  bgImage,
  useDim,
  children,
}) {
  return (
    <section
      className={classNames({
        'c-banner': true,
        '-use-background': useBackground,
        '-use-dim': useDim,
        [className]: className,
      })}
      style={{
        ...styles,
        ...bgImage && {
          backgroundImage: `url(${bgImage})`,
        },
      }}
    >
      {useDim ? (
        <div
          style={{
            zIndex: 2,
          }}
        >
          {children}
        </div>
      ) : children}
    </section>
  );
}

Banner.defaultProps = {
  styles: {},
  bgImage: null,
  className: null,
  useDim: false,
  useBackground: true,
};

Banner.propTypes = {
  bgImage: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.element,
    ),
    PropTypes.element,
  ]).isRequired,
  className: PropTypes.string,
  styles: PropTypes.shape({}),
  useDim: PropTypes.bool,
  useBackground: PropTypes.bool,
};
