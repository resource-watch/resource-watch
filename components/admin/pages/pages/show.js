import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import PageForm from 'components/admin/pages/form/PageForm';

class PageNew extends React.Component {

  render() {
    const { user } = this.props;
    return (
      <div className="c-pages-new">
        <PageForm
          application={[process.env.APPLICATIONS]}
          authorization={user.token}
          onSubmit={() => Router.pushRoute('admin_pages', { tab: 'pages' })}
        />
      </div>
    );
  }
}

PageNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PageNew);
