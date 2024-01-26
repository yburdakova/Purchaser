import React from 'react'
import {  TableRowProps } from '../../data/types'
import { MdOutlinePriceChange } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye} from 'react-icons/fa6';

const TableRow = ({product}: TableRowProps) => {
  return (
    <tr>
      <td>{product._id}</td>
      <td>{product.title}</td>
      <td>{product.category}</td>
      <td>{product.measure}</td>
      <td>{product.price} ₽</td>
      <td>
        <MdOutlinePriceChange />
        <FaRegEdit />
        <FaRegEye/>
      </td>
    </tr>
  )
}

export default TableRow