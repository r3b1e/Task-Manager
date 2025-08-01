import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <h1 className="text-sm text-slate-800 font-semibold">{label}</h1>
      <div className="input-box">
        <input
          className="w-full bg-transparent outline-none"
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e)}
        />
      

      {type == "password" && (
        <>
          {showPassword ? (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="text-slate-400 cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Input;
