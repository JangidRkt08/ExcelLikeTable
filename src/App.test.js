import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import ExcelLikeTable from './components/TableComponent/ExcelLikeTable';
import ParentComponent from './components/TableComponent/TableComponent';



// TEST CASE 1: Testing the component with static data 
test('renders table with static data', () => {
  const headers = ['Header 1', 'Header 2'];
  const data = [['Row 1 Col 1', 'Row 1 Col 2']];
  render(<ExcelLikeTable headers={headers} data={data} onDataChange={jest.fn()} onAddRow={jest.fn()} />);
  headers.forEach(header => {
    expect(screen.getByText(header)).toBeInTheDocument();
  });

  data.flat().forEach(cell => {
    expect(screen.getByText(cell)).toBeInTheDocument();
  });
});

//TEST CASE 2: Testing the component with dynamic data
test('renders table with the dynamic data',()=>{
    render(<ParentComponent/>)
    const initialRows= screen.getAllByRole('row')
    expect(initialRows.length).toBe(4);
    console.log(initialRows.length)
    const button =screen.getByText('Add New Row')
    fireEvent.click(button)
    const updatedRows= screen.getAllByRole('row')
    expect(updatedRows.length).toBe(5);
})

//TEST CASE 3: Testing the component when all cells in the last row is filled
test('automatically add new row when the last row is filled',()=>{
  render(<ParentComponent/>)
  const initialRows= screen.getAllByRole('row')
  expect(initialRows.length).toBe(4);
  const lastInputTag =screen.getByDisplayValue('Sarah has a multi-line address to show how it affects row height')
  fireEvent.change(lastInputTag,{target:{value: 'aditya'}})
  const updatedRows=screen.getAllByRole('row')
  expect(updatedRows.length).toBe(5);
})