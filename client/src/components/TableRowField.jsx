import React from 'react'
import {Table} from "flowbite-react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateUserByAdminSuccess } from '../store/AdminRoleSlice'
const TableRowField = ({user,userDelete}) => {
const dispatch=useDispatch()
const navigate=useNavigate()
const handleDelete=async()=>{
  userDelete(user._id)
}
const handleEditClick=()=>{
  dispatch(updateUserByAdminSuccess(user))
  navigate(`/updateuser/${user._id}`)
}
  return (
    <Table.Row className="bg-white dark:border-gray-700 items-center dark:bg-gray-800">
        <Table.Cell className='font-serif font-semibold'>{user.firstName}{" "}{user.lastName}</Table.Cell>
        <Table.Cell className='font-serif'>{user.email}</Table.Cell>
        <Table.Cell className='font-serif'>{user.isAdmin?"Admin":"User"}</Table.Cell>
        <Table.Cell className='font-serif text-green-600 cursor-pointer' onClick={handleEditClick}>Edit</Table.Cell>
        <Table.Cell className='font-serif text-red-600 cursor-pointer' onClick={handleDelete}>Delete</Table.Cell>
        <Table.Cell><img src={user.avatar} className='flex items-center justify-center overflow-hidden h-16 w-16 rounded-full '/></Table.Cell>
    </Table.Row>
  )
}

export default TableRowField
