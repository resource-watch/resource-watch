import React from 'react';
import PropTypes from 'prop-types';
import WidgetTable from 'components/admin/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';

export default function WidgetIndex(props) {
  return (
    <div className="c-widgets-index">
      <ButtonContainer
        className="-j-end"
        buttons={[{
          label: 'New +',
          route: 'admin_data',
          params: { tab: 'widgets', id: 'new' },
          className: ''
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
  dataset: PropTypes.string
};
