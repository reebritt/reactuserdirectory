import React, { Fragment, useEffect, useState } from "react";
import { useTable, useSortBy, useFilters, UseFiltersOptions } from 'react-table';
import DefaultColumnFilter from './DefaultColumnFilter'
function App() {
  const [randomUserTableData, setRandomUserTableData] = useState({
    loading:true, data:[]
  })
  useEffect(() => {
    fetch("https://randomuser.me/api/?results=20")
      .then((response) => response.json())
      .then((response) => {
        setRandomUserTableData({
          data: response.results,
          loading: false
        })
      })
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'gender',
        accessor: 'gender',
      },
      {
        Header: 'firstName',
        accessor: 'name.first', // accessor is the "key" in the data
      },
      {
        Header: 'lastName',
        accessor: 'name.last',
      },
          ],
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data:randomUserTableData.data, defaultColumn}, useFilters, useSortBy)


  if (randomUserTableData.loading) {
    return (
      <div>loading...</div>
    )
  }


  return (
    <Fragment>
       <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps(column.getSortByToggleProps())}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
                 <div>{column.canFilter ? column.render('Filter') : null}</div>
                 {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
    </Fragment>
  )
}


export default App;
