import React from 'react';
import PropTypes from 'prop-types';

// Components
import PageIndex from 'components/admin/pages/pages/index';
import PageNew from 'components/admin/pages/pages/new';
import PageShow from 'components/admin/pages/pages/show';

export default function PageTab(props) {
  const { tab, subtab, id } = props;

  return (
    <div className="c-pages-tab">
      {!id &&
        <PageIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && id === 'new' &&
        <PageNew tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' &&
        <PageShow tab={tab} subtab={subtab} id={id} />
      }
    </div>
  );
}

PageTab.propTypes = {
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};
