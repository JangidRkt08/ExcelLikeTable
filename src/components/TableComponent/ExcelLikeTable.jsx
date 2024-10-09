import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Button } from '@mui/material';
import CustomTextArea from '../ui/TextArea';
import { MultiSelect } from 'react-multi-select-component';


export default function ExcelLikeTable({
  headers = [],
  data = [],
  onDataChange,
  onAddRow,
  inputTypes = {},
  styles = {},
  title,
  enterKeyDirection = 'down',
  tabKeyDirection = 'right'
}) {
  const [localData, setLocalData] = useState(data.length > 0 ? data : [Array(headers.length).fill('')]);
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 });
  const [column,setSelectedColumn]=useState([]);
  const [visibleHeader,setVisibleHeader]=useState([])
  const [editingCell, setEditingCell] = useState(null);
  const tableRef = useRef(null);
  const cellRefs = useRef({});
  
    const updatedArray = headers?.map((header,index) => ({
      label: header,
      value: header,
      index: index,
    }));
    
 
 
  useEffect(() => {
    setLocalData(data.length > 0 ? data : [Array(headers.length).fill('')]);
  }, [data, headers]);
  useEffect(()=>{
    setSelectedColumn(updatedArray)
    setVisibleHeader(headers)
  },[]);
  useEffect(()=>{
    const newColumn= column?.map((column)=>({header: column.value, index: column.index}))
    setVisibleHeader(newColumn)
  },[column]);

  useEffect(() => {
    Object.values(cellRefs.current).forEach(adjustTextareaHeight);
  }, [localData]);
  function MultiSelectComponent({ label, selectedOptions, setSelectedOptions, options }) {
    return (
      <MultiSelect
        options={options || []}
        value={selectedOptions || []}
        onChange={setSelectedOptions}
        labelledBy="Select"
        overrideStrings={{ selectSomeItems: label }}
        disableSearch={true}
        hasSelectAll={false}
        className="w-8 block"
      />
    );
  }
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...localData];
    newData[rowIndex][colIndex] = value;
    setLocalData(newData);
    onDataChange(newData);


    if (rowIndex === localData.length - 1 && newData[rowIndex].every(cell => cell !== '')) {
      onAddRow();
    }
  };

  const moveFocus = (rowDelta, colDelta) => {
   
    const newRow = Math.max(0, Math.min(localData.length - 1, focusedCell.row + rowDelta));
    const newCol = Math.max(0, Math.min(headers.length - 1, focusedCell.col + colDelta));
    // console.log(newRow,newCol)
    setFocusedCell({ row: newRow, col: newCol });
    setEditingCell(null);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (editingCell) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setEditingCell(null);
        enterKeyDirection==='down'? moveFocus(1,0):enterKeyDirection === 'up'? moveFocus(-1,0):enterKeyDirection === 'left'?moveFocus(0,-1):enterKeyDirection === 'right'?moveFocus(0,1):moveFocus(0,0)
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setEditingCell(null);
        tabKeyDirection==='down'?moveFocus(1,0):tabKeyDirection === 'up'?moveFocus(-1,0):tabKeyDirection === 'left'?moveFocus(0,-1):tabKeyDirection === 'right'?moveFocus(0,1):moveFocus(0,0)
      } else if (e.key === 'Escape') {
        setEditingCell(null);
      }
    } else {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          setEditingCell({ row: focusedCell.row, col: focusedCell.col });
          break;
        case 'Tab':
          e.preventDefault();
          tabKeyDirection==='down'?moveFocus(1,0):tabKeyDirection === 'up'?moveFocus(-1,0):tabKeyDirection === 'left'?moveFocus(0,-1):tabKeyDirection === 'right'?moveFocus(0,1):moveFocus(0,0)
          break;
        case 'ArrowUp':
          console.log("arrow up")
          e.preventDefault();
          moveFocus(-1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(1, 0);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveFocus(0, -1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFocus(0, 1);
          break;
        default:
            break;
      }
    }
  };

  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  const renderCell = (value, rowIndex, colIndex) => {
    // console.log(value, rowIndex, colIndex)
    const inputType = inputTypes[headers[colIndex]] || 'text';
    const isEditing = editingCell && editingCell.row === rowIndex && editingCell.col === colIndex;
    const isFocused = focusedCell.row === rowIndex && focusedCell.col === colIndex;

    if (isEditing) {
      return (
        <CustomTextArea
          value={value}
          onChange={(e) => {
            handleCellChange(rowIndex, colIndex, e.target.value);
            adjustTextareaHeight(e.target);
          }}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          onBlur={() => setEditingCell(null)}
          ref={(el) => {
            cellRefs.current[`${rowIndex}-${colIndex}`] = el;
            if (el) {
              el.focus();
              adjustTextareaHeight(el);
            }
          }}
          style={{
            ...(styles.input || {}),
            width: '100%',
            border: 'none',
            padding: '4px',
            resize: 'none',
            overflow: 'hidden',
            minHeight: '24px',
            outline: 'none',
            backgroundColor: 'transparent',
          }}
          rows={1}
        />
      );
    } else {
      return (
        <div
          onDoubleClick={() => {   
            setFocusedCell({row:rowIndex,col:colIndex})   
            setEditingCell({ row: rowIndex, col: colIndex })
            
          }
        }
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          tabIndex={0}
          ref={(el) => {
            cellRefs.current[`${rowIndex}-${colIndex}`] = el;
          }}
          style={{
            ...(styles.input || {}),
            width: '100%',
            minHeight: '24px',
            padding: '0px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            outline: isFocused ? '2px solid #007bff' : 'none',
            backgroundColor: isFocused ? '#e6f2ff' : 'transparent',
          }}
        >
          {value}
        </div>
      );
    }
  };
  

  
  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', ...(styles.table || {}) }}>
      <div className="d-flex">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <MultiSelectComponent
            options={updatedArray || []}
            label={"Select Column"}
            selectedOptions={column}
            setSelectedOptions={setSelectedColumn}
          />
      </div>
      

      <Table ref={tableRef}>
        
          <TableHead >
            {visibleHeader.map((header, index) => (
              <TableCell key={index} style={{ ...styles.header, border: '1px solid #ddd', padding: '8px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{header.header}</TableCell>
            ))}
          </TableHead>
          
       
        <TableBody>
          {localData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
            {row.map((cell, colIndex) => {
              const header = headers[colIndex];
              const visibleHeaderIndex = visibleHeader.findIndex(item => item.header === header);
              if (visibleHeaderIndex !== -1) {
                return (
                  <TableCell key={colIndex} style={{ ...styles.cell, border: '1px solid #ddd', padding: '0', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {renderCell(cell, rowIndex, colIndex)} 
                  </TableCell>
                );
              }
              return null; 
            })}
            </TableRow>
          ))}
        </TableBody>

      </Table>
      <Button onClick={onAddRow} className="mt-4">Add New Row</Button>
    </div>
  );
}