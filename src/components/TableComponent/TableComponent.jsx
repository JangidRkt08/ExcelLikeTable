import React, { useState } from 'react';
import ExcelLikeTable from './ExcelLikeTable';

export default function ParentComponent() {
  const [tableData, setTableData] = useState([
    ['John', 'Doe', '30', 'john@example.com'],
    ['Jane', 'Smith', '28', 'jane@example.com'],
    ['Michael', 'Johnson', '35', 'This is a very long email address that will demonstrate text wrapping in the cell michael.johnson@verylongdomainname.com'],
    ['Sarah', 'Williams', '42', 'Sarah has a multi-line address to show how it affects row height'],
  ]);

  const headers = ['First Name', 'Last Name', 'Age', 'Email',"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"];

  const inputTypes = {
    'First Name': 'text',
    'Last Name': 'text',
    'Age': 'number',
    'Email': 'email',
  };

  const styles = {
    table: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderCollapse: 'collapse',
    },
    header: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
      border: '1px solid #ddd',
      padding: '8px',
    },
    cell: {
      padding: '8px',
      border: '1px solid #ddd',
    },
    input: {
      fontSize: '14px',
    },
  };

  const handleDataChange = (newData) => {
    setTableData(newData);
  };

  const handleAddRow = () => {
    setTableData([...tableData, Array(headers.length).fill('')]);
  };
console.log(tableData)
  // console.log(tableData)
  return (
    <>
    <ExcelLikeTable
        headers={headers}
        data={tableData}
        onAddRow={handleAddRow}
        onDataChange={handleDataChange}
        styles={styles}
        inputTypes={inputTypes}
        title="dynamic table"
        />
    </>
  )};