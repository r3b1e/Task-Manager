import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({attachments, setAttachments}) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim()) {
          setAttachments([...attachments, option.trim()]);
          setOption("");
        }
      };
    
      const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
      };
      return (
        <div>
          {attachments.map((item, index) => (
            <div key={item} className="flex justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 ">
              <p className="text-sm font-semibold text-black flex items-center">
                <span className="text-xs text-gray-400 font-semibold mr-2"><LuPaperclip /></span>
                {item}
              </p>
              <button
                className="cursor-pointer"
                onClick={() => {
                  handleDeleteOption(index);
                }}
              >
                <HiOutlineTrash className="text-lg text-red-500 " />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-5 mt-4">
            <input
              type="text"
              placeholder="📎 Add File Links"
              value={option}
              onChange={({ target }) => setOption(target.value)}
              className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
            />
    
            <button className="card-btn text-nowarp" onClick={handleAddOption}>
                <HiMiniPlus className="text-lg" />Add
            </button>
    
          </div>
        </div>
      );
    };
    
    
export default AddAttachmentsInput