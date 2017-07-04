import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import WidgetTable from 'components/admin/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';

export default function WidgetIndex(props) {
  const classes = classnames('c-widgets-index', { '-embed': props.embed });

  return (
    <div className={classes}>
      <ButtonContainer
        className="-j-end"
        buttons={[{
          label: 'New Widget',
          route: 'admin_data_detail',
          params: { tab: 'widgets', id: 'new' },
          className: 'c-button -secondary'
        }]}
      />
      <WidgetTable
        application={['rw']}
        dataset={props.dataset}
        authorization={process.env.TEMP_TOKEN}
      />
    </div>
  );
}

WidgetIndex.propTypes = {
  dataset: PropTypes.string,
  // Whether the page is embedded somewhere else
  embed: PropTypes.bool
};

WidgetIndex.defaultProps = {
  embed: false
};
