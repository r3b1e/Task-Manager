import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import ManageTaskHeader from '../../components/layouts/ManageTaskHeader'
import { UseUserAuth } from '../../hooks/UseUserAuth';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import AvatarGroup from '../../components/layouts/AvatarGroup';
import { useNavigate } from 'react-router-dom';

const MyTasks = () => {
  const [selectHeading, setSelectHeading] = useState("All");
  // const [dashboardData, setDashboardData] = useState([]);
  

  const [taskData, setTaskData] = useState([]);
  // const [filterStatus, setFilterStatus] = useState("All");
  
  const navigate = useNavigate();
  const getAllTaskData =async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
                status: selectHeading === 'All' ? "" : selectHeading,
              }
        }
      )
      
      if(response.data){
      setTaskData(response.data?.tasks)
      }
    }catch(error){
      console.error("Error to fetching all task", error)
    }
  }

  useEffect(() => {
    getAllTaskData()
  }, [])
  console.log(taskData)

  const handleClick = (taskId) => {
    navigate(`/user/task-details/:${taskId}`)
  }

  const handleDownloadReport = async ()=> {

  }




  function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Mar"
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';

  return `${day}${suffix} ${month} ${year}`;
}

  const getStatusBudgetColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-lime-100 text-lime-500 border border-lime-200";
      case "Pending":
        return "bg-purple-100 text-purple-500 border border-purple-200";
      case "In Progress":
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-500 border border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-500 border border-orange-200";
      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };


  return (
    <DashboardLayout activeMenu="My Task">
      <div className='mt-5 py-5 '>
      <ManageTaskHeader selectHeading={selectHeading} setSelectHeading={setSelectHeading}  />
      <div className='my-10 flex gap-5 flex-wrap'>
        {taskData.map((task) => ((task.status.replace(/\s+/g, '') == selectHeading || selectHeading === 'All') && 
          <div onClick={()=>handleClick(task._id)} key={task._id} className='bg-white border border-zinc-100 w-100 h-fit rounded-xl cursor-pointer'>
        
          <div className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded inline-block ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority} Priority
                  </span>
                  <span
                    className={`mx-3 font-medium px-2 py-1 text-xs rounded inline-block ${getStatusBudgetColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className='w-full h-25 px-4 border-l-3 border-purple-700'>
                    <h1 className='text-zinc-800 font-medium text-md'>{task.title}</h1>
                    <p className='text-xs my-1 text-gray-500 font-medium'>{task.description.slice(0, 80)}...</p>
                    <h2 className=' text-sm font-medium'>Task Done:<span className='font-semibold'> {task.todoChecklist.filter((item) => item.completed).length} / {task.todoChecklist.length}</span></h2>
                    <div className='bg-zinc-200 rounded-full my-1 h-1.5 w-full relative'>
                      <div className={`h-full bg-indigo-600 rounded-full`} style={{ width: `${task.progress+1}%` }}></div>
                    </div>
                </div>
                <div className='flex justify-between px-4'>
                  <div>
                    <h4 className='text-xs my-1 text-gray-500 font-medium'>Start Data</h4>
                    <h1 className='text-zinc-800 font-medium text-md'>{formatDate(task?.createdAt)}</h1>
                  </div>
                  <div>
                    <h4 className='text-xs my-1 text-gray-500 font-medium'>Due Data</h4>
                    <h3 className='text-zinc-800 font-medium text-md'>{formatDate(task?.dueDate)}</h3>
                  </div>
                </div>
                <AvatarGroup avatars={task.assignedTo?.map((item) => item.profileImageUrl)} maxVisible={3} />
      </div>
        ))}
      
      
      </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTasks