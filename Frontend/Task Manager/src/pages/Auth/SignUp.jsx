import React, { useState } from "react";
import AuthLauout from "../../components/layouts/AuthLauout";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

export const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");

  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = ''

    if (!fullName) {
      setError("Please enter a full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    try{

      if(profilePic){
            const imgUploadRes = await uploadImage(profilePic);
            profileImageUrl = imgUploadRes.imageUrl || "";
        }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken: adminToken,
        profileImageUrl,
      });

      const {token, role} = response.data;
      if (token){
        localStorage.setItem("token", token);
        updateUser(response.data); 
      }
      if (role === 'admin'){
        navigate('/admin/dashboard');
      } 
      else{
        navigate('/user/dashboard');
      }
      
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong. Please try again.")
      }
    }


  };

  return (
    <AuthLauout>
      <div className="lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-black">Create an new Account</h3>
        <p className="text-xs text-slate-700 font-middium mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          <Input
            type="text"
            value={fullName}
            label="Enter your Full Name"
            placeholder="jhon"
            onChange={({ target }) => setFullName(target.value)}
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <Input
            value={adminToken}
            onChange={({ target }) => setAdminToken(target.value)}
            label="Admin invite token"
            placeholder="6 Digit code"
            type="text"
          />

          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            className="w-full text-sm px-5 py-2 border-1 border-slate-700 cursor-pointer text-white rounded-md bg-primary"
            type="submit"
          >SIGN UP</button>
          <p>
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLauout>
  );
};

export default SignUp;
