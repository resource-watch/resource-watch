import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import InView from 'components/in-view';
import WidgetCard from '../card';

const WidgetCardList = (props) => {
  const {
    widgets,
    showRemove,
    showActions,
    showEmbed,
    showFavorite,
    mode,
    className,
    onWidgetClick,
    onWidgetRemove,
    thumbnail,
    clickable,
  } = props;

  const componentClass = classnames({
    'c-widget-list': true,
    [className]: !!className,
  });

  const columnClassName = classnames({
    column: true,
    'small-12': true,
    'medium-4': mode === 'grid',
  });

  return (
    <div className={componentClass}>
      <ul className="row">
        {widgets.map((widget) => (
          <li
            key={widget.id}
            className={columnClassName}
          >
            <InView
              triggerOnce
              threshold={0.35}
            >
              {({ ref, inView }) => (
                <div
                  ref={ref}
                  className="card-container"
                >
                  {inView && (
                    <WidgetCard
                      widget={widget}
                      onWidgetClick={onWidgetClick}
                      onWidgetRemove={onWidgetRemove}
                      showActions={showActions}
                      showRemove={showRemove}
                      showEmbed={showEmbed}
                      showFavorite={showFavorite}
                      mode={mode}
                      thumbnail={thumbnail}
                      clickable={clickable}
                    />
                  )}
                </div>
              )}
            </InView>
          </li>
        ))}
      </ul>
    </div>
  );
};

WidgetCardList.propTypes = {
  widgets: PropTypes.array.isRequired,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  showEmbed: PropTypes.bool,
  showFavorite: PropTypes.bool,
  thumbnail: PropTypes.bool,
  clickable: PropTypes.bool,
  className: PropTypes.string,
  mode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onWidgetClick: PropTypes.func.isRequired,
  onWidgetRemove: PropTypes.func.isRequired,
};

WidgetCardList.defaultProps = {
  className: null,
  showActions: false,
  showRemove: false,
  showEmbed: false,
  thumbnail: false,
  showFavorite: true,
  clickable: false,
};

export default WidgetCardList;
