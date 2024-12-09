import React, { useState } from "react";
import forgot from "../../assets/forgot.svg";
import logo from "../../assets/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import apiHelper from "../../Common/ApiHelper";
import Path from "../../Common/Path";

const ResetPassword = () => {
  const [password, setPassword] = useState({
    newPassword: ''
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateForm = () => {
    const newErrors = {};
    if (!password.newPassword) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (password.newPassword && confirmPassword && password.newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...password, email: localStorage.getItem('email') }
    const result = await apiHelper.updatepassword(data)
    if (result) {
      navigate(Path.LoginScreen)
      setPassword({
        newPassword: ""
      })
    }
    if (validateForm()) {
      alert("Password reset successful!");
    }
  };

  return (
    <>
      <div className="main flex justify-center items-center w-full h-screen">
        <div className="grid grid-cols-12 w-full h-screen">
          <div className="col-span-6 bg-[#F6F8FB] p-4 w-full text-black">
            <div className="flex flex-col gap-8">
              <div className="head-logo p-5">
                <img src={logo} className="w-[200px]" alt="Logo" />
              </div>
              <div className="flex flex-col h-[550px] justify-center items-center gap-10 mt-10">
                <div>
                  <img className="w-[500px]" src={forgot} alt="registration" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 bg-[#FFF] p-4 w-full flex items-center justify-center">
            <div className="flex flex-col gap-4 border border-[#F4F4F4] rounded-2xl drop-shadow-sm p-8 w-[600px] h-auto">
              <h2 className="text-3xl font-semibold">Reset Password</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-6 gap-4 w-full">
                  <div className="col-span-6">
                    <label className="block text-md font-medium text-black mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={password.newPassword}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                        className={`border ${errors.password
                          ? "border-red-500"
                          : "border-[#D3D3D3]"
                          } rounded-lg bg-transparent focus-visible:outline-none focus:border focus:border-[#5678E9] p-2 w-full`}
                      />
                      <span
                        className="absolute top-[35%] right-5 cursor-pointer"
                        onClick={handleTogglePassword}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 w-full">
                  <div className="col-span-6">
                    <label className="block text-md font-medium text-black mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`border ${errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#D3D3D3]"
                          } rounded-lg bg-transparent focus-visible:outline-none focus:border focus:border-[#5678E9] p-2 w-full`}
                      />
                      <span
                        className="absolute top-[35%] right-5 cursor-pointer"
                        onClick={handleToggleConfirmPassword}
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="button-gradient text-white rounded-xl mt-6"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
