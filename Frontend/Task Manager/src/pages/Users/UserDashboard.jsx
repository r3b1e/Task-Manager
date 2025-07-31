import React, { useEffect, useState } from "react";
import { UseUserAuth } from "../../hooks/UseUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/layouts/TaskListTable";
const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];
import CostomPieChart from '../../components/charts/CostomPieChart'
import CustomBarChart from "../../components/charts/CustomBarChart";

export const UserDashboard = () => {
  UseUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);


  const prepareChartData = (data) => {
    console.log(data)
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      {status: 'Pending', count: taskDistribution?.Pending || 0},
      {status: 'In Progress', count: taskDistribution?.InProgress || 0},
      {status: 'Completed', count: taskDistribution?.Completed || 0},
    ];
     setPieChartData(taskDistributionData);

  const PriorityLevelData = [
      {status: 'Low', count: taskPriorityLevels?.Low || 0},
      {status: 'Medium', count: taskPriorityLevels?.Medium || 0},
      {status: 'High', count: taskPriorityLevels?.High || 0},
  ];
  setBarChartData(PriorityLevelData);

  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboard(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error to fetching user", error);
    }
  };
  console.log(dashboard)

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);
  return (
    <div>
      <DashboardLayout activeMenu="Dashboard">
        <div className="card my-5">
          <div>
            <h2 className="text-xl md:text-2xl ">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            // icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboard?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            // icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboard?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            // icon={<IoMdCard />}
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboard?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            // icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboard?.charts?.taskDistribution?.Complete || 0
            )}
            color="bg-lime-500"
          />
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4  md:my-5">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Task Distribution</h5>
              </div>
              <CostomPieChart
              data={pieChartData}
              lable='Total Balance'
              colors={COLORS} />
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Task Priority Levels</h5>
              </div>
              <CustomBarChart
              data={pieChartData}
              lable='Total Balance'
              colors={COLORS} />
            </div>
          </div>
          <div>
            <div>
              <div className="flex  justify-between">
                <h5 className="text-md ">Recent Tasks</h5>
                <button onClick={onSeeMore} className="flex items-center justify-center gap-5 text-sm card-btn">See All<LuArrowRight /></button>
              </div>
              <TaskListTable tableData={dashboard?.recentTasks || []} />
            </div>
          </div>
        </div>
        
        
      </DashboardLayout>
    </div>
  );
};

export default UserDashboard;
