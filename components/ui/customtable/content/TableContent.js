import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export default class TableContent extends React.Component {

  getPageBounds() {
    const { pagination } = this.props;

    return {
      bottom: pagination.page * pagination.pageSize,
      top: (pagination.page * pagination.pageSize) + pagination.pageSize
    };
  }

  render() {
    const { actions, columns, sort, rowSelection } = this.props;
    const { bottom, top } = this.getPageBounds();
    const actionsShowed = actions.list.filter(ac => ac.show || ac.component);

    let data = this.props.filteredData;

    if (!data.length) {
      const length = (actions.show) ? columns.length + 1 : columns.length;

      return (
        <tbody>
          <tr>
            <td colSpan={length}>No results found</td>
          </tr>
        </tbody>
      );
    }

    /* Apply sorting to data */
    if (!isEmpty(sort)) {
      data = data.slice().sort((rowA, rowB) => {
        const rowAField = rowA[sort.field];
        const rowBField = rowB[sort.field];

        const rowACondition = (rowAField && rowAField.toString) ?
          rowAField.toString().toLowerCase().trim() :
          rowAField;
        const rowBCondition = (rowBField && rowBField.toString) ?
          rowBField.toString().toLowerCase().trim() :
          rowBField;

        return (rowACondition > rowBCondition) ?
            sort.value :
            sort.value * -1;
      });
    }

    /* Apply pagination to data */
    data = data.slice(bottom, top);

    return (
      <tbody>
        {data.map((row) => {
          const selectedClass = classnames({ '-selected': rowSelection.includes(row.id) });
          return (
            <tr
              className={`${selectedClass}`}
              // onClick={() => this.props.onToggleSelectedRow(row.id)}
              key={row.id}
            >
              {columns.map((col, i) => {
                const value = row[col.value];
                const td = col.td ?
                  <col.td {...col.tdProps} key={i} row={row} value={value} /> :
                  <td key={i} className={col.className || ''}>{(value && value.toString) ? value.toString() : value}</td>;
                return td;
              }
              )}
              {actions.show &&
                <td className="individual-actions">
                  <ul>
                    {actionsShowed.map((ac, j) => {
                      if (ac.component) {
                        return (
                          <li key={j}>
                            <ac.component
                              {...ac.componentProps}
                              action={ac}
                              data={row}
                              onRowDelete={this.props.onRowDelete}
                              onToggleSelectedRow={this.props.onToggleSelectedRow}
                            />
                          </li>
                        );
                      }
                      return (
                        <li key={j}>
                          <a href={ac.path} className="c-btn">
                            {ac.name}
                          </a>
                        </li>
                      );
                    })
                    }
                  </ul>
                </td>
              }
            </tr>
          );
        })}
      </tbody>
    );
  }
}

TableContent.propTypes = {
  actions: PropTypes.object,
  columns: PropTypes.array,
  filteredData: PropTypes.array,
  pagination: PropTypes.object,
  rowSelection: PropTypes.array,
  sort: PropTypes.object,
  // FUNCTIONS
  onRowDelete: PropTypes.func,
  onToggleSelectedRow: PropTypes.func
};

TableContent.defaultProps = {
  actions: {},
  columns: [],
  filteredData: [],
  pagination: {},
  rowSelection: [],
  sort: {},
  // FUNCTIONS
  onRowDelete: null,
  onToggleSelectedRow: null
};
