import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, SetSideMenuData] = useState([]);
  const navigate = useNavigate();
  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }
    navigate(route);
  };
  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      SetSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);
  return (
    <div className="w-fit h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky py-5 px-2">
      <div className="w-55 flex flex-col items-center">
        <div>
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 rounded-full h-20 object-cover"
          />
        </div>
        {user?.role === "admin" && <div className="bg-primary px-2 rounded text-white mb-5 mt-1">Admin</div>}
        <h5 className="font-medium text-md">{user?.name || ""}</h5>
        <p className="text-sm text-zinc-600 mb-10">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button key={index}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 font-semibold px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
