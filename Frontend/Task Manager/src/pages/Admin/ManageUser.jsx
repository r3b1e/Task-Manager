import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { IoDocumentTextOutline, IoHandLeft } from 'react-icons/io5'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useEffect } from 'react';
import UserCard from '../../components/cards/UserCard';

const ManageUser = () => {

  const [allUsers, setAllUsers] = useState([]);
  const getAllUsers = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if(response.data?.length > 0){
        setAllUsers(response.data)
      }
    }catch(error){
      console.log("Error while fetching the user data", error);
    }
  }
  console.log(allUsers);
  useEffect(()=>{
    getAllUsers();
    return () => {}
  }, []);

  const handleDownload = () => {
    
  }

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className='mt-5 py-5'>
      <div className='flex justify-between'>
      <h3 className='text-xl font-medium'>Team Members</h3>
      <button onClick={handleDownload} className='report-btn flex items-center gap-2'><IoDocumentTextOutline /> Download Report</button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        {allUsers.map((user) => (
          <UserCard key={user._id} userInfo={user} />
        ))}
      </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageUser