import React, { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
//   console.log(isOpen)

  const handleSelect = (option) => {
    onChange(option);
    console.log(option)
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2">
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2">
          {isOpen ? (
            <LuChevronDown className="" />
          ) : (
            <LuChevronUp className="" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
            {options.map((option) => {
                return(
                    <div key={option.value} onClick={()=>handleSelect(option.value)} className="py-3 px-2 text-sm cursor-pointer hover:bg-gray-100">
                        {option.label}
                    </div>
                )
            })}
        </div>
      )}
      
    </div>
  );
};

export default SelectDropdown;
