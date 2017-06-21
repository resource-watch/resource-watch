import React from 'react';
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
      data = data.slice().sort((rowA, rowB) => rowA[sort.field].toString().toLowerCase() > rowB[sort.field].toString().toLowerCase() ?
          sort.value :
          (sort.value * -1));
    }

    /* Apply pagination to data */
    data = data.slice(bottom, top);

    return (
      <tbody>
        {data.map((row, index) => {
          const selectedClass = classnames({ '-selected': rowSelection.includes(row.id) });
          return (
            <tr
              className={`${selectedClass}`}
              // onClick={() => this.props.onToggleSelectedRow(row.id)}
              key={index}
            >
              {columns.map((col, i) => {
                const value = row[col.value];
                const td = col.td ?
                  <col.td key={i} value={value} /> :
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
                          <a href={ac.path} >
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
  actions: React.PropTypes.object,
  columns: React.PropTypes.array,
  filteredData: React.PropTypes.array,
  pagination: React.PropTypes.object,
  rowSelection: React.PropTypes.array,
  sort: React.PropTypes.object,
  // FUNCTIONS
  onRowDelete: React.PropTypes.func,
  onToggleSelectedRow: React.PropTypes.func
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
