import React, { useState, useEffect, useRef } from "react";
import forgot from "../../assets/forgot.svg";
import logo from "../../assets/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";
import apiHelper from "../../Common/ApiHelper";
import Path from "../../Common/Path";

const OtpPage = () => {
  const [countdown, setCountdown] = useState(30); // Timer countdown (30 seconds)
  const [isResendEnabled, setIsResendEnabled] = useState(false); // Resend button state
  const [otpverify, setotpverify] = useState({
    otp: Array(6).fill(""), // Initialize an array of 6 empty strings
  });

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    const otpArray = [...otpverify.otp]; // Copy current OTP array
    otpArray[index] = value.slice(-1); // Update the specific index with the new value (limit to 1 digit)
    setotpverify({ otp: otpArray }); // Update the state

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpverify.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otpverify.otp.join("");
    console.log("OTP Value:", otpValue); // Log the 6-digit OTP value
  };
  const navigate = useNavigate()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1); // Decrease countdown by 1 every second
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on unmount
    } else {
      setIsResendEnabled(true); // Enable resend button when countdown reaches 0
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    setotpverify({ otp: [] })
    setCountdown(30);
    setIsResendEnabled(false);
    const data = localStorage.getItem('email')
    console.log(data)
    const result = await apiHelper.resendotp({ email: data })
    console.log(result)
    console.log("Resend OTP triggered!");
  };

  const otpverification = async () => {
    try {
      const otpValue = otpverify.otp.join("");
      const otptoken = localStorage.getItem('otptoken')
      const data = { otp: otpValue, otpToken: otptoken }
      const result = await apiHelper.otpverify(data)
      if (result) {
        navigate(Path.updatePassword)
        setotpverify({ otp: '' })
      }
    } catch (error) {
      console.log(error)
    }
  }





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
              <h2 className="text-3xl font-semibold">Enter OTP</h2>
              <div>
                <p className="text-[#4F4F4F]">
                  Please enter the 6-digit code that was sent to your phone number.
                </p>
              </div>
              <form className="flex flex-col gap-3">
                <div className="grid grid-cols-6 gap-4 w-full">
                  <div className="col-span-6">
                    <div className="flex mb-[20px] justify-start space-x-7">
                      {Array(6)
                        .fill("")
                        .map((_, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
                            type="text"
                            maxLength="1"
                            value={otpverify.otp[index] || ""}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="border rounded-[10px] bg-transparent text-center focus-visible:outline-none focus:border-[#5678E9] p-2 w-full h-[60px]"
                          />
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-[20px]">
                  <div className="flex items-center">
                    <AiOutlineClockCircle className="text-gray-600 mr-1" />
                    <span className="text-gray-600">
                      {countdown > 0
                        ? `00:${countdown.toString().padStart(2, "0")}`
                        : "00:00"}
                    </span>
                  </div>
                  <button
                    className={`${isResendEnabled ? "enabled" : "disabled"}`}
                    onClick={handleResendOtp}
                    disabled={!isResendEnabled}
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    className="button-gradient text-white rounded-xl mt-6"
                    onClick={otpverification}
                  >
                    Verify
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

export default OtpPage;
