import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { getFaqs, setFilters } from 'redactions/admin/faqs';

// Selectors
import getFilteredFaqs from 'selectors/admin/faqs';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import QuestionTD from './td/QuestionTD';

class FaqsTable extends React.Component {
  constructor(props) {
    super(props);

    // ------------------ Bindings ------------------------
    this.onSearch = this.onSearch.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.props.setFilters([]);
    this.props.getFaqs();
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'question', value }, { key: 'answer', value }]);
    }
  }

  /**
   * HELPERS
   * - getFaqs
   * - getFilteredFaqs
  */
  getFaqs() {
    return this.props.faqs;
  }

  getFilteredFaqs() {
    return this.props.filteredFaqs;
  }

  render() {
    return (
      <div className="c-faqs-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search faq'
          }}
          link={{
            label: 'New faq',
            route: 'admin_faqs_detail',
            params: { tab: 'faqs', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Question', value: 'question', td: QuestionTD },
              { label: 'Answer', value: 'answer' }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_faqs_detail', params: { tab: 'faqs', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_faqs_detail', params: { tab: 'faqs', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
            }}
            filters={false}
            data={this.getFilteredFaqs()}
            pageSize={20}
            onRowDelete={() => this.props.getFaqs()}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

FaqsTable.defaultProps = {
  columns: [],
  actions: {},
  // Store
  faqs: [],
  filteredFaqs: []
};

FaqsTable.propTypes = {
  authorization: PropTypes.string,
  // Store
  loading: PropTypes.bool.isRequired,
  faqs: PropTypes.array.isRequired,
  filteredFaqs: PropTypes.array.isRequired,
  error: PropTypes.string,

  // Actions
  getFaqs: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.faqs.loading,
  faqs: state.faqs.list,
  filteredFaqs: getFilteredFaqs(state),
  error: state.faqs.error
});
const mapDispatchToProps = dispatch => ({
  getFaqs: () => dispatch(getFaqs()),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(FaqsTable);
