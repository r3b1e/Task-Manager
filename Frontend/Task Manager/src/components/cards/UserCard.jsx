import React from "react";

const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card p-2">
      <div className="flex h-fit items-center justify-between">
        <img
          className="h-10 w-10 rounded-full border border-zinc-200 object-cover object-top"
          src={userInfo.profileImageUrl}
          alt="Avatar"
        />
        <div>
          <h1 className="text-sm font-medium">{userInfo.name}</h1>
          <p className="text-xs text-zinc-500">{userInfo.email}</p>
        </div>
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="InProgress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completeTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50";
      case "Completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-2 py-0.5 rounded `}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br />
      {label}
    </div>
  );
};
