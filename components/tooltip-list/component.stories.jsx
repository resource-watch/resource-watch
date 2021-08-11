import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'vizzuality-components';

// components
import TooltipList from './component';

export default {
  title: 'Components/Tooltip-List',
  component: TooltipList,
  argTypes: {},
};

const Template = (args) => {
  const {
    placeholder,
    list,
  } = args;

  const handleClickItem = useCallback((item) => {
    // eslint-disable-next-line no-console
    console.log(item);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Tooltip
        overlay={(
          <TooltipList
            list={list}
            placeholder={placeholder}
            onClickItem={handleClickItem}
          />
        )}
        overlayClassName="c-rc-tooltip -default"
        placement="top"
        trigger="click"
        visible
        onVisibleChange={() => {}}
        destroyTooltipOnHide
      >
        <button
          type="button"
          className="c-btn -secondary"
          onClick={() => {}}
        >
          Select a country
        </button>
      </Tooltip>
    </div>
  );
};

Template.propTypes = {
  args: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
};

export const Default = Template.bind({});

Default.args = {
  list: [
    {
      label: 'Brazil',
      value: 'BRA',
    },
    {
      label: 'Italy',
      value: 'ITA',
    },
    {
      label: 'Spain',
      value: 'ESP',
    },
  ],
  placeholder: 'Type something',
};
