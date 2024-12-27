"use client"; // ระบุว่าไฟล์นี้เป็น Client Component

import React, { useState } from 'react';
import { useTable, useSortBy } from '@tanstack/react-table';

const Table = ({ columns, data }) => {
  const [filterInput, setFilterInput] = useState('');
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterInput.toLowerCase())
    )
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredData }, useSortBy);

  const handleFilterChange = (e) => {
    const value = e.target.value || '';
    setFilterInput(value);
  };

  return (
    <div>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search..."
        style={{
          marginBottom: '10px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
        }}
      />
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f4f4f4',
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: '10px', border: '1px solid #ccc' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
