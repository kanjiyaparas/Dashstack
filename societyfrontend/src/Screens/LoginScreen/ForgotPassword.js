import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import forgot from "../../assets/forgot.svg";
import logo from "../../assets/Logo.svg";
import apiHelper from "../../Common/ApiHelper";
import Path from "../../Common/Path";

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState({
    email: ''
  });
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailRegex.test(emailOrPhone.email)) {
      console.log("Valid input. Proceed to send OTP.");
    } else {
      setError("Please enter a valid email or phone number.");
    }
    setError("");
    const data = { ...emailOrPhone }
    const result = await apiHelper.forgotpassword(data)
    console.log(result)
    localStorage.setItem('email', data.email)
    localStorage.setItem('otptoken', result.data.data)
    console.log("otp send successfull")
    navigate(Path.OtpPage)
    setEmailOrPhone({ email: "" })
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
              <h2 className="text-3xl font-semibold">Forget Password</h2>
              <div>
                <p className="text-[#4F4F4F]">
                  Enter your email and we’ll send you an OTP to reset your
                  password.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-6 gap-4 w-full">
                  <div className="col-span-6">
                    <label className="block text-md font-medium text-black mb-1">
                      Email<span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Email"
                      value={emailOrPhone.email}
                      onChange={(e) => setEmailOrPhone({ ...emailOrPhone, email: e.target.value })}
                      className={`border rounded-[10px] bg-transparent focus-visible:outline-none focus:border-[#5678E9] p-2 w-full ${error ? "border-red-500" : ""
                        }`}
                    />
                    {error && (
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="button-gradient text-white rounded-xl mt-6"
                  >
                    Get OTP
                  </button>
                </div>
              </form>

              <p className="text-md text-center">
                <Link to="/" className="text-[#E74C3C] font-medium">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
