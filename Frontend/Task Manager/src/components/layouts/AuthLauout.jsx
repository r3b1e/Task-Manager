import React from 'react';
import UI_IMG from "../../assets/UI_Image.png";

const AuthLauout = ({children}) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[100vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>Task Manager</h2>
            {children}
        </div>

        <div className='hidden md:flex  w-[80vw] h-screen items-center justify-end' >
<img src={UI_IMG} className='h-full hidden md:block' />
        </div>
    </div>
  )
}

export default AuthLauout