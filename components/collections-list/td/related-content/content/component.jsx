import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import Tether from 'react-tether';

// components
import Icon from 'components/ui/icon';
import ForwardLink from 'components/forward-link';

const CollectionsRelatedContent = ({
  value: resources,
  row: collection,
}) => {
  const [tooltipState, setTooltipState] = useState({
    datasetsActive: false,
    widgetsActive: false,
    datasets: resources.filter((resource) => resource.type === 'dataset'),
    widgets: resources.filter((resource) => resource.type === 'widget'),
  });

  const toggleTooltip = useCallback((specificDropdown, to) => {
    setTooltipState((prevTooltipState) => ({
      ...prevTooltipState,
      datasetsActive: false,
      widgetsActive: false,
      [specificDropdown]: to,
    }));
  }, []);

  return (
    <div className="c-related-content">
      <ul>
        <li className={classnames({ '-is-disabled': !tooltipState.datasets.length })}>
          <Tether
            attachment="bottom center"
            constraints={[{
              to: 'window',
            }]}
            targetOffset="-4px 0"
            classes={{
              element: 'c-tooltip',
            }}
            renderTarget={(ref) => (
              <Link
                href={`/myrw/datasets/${collection.id}`}
                passHref
              >
                <ForwardLink
                  ref={ref}
                  onMouseEnter={() => toggleTooltip('datasetsActive', true)}
                  onMouseLeave={() => toggleTooltip('datasetsActive', false)}
                >
                  <Icon
                    name="icon-dataset"
                    style={{
                      width: 15,
                      height: 15,
                    }}
                  />
                  <span>
                    {tooltipState.datasets.length}
                  </span>
                </ForwardLink>
              </Link>
            )}
            renderElement={(ref) => {
              if (!tooltipState.datasetsActive) return null;

              return (
                <span ref={ref}>
                  Datasets
                  &nbsp;
                  {tooltipState.datasets.length}
                </span>
              );
            }}
          />
        </li>

        <li className={classnames({ '-is-disabled': !tooltipState.widgets.length })}>
          <Tether
            attachment="bottom center"
            constraints={[{
              to: 'window',
            }]}
            targetOffset="-4px 0"
            classes={{
              element: 'c-tooltip',
            }}
            renderTarget={(ref) => (
              <Link
                href={`/myrw/widgets/${collection.id}`}
                passHref
              >
                <ForwardLink
                  ref={ref}
                  onMouseEnter={() => toggleTooltip('widgetsActive', true)}
                  onMouseLeave={() => toggleTooltip('widgetsActive', false)}
                >
                  <Icon
                    name="icon-widget"
                    style={{
                      width: 15,
                      height: 15,
                    }}
                  />
                  <span>{tooltipState.widgets.length}</span>
                </ForwardLink>
              </Link>
            )}
            renderElement={(ref) => {
              if (!tooltipState.widgetsActive) return null;

              return (
                <span ref={ref}>
                  Widgets
                  &nbsp;
                  {tooltipState.widgets.length}
                </span>
              );
            }}
          />
        </li>
      </ul>
    </div>
  );
};

CollectionsRelatedContent.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default CollectionsRelatedContent;
