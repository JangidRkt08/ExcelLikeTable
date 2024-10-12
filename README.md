
# Excel-Like Table Component

This project is a React component designed to mimic the functionality of an Excel-like table. It includes dynamic headers, row addition, data handling, and input focus management, with ongoing improvements to enhance user experience and flexibility. Contributions are welcome to resolve existing issues and add new features!




## Table of Contents

 - [Installation]()
 - [Usage]()
 - [Features]()
- [Contributing]()
- [Issue Tracking]()



## Installation

To get started with this project, clone the repository and install the required dependencies.

```bash
  git clone https://github.com/adityatyagi-av/ExcelLikeTable
  cd ExcelLikeTable
  npm i
```

## Usage/Examples
I have shown the usage in TableComponent.jsx
```javascript
import React, { useState } from 'react';
import ExcelLikeTable from './ExcelLikeTable';

export default function ParentComponent() {
  const [tableData, setTableData] = useState([
    ['John', 'Doe', '30', 'john@example.com'],
    ['Jane', 'Smith', '28', 'jane@example.com'],
    ['Michael', 'Johnson', '35', 'This is a very long email address that will demonstrate text wrapping in the cell michael.johnson@verylongdomainname.com'],
    ['Sarah', 'Williams', '42', 'Sarah has a multi-line address to show how it affects row height'],
  ]);

  const headers = ['First Name', 'Last Name', 'Age', 'Email'];
  const columnWidth=['100','200','150','800']
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

  return (
    <div onKeyDown={(e) => {
      console.log(e.key)      
    }}>
    <ExcelLikeTable
        headers={headers}
        data={tableData}
        onAddRow={handleAddRow}
        onDataChange={handleDataChange}
        styles={styles}
        inputTypes={inputTypes}
        title="dynamic table"
        columnWidth={columnWidth}
        />
    </div>
  )};
```


## Features

- Dynamic headers
- Row addition and removal
- Input focus management
- Expandable rows based on condition
- Keyboard navigation and Enter key functionality


## Contributing

Contributions are always welcome!

Please follow the steps below to contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
```bash
  git checkout -b feature-name
```
3. Commit your changes
```bash
  git commit -m "Describe your changes"
```
4. Push to your branch
```bash
  git push origin feature-name
```
5. Open a Pull Request describing your changes.

## Guidelines

- Ensure your code follows the project’s code style.
- Write clear commit messages and comments.
- Test your changes thoroughly before submitting.
- For large features, please open an issue first to discuss your idea with the maintainers.


## Issue Tracking

We track bugs and feature requests under the Issues section on GitHub. Before starting work on an issue, please check if it's already assigned or being worked on by someone else.

If you encounter a new bug or have a feature request, feel free to open a new issue. Make sure to provide detailed information, including steps to reproduce the problem or a description of the feature you have in mind.


