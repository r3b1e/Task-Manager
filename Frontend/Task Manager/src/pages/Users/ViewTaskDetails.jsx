import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const ViewTaskDetails = () => {
  const {id} = useParams();
  const [task, setTask] = useState(null);
  // console.log(id);

  const getStatusTagColor = (Status) => {
    switch (Status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border-cyan-500/10";
      case "Completed":
        return "text-indigo-500 bg-indigo-50 border-indigo-500/20";
      default:
        return "text-violet-500 bg-violet-50 border-violet-500/10";
    }
  }
  const getTaskDetailsByID = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data){
        const taskInfo = response.data
        setTask(taskInfo)
      }
    }catch(error){
      console.error("Error while fetcing the task by id", error)
    }
  }
  // console.log(task)

  const updateTodoChecklist = async (index) => {

  }

  const handleLinkClick = (link) => {
    window.open(link, '_blank');
  }

  useEffect(() => {
    if(id){
      getTaskDetailsByID();

    }
    return () => {}
  }, [id])
  return (
    <DashboardLayout activeMenu="My Task">
    <div className='mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-4'>
        <div className='form-card col-span-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl md:text-xl font-medium'>{task?.title}</h2>
            <div className={`taxt-[13px] font-medium ${getStatusTagColor(task?.status)}`}>{task?.status}</div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails