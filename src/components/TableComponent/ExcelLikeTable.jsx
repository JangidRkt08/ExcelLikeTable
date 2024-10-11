import React, { useState, useEffect, useRef, memo } from "react";
import { Button } from "@mui/material";
import CustomTextArea from "../ui/TextArea";
import { MultiSelect } from "react-multi-select-component";

export default function ExcelLikeTable({
  headers = [],
  data = [],
  onDataChange,
  onAddRow,
  inputTypes = {},
  styles = {},
  title,
  columnWidth,
  enterKeyDirection = "down",
  tabKeyDirection = "right",
}) {
  const [localData, setLocalData] = useState(
    data.length > 0 ? data : [Array(headers.length).fill("")]
  );
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 }); //state for focused cell
  // below two states are for the selected and unselected columns
  const [column, setSelectedColumn] = useState([]);
  const [visibleHeader, setVisibleHeader] = useState([]);

  const [editingCell, setEditingCell] = useState(null);
  const tableRef = useRef(null);
  const cellRefs = useRef({});
  const [selectedColumnIndex, setSelectedColumnIndex] = useState();
  const updatedArray = headers?.map((header, index) => ({
    label: header,
    value: header,
    index: index,
  }));
  const [columnWidths, setColumnWidths] = useState(headers.map(() => 150));
  console.log(columnWidths)
  const [rowHeights, setRowHeights] = useState(data.map(() => 50));
  const resizingRow = useRef(null);
  const startY = useRef(null);

  const resizingColumn = useRef(null);
  const startX = useRef(null);
  const resizingSide = useRef(null);


  const handleRowMouseDown = (event, rowIndex,side) => {
    resizingRow.current = rowIndex;
    startY.current = event.clientY;
    document.addEventListener("mousemove", handleRowMouseMove);
    document.addEventListener("mouseup", handleRowMouseUp);
  };

  const handleRowMouseMove = (event) => {
    if (resizingRow.current !== null) {
      const diffY = event.clientY - startY.current;
      startY.current = event.clientY;
      setRowHeights((prevHeights) => {
        const newHeights = [...prevHeights];
        newHeights[resizingRow.current] = Math.max(
          30,
          newHeights[resizingRow.current] + diffY
        );
        return newHeights;
      });
    }
  };

  const handleRowMouseUp = () => {
    document.removeEventListener("mousemove", handleRowMouseMove);
    document.removeEventListener("mouseup", handleRowMouseUp);
    resizingRow.current = null;
  };
  const handleMouseDown = (event, index, side) => {
    resizingColumn.current = index;
    
    startX.current = event.clientX;
    resizingSide.current = side;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  const handleMouseMove = (event) => {
    if (resizingColumn.current !== null) {
      const diffX = event.clientX - startX.current;
      startX.current = event.clientX;

      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];

        if (resizingSide.current === "right") {

          newWidths[resizingColumn.current] = Math.max(
            50,
            newWidths[resizingColumn.current] + diffX
          );
        } else if (resizingSide.current === "left") {
          // Decrease width of current and increase width of the previous column on the left border drag
          if (resizingColumn.current > 0) {
            newWidths[resizingColumn.current] = Math.max(
              50,
              newWidths[resizingColumn.current] - diffX
            );
            newWidths[resizingColumn.current - 1] = Math.max(
              50,
              newWidths[resizingColumn.current - 1] + diffX
            );
          }
        }

        return newWidths;
      });
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    resizingColumn.current = null;
    resizingSide.current = null; // Reset the side
  };

  useEffect(() => {
    setLocalData(data.length > 0 ? data : [Array(headers.length).fill("")]);
  }, [data, headers]);
  useEffect(() => {
    setSelectedColumn(updatedArray);
    setVisibleHeader(headers);
  }, []);
  useEffect(() => {
    const newColumn = column?.map((column) => ({
      header: column.value,
      index: column.index,
    }));
    setVisibleHeader(newColumn);
  }, [column]);

  useEffect(() => {
    Object.values(cellRefs.current).forEach(adjustTextareaHeight);
  }, [localData]);
  function MultiSelectComponent({
    label,
    selectedOptions,
    setSelectedOptions,
    options,
  }) {
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

    if (
      rowIndex === localData.length - 1 &&
      newData[rowIndex].every((cell) => cell !== "")
    ) {
      onAddRow();
    }
  };

  const moveFocus = (rowDelta, colDelta) => {
    const newRow = Math.max(
      0,
      Math.min(localData.length - 1, focusedCell.row + rowDelta)
    );
    const newCol = Math.max(
      0,
      Math.min(headers.length - 1, focusedCell.col + colDelta)
    );
    // console.log(newRow,newCol)
    setFocusedCell({ row: newRow, col: newCol });
    setEditingCell(null);
    const newCellRef = cellRefs.current[`${newRow}-${newCol}`];
    if (newCellRef) {
      newCellRef.focus();
    }
  };

  const handleHeaderClick = (index) => {
    // if (selectedColumnIndex.includes(index)) {
    //     setSelectedColumnIndex(selectedColumnIndex.filter(i => i !== index));
    // } else {
    //     setSelectedColumnIndex([...selectedColumnIndex, index]);
    // }
    setSelectedColumnIndex(index);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    console.log(e.key)
    
    if (editingCell) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setEditingCell(null);
        enterKeyDirection === "down"
          ? moveFocus(1, 0)
          : enterKeyDirection === "up"
          ? moveFocus(-1, 0)
          : enterKeyDirection === "left"
          ? moveFocus(0, -1)
          : enterKeyDirection === "right"
          ? moveFocus(0, 1)
          : moveFocus(0, 0);
      } else if (e.key === "Tab") {
        e.preventDefault();
        setEditingCell(null);
        tabKeyDirection === "down"
          ? moveFocus(1, 0)
          : tabKeyDirection === "up"
          ? moveFocus(-1, 0)
          : tabKeyDirection === "left"
          ? moveFocus(0, -1)
          : tabKeyDirection === "right"
          ? moveFocus(0, 1)
          : moveFocus(0, 0);
      } else if (e.key === "Escape") {
        setEditingCell(null);
      }
    } else {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          setEditingCell({ row: focusedCell.row, col: focusedCell.col });
          break;
        case "Tab":
          e.preventDefault();
          tabKeyDirection === "down"
            ? moveFocus(1, 0)
            : tabKeyDirection === "up"
            ? moveFocus(-1, 0)
            : tabKeyDirection === "left"
            ? moveFocus(0, -1)
            : tabKeyDirection === "right"
            ? moveFocus(0, 1)
            : moveFocus(0, 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveFocus(-1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveFocus(1, 0);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveFocus(0, -1);
          break;
        case "ArrowRight":
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
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };
  const Cell = memo(({ value, rowIndex, colIndex, isEditing, isFocused, isSelected, onCellChange, onDoubleClick, onKeyDown, styles }) => {
    const cellRef = useRef(null);
  
    useEffect(() => {
      if (isEditing && cellRef.current) {
        cellRef.current.focus();
        adjustTextareaHeight(cellRef.current);
      }
    }, [isEditing]);
  
    const adjustTextareaHeight = (element) => {
      if (element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
      }
    };
  
    if (isEditing) {
      return (
        <CustomTextArea
          onChange={(e) => {
            onCellChange(rowIndex, colIndex, e.target.value);
            adjustTextareaHeight(e.target);
          }}
          onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
          ref={cellRef}
          value={value}
          style={{
            ...(styles.input || {}),
            width: "100%",
            border: "none",
            resize: "none",
            overflow: "hidden",
            outline: "none",
            backgroundColor: "transparent",
          }}
          rows={1}
        />
      );
    } else {
      return (
        <div
          onDoubleClick={() => onDoubleClick(rowIndex, colIndex)}
          onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
          tabIndex={0}
          ref={cellRef}
          style={{
            ...(styles.input || {}),
            width: "100%",
            padding: "0px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            outline: isFocused ? "2px solid #007bff" : "none",
            backgroundColor: isFocused
              ? "#e6f2ff"
              : isSelected
              ? "#d0e0ff"
              : "transparent",
          }}
        >
          {value}
        </div>
      );
    }
  });
  
  const renderCell = (value, rowIndex, colIndex) => {
    // console.log(value, rowIndex, colIndex)
    const inputType = inputTypes[headers[colIndex]] || "text";
    const isEditing =
      editingCell &&
      editingCell.row === rowIndex &&
      editingCell.col === colIndex;
    // const isFocused =
    //   focusedCell.row === rowIndex && focusedCell.col === colIndex;
    // const isSelected = selectedColumnIndex === colIndex;
    if (isEditing) {
      return (
        <CustomTextArea
       
          onChange={(e) => {
            setSelectedColumnIndex(null)
            handleCellChange(rowIndex, colIndex, e.target.value);
            adjustTextareaHeight(e.target);
          }}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          onBlur={() => setEditingCell(null)}
          
          ref={(el) => {
            cellRefs.current[`${rowIndex}-${colIndex}`] = el;
            
            if (el) {
              
             
              el.value=value
              el.focus();
              adjustTextareaHeight(el);
            }
          }}
          value={value}
          style={{
            ...(styles.input || {}),
            width: "100%",
            border: "none",
        
            resize: "none",
            overflow: "hidden",
            
            outline: "none",
            backgroundColor: "transparent",
          }}
          rows={1}
        />
      );
    } else {
      return (
        <div
          onDoubleClick={() => {
            setSelectedColumnIndex(null)
            setFocusedCell({ row: rowIndex, col: colIndex });
            setEditingCell({ row: rowIndex, col: colIndex });
          }}
          onKeyDown={(e) => {
            console.log("key down")
            handleKeyDown(e, rowIndex, colIndex)
          }}
          tabIndex={0}
          ref={(el) => {
            cellRefs.current[`${rowIndex}-${colIndex}`] = el;
          }}
          style={{
            ...(styles.input || {}),
            width: "100%",
            
            padding: "0px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            // outline: isFocused ? "2px solid #007bff" : "none",
            // backgroundColor: isFocused
            //   ? "#e6f2ff"
            //   : isSelected
            //   ? "#d0e0ff"
            //   : "transparent",
          }}
        >
          {value}
        </div>
      );
    }
  };

  return (
    <div
      style={{ maxWidth: "100%", overflowX: "auto", ...(styles.table || {}) }}
      onKeyDown={(e)=>handleKeyDown(e)}
    >
      <div className="d-flex">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <MultiSelectComponent
          options={updatedArray || []}
          label={"Select Column"}
          selectedOptions={column}
          setSelectedOptions={setSelectedColumn}
        />
      </div>

      <table ref={tableRef} >
        <thead>
          {visibleHeader.map((header, index) => (
            <th
            onClick={() => handleHeaderClick(index)}
              key={index}
              style={{
                ...styles.header,
                border: "1px solid #ddd",
                padding: "8px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                width: `${columnWidths[index]}px`,
                position: "relative", // Make sure this is set for absolute positioning of the border spans
              }}
            >
              {/* Left Border for Resizing */}
              {/* {index > 0 && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "5px",
                    cursor: "ew-resize",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, index, "left")}
                />
              )} */}
              {/* Header Content */}
              <span >
                {header.header}
              </span>

              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  cursor: "ew-resize",
                }}
                onMouseDown={(e) => handleMouseDown(e, index, "right")}
              />
            </th>
          ))}
        </thead>

        <tbody>
          {localData.map((row, rowIndex) => (
           
            

            <tr key={rowIndex} style={{ height: `${rowHeights[rowIndex]}px`, position:"relative" }}>
              
              {row.map((cell, colIndex) => {
                const header = headers[colIndex];
                const visibleHeaderIndex = visibleHeader.findIndex(
                  (item) => item.header === header
                );
                const isFocused =
                focusedCell.row === rowIndex && focusedCell.col === colIndex;
                const isSelected = selectedColumnIndex === colIndex;
                if (visibleHeaderIndex !== -1) {
                  return (
                    <td
                    onClick={()=>{ setFocusedCell({ row: rowIndex, col: colIndex });
                    // setEditingCell(null)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      key={colIndex}
                      style={{
                        ...styles.cell,
                        border: "1px solid #ddd",
                        padding: "0",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        outline: isFocused ? "2px solid #007bff" : "none",
                        backgroundColor: isFocused
                        ? "#e6f2ff"
                        : isSelected
                        ? "#d0e0ff"
                        : "transparent",
                      }}
                    >
                      {renderCell(cell, rowIndex, colIndex)}
                    </td>
                  );
                }
                return null;
              })}

               {/* down side of the row */}
            <span
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "1px", 
      backgroundColor: "#ccc",
      cursor: "ns-resize",
      zIndex: 1,
    }}
    onMouseDown={(e) => handleRowMouseDown(e, rowIndex,"down")}
  />

            </tr>
           
        
          ))}
        </tbody>
      </table>
      <Button onClick={onAddRow} className="mt-4">
        Add New Row
      </Button>
    </div>
  );
}
