import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'vizzuality-components';
import isNumber from 'lodash/isNumber';
import { format } from 'd3-format';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

export default function NumericCardIndicator({
  theme,
  isSelected,
  data,
  onClickCard,
}) {
  const formatValue = useMemo(() => {
    const {
      value,
      format: _format,
      unit,
    } = data;
    let valueString = '';

    if (!value || !isNumber(value)) {
      valueString = '-';

      return valueString;
    }

    valueString = _format ? format(_format)(value) : value;

    if (unit) valueString += unit;

    return valueString;
  }, [data]);

  return (
    <button
      type="button"
      className={classnames({
        'c-numeric-card-indicator': true,
        [`-${theme}`]: !!theme,
        '-active': isSelected,
      })}
      onClick={() => {
        if (onClickCard) onClickCard(data.id);
      }}
    >
      <div className="info-container">
        {data?.description && (
          <Tooltip
            overlay={(
              <div
                style={{
                  maxWidth: 280,
                }}
              >
                {data.description}
              </div>
            )}
            overlayClassName="c-rc-tooltip -default"
            placement="top"
            trigger={['click']}
            mouseLeaveDelay={0}
            destroyTooltipOnHide
          >
            <Icon name="icon-info" role="button" />
          </Tooltip>
        )}
        {!data?.description && (
          <Icon
            name="icon-info"
            role="button"
            style={{
              visibility: 'hidden',
            }}
          />
        )}
      </div>
      <div className="content-container">
        <h5 className="name">
          {data.title || '-'}
        </h5>
        <span className="value">
          {formatValue}
        </span>
      </div>
    </button>
  );
}

NumericCardIndicator.defaultProps = {
  isSelected: false,
  onClickCard: null,
  theme: 'primary',
};

NumericCardIndicator.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    description: PropTypes.string.isRequired,
    unit: PropTypes.string,
    format: PropTypes.string,
  }).isRequired,
  theme: PropTypes.string,
  isSelected: PropTypes.bool,
  onClickCard: PropTypes.func,
};
