import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import WidgetTable from 'components/admin/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';

function WidgetIndex(props) {
  const classes = classnames('c-widgets-index', { '-embed': props.embed });
  return (
    <div className={classes}>
      <ButtonContainer
        className="-j-end button-container"
        buttons={[{
          label: 'New Widget',
          route: 'admin_data_detail',
          params: { tab: 'widgets', id: 'new', dataset: props.dataset },
          className: 'c-button -secondary'
        }]}
      />
      <WidgetTable
        application={[process.env.APPLICATIONS]}
        dataset={props.dataset}
        authorization={props.user.token}
      />
    </div>
  );
}

WidgetIndex.propTypes = {
  dataset: PropTypes.string,
  // Whether the page is embedded somewhere else
  embed: PropTypes.bool,
  // Store
  user: PropTypes.object.isRequired
};

WidgetIndex.defaultProps = {
  embed: false
};

export default WidgetIndex;
