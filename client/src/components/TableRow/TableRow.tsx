import React from 'react'
import {  TableRowProps } from '../../data/types'
import { MdOutlinePriceChange } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye} from 'react-icons/fa6';

const TableRow = ({rowData}: TableRowProps) => {
  return (
    <tr>
      <td>{rowData.customId}</td>
      <td>{rowData.title}</td>
      <td>{rowData.category}</td>
      <td>{rowData.measure}</td>
      <td>{rowData.price} ₽</td>
      <td>
        <MdOutlinePriceChange />
        <FaRegEdit />
        <FaRegEye/>
      </td>
    </tr>
  )
}

export default TableRow