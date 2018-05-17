import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { getFaqs, setFilters, setFaqOrder } from 'redactions/admin/faqs';

// Selectors
import getFilteredFaqs from 'selectors/admin/faqs';

// Components
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import FaqsList from './FaqsList';

class FaqsSortableList extends PureComponent {
  static defaultProps = {
    columns: [],
    actions: {},
    // Store
    faqs: [],
    filteredFaqs: []
  };

  static propTypes = {
    authorization: PropTypes.string,
    // Store
    loading: PropTypes.bool.isRequired,
    faqs: PropTypes.array.isRequired,
    filteredFaqs: PropTypes.array.isRequired,
    error: PropTypes.string,
    filters: PropTypes.array,

    // Actions
    getFaqs: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    setFaqOrder: PropTypes.func
  };

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
  */
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { filteredFaqs, authorization, filters } = this.props;
    if (filters.length > 0) {
      toastr.warning('Warning', 'Please clear your search to order FAQs');
      return;
    }
    const newFaqs = arrayMove(filteredFaqs, oldIndex, newIndex);
    const newFaqsOrder = newFaqs.map(faq => Number(faq.id));

    this.props.setFaqOrder({ ids: newFaqsOrder }, authorization);
  }

  getFaqs() {
    return this.props.faqs;
  }

  getFilteredFaqs() {
    return this.props.filteredFaqs;
  }

  render() {
    const { filteredFaqs } = this.props;

    return (
      <div className="c-faqs-table">
        <Spinner className="-light" isLoading={this.props.loading} />

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
          <FaqsList
            items={filteredFaqs}
            helperClass=""
            axis="y"
            lockAxis="y"
            useDragHandle
            onSortEnd={this.onSortEnd}
            authorization={this.props.authorization}
            getFaqs={this.props.getFaqs}
          />
        )}

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.faqs.loading,
  faqs: state.faqs.list,
  filteredFaqs: getFilteredFaqs(state),
  error: state.faqs.error,
  filters: state.faqs.filters
});
const mapDispatchToProps = dispatch => ({
  getFaqs: () => dispatch(getFaqs()),
  setFilters: filters => dispatch(setFilters(filters)),
  setFaqOrder: (order, token) => dispatch(setFaqOrder(order, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(FaqsSortableList);
