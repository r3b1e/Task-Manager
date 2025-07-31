import React, { useEffect, useState } from 'react'
import {STATUS_DATA} from "../../utils/data";
import { IoDocumentTextOutline } from "react-icons/io5";
// import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';


const ManageTaskHeader = ({selectHeading, setSelectHeading}) => {
    // console.log(STATUS_DATA)

    const [headingData, setHeadingData] = useState({
        Pending:0,
        InProgress:0,
        Complete: 0,
        All: 0,
    });

    const getDashboardData = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data){
        // setDashboardData(response.data);
        setHeadingData(response.data?.charts?.taskDistribution || null)
        // console.log(dashboardData)
      }
    }catch(error){
      console.error("Error to fetching satistic data", error);
    }
  }

  useEffect(()=>{
    getDashboardData()
  }, []);

  console.log(headingData)

  return (
    <div className='flex items-center justify-between'>
        <h3 className='text-xl font-medium'>My Tasks</h3>
        <div className='flex items-center gap-5'>
            {/* <button className={`px-3 py-1 w-fit text-sm flex items-center gap-2 cursor-pointer hover:text-primary ${selectHeading == 'All' && "text-blue-600 font-medium border-b-3"}`} onClick={() => setSelectHeading("All")}>All
                <div className={`bg-blue-100 text-black w-5 flex items-center justify-center text-xs h-5 rounded-full ${selectHeading == 'All' && " text-white bg-blue-600"}`}>{headingData.All}</div>
            </button> */}
            {Object.keys(headingData).map((val, inx) => (
                <button key={inx} className={`px-3 py-1 w-fit text-sm flex items-center gap-2 cursor-pointer hover:text-primary ${selectHeading == val && "text-blue-600 font-medium border-b-3"}`} onClick={() => setSelectHeading(val)}>
                    {val}
                <div className={`bg-blue-100 text-black w-5 flex items-center justify-center text-xs h-5 rounded-full ${selectHeading == val && " text-white bg-blue-600"}`}>{headingData[val]}</div>
            </button>
            ))}
            <button className='report-btn flex items-center gap-2'><IoDocumentTextOutline /> Download Report</button>
        </div>
    </div>
  )
}

export default ManageTaskHeader