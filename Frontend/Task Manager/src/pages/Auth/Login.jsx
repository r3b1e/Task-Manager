import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLauout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data)

        if (role === "admin") {
          navigate("/admin/dashboard");
        }
        else {
          navigate("/user/dashboard");
        }
      }
    }catch(error){
        if(error.response && error.response.data.message) {
          setError(error.response.data.message);
        }else{
          setError("Something went wrong. Please try again.")
        }

    }
    
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Plese enter your details to log in
        </p>

        <form onSubmit={(e) => handleLogin(e)}>
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

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            className="w-full text-sm px-5 py-2 border-1 border-slate-700 cursor-pointer text-white rounded-md bg-primary"
            type="submit"
          >
            LOGIN
          </button>
          <p>
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SingUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
