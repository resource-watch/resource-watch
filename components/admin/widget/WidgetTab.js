import React from 'react';
import PropTypes from 'prop-types';

// Components
import WidgetIndex from 'components/admin/widget/pages/index';
// import WidgetNew from 'components/admin/widget/pages/new';
// import WidgetShow from 'components/admin/widget/pages/show';

export default function WidgetTab(props) {
  const { tab, subtab, id } = props;

  return (
    <div className="c-widgets-tab">
      {!id &&
        <WidgetIndex tab={tab} subtab={subtab} id={id} />
      }

      {/*{id && id === 'new' &&
        <WidgetNew tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' &&
        <WidgetShow tab={tab} subtab={subtab} id={id} />
      }*/}
    </div>
  );
}

WidgetTab.propTypes = {
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};
