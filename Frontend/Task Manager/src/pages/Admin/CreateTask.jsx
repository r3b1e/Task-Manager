import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuTrash2 } from "react-icons/lu";
import { useLocation } from "react-router-dom";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {};
  const updateTask = async () => {};
  const handleSubmit = async () => {};
  const getTaskDetailsByID = async () => {};
  const deleteTask = async () => {};

  return (
    <DashboardLayout activeMenu="create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button className="flex items-center gap-1.5 text-[13px] font-medium text-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer" onClick={() => setOpenDeleteAlert(true)}>
                  <LuTrash2 className="text-base" />
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600"></label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) => handleValueChange("title", target)}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
