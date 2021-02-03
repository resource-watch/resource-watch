import React from 'react';
import PropTypes from 'prop-types';

export default function DataTable({ title, table, downloadLink }) {
  if (!table || !table.data || table.data.length === 0) {
    return null;
  }

  const { columns, data } = table;

  return (
    <div className="c-dataset-table">
      <section className="c-dataset-table__header">
        <h4>{title}</h4>
      </section>

      <section className="c-dataset-table__container">
        <table className="c-dataset-table__table">
          {columns && columns.length
          && (
          <tbody>
            <tr>
              {columns.map((l, k) => <th key={k}>{l}</th>)}
            </tr>
          </tbody>
          )}
          <tbody>
            {data.map((row, k) => (
              <tr key={k}>
                {row.map((col, i) => <td key={k + i}>{col}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        {downloadLink
          && (
          <a
            className="c-dataset-table__cta c-btn -b"
            href={downloadLink}
          >
            Download full list
          </a>
          )}

      </section>
    </div>
  );
}

DataTable.propTypes = {
  title: PropTypes.string,
  table: PropTypes.object,
  className: PropTypes.string,
};
