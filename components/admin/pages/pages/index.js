import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Next
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

import { setFilters } from 'redactions/admin/pages';

// Components
import PageTable from 'components/admin/pages/table/PagesTable';
import CustomSelect from 'components/ui/CustomSelect';

class PageIndex extends React.Component {
  /**
   * Event handler executed when the user search for a page
   * @param {string} { value } Search keywords
   */
  @Autobind
  onSearch({ value }) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  /**
   * Return the page options for the search input
   * @returns {{ label: string, value: string }}
   */
  getSelectOptions() {
    return this.props.pages.map(page => ({
      label: page.attributes.name,
      value: page.id
    }));
  }

  render() {
    const { user } = this.props;
    return (
      <div className="c-pages-index">
        <div className="actions">
          <CustomSelect
            options={this.getSelectOptions()}
            onKeyPressed={this.onSearch}
            search
            placeholder="Search page"
            hideList
          />
          <Link route="admin_pages_detail" params={{ tab: 'pages', id: 'new' }}>
            <a className="c-button -secondary">New Page</a>
          </Link>
        </div>
        <PageTable
          application={[process.env.APPLICATIONS]}
          authorization={user.token}
        />
      </div>
    );
  }
}

PageIndex.propTypes = {
  user: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  // Redux
  setFilters: PropTypes.func.isRequired
};

PageIndex.defaultProps = {
  pages: []
};

const mapStateToProps = ({ pages, user }) => ({
  pages: pages.pages.list,
  user
});

const mapDispatchToProps = dispatch => ({
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageIndex);
