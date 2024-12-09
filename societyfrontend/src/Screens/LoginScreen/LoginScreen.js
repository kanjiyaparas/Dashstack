import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiHelper from "../../Common/ApiHelper";
import Path from "../../Common/Path";
import jwt from 'jsonwebtoken';
import { useSnackbar } from "notistack"

export default function LoginScreen({ Auth, userInfo, setAuth }) {
  console.log(Auth)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [LoginDetails, setLoginDetails] = React.useState({
    email: "",
    password: ""
  });

  async function loginhandler() {
    try {
      const data = { ...LoginDetails }
      const result = await apiHelper.loginUser(data)
      localStorage.setItem("token", result.data.token)
      setAuth(localStorage.setItem("token", result.data.token))
      const userData = jwt.decode(result.data.token)
      if (userData && userData.role === "Security") {
        return navigate(Path.visitor)
      }else{
        navigate(Path.DashboardScreen)
      }
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Something Wrong in Login!', { variant: 'error' })
    }
  }

  useEffect(() => {
    if (Auth && userInfo?._id || localStorage.getItem("token")) {
      navigate("/dashboard")
    }
    // eslint-disable-next-line
  }, [Auth])


  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return <>
    <div className="row">
      <div style={{ background: "white", position: "relative", height: "100vh" }} className="col-6">
        <div style={{ position: "absolute", top: "10%", left: "10%", zIndex: 100 }}>
          <span className='h2 fw-bold'>Dash</span>
          <span className='h2 fw-bold' style={{ color: "#FE512E" }}>Stack</span>
        </div>
        <div className="d-flex" style={{ position: "absolute", top: "30%", left: "18%" }}>
          <img src="https://media.licdn.com/dms/image/v2/D5612AQFElcjuyLX8wg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1725364910790?e=2147483647&v=beta&t=b-gPcB3JnJ4PPPvHEHx7m4ECXvqrfq64xr5S20Z09hA" alt="" width={"80%"} height={"400px"} />
        </div>
        <div className="text-center" style={{ position: "absolute", top: "80%", left: "22%", zIndex: 100 }}>
          <span className='h5 fw-bold'>Your Space, Your Place :</span>
          <span className='h5 fw-bold' style={{ color: "#FE512E" }}> Society Management</span><br />
          <span className='h5 fw-bold'>Made Simple.</span>
        </div>
      </div>
      <div className="col-6 d-flex align-items-center justify-content-center" style={{ background: "whitesmoke", height: "100vh" }}>
        <div className="login_part p-3 w-50" style={{ background: "white" }}>
          <div className="h4 my-3 fw-bold">Login</div>
          <div style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Email*</label><br />
            <TextField onChange={(e) => setLoginDetails({ ...LoginDetails, email: e.target.value })} className="w-100" id="phoneNumber" placeholder="Enter your email" variant="outlined" />
          </div><br />
          <div style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Password*</label><br />
            <FormControl sx={{ width: '100%' }} variant="outlined">
              {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
              <OutlinedInput
                onChange={(e) => setLoginDetails({ ...LoginDetails, password: e.target.value })}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Password"
              />
            </FormControl>
          </div>
          <div className="d-flex my-2 justify-content-between">
            <div className="text-muted d-flex gap-1">
              <input type="checkbox" name="checkbox" id="checkbox" />
              <label htmlFor="checkbox">Remember me</label>
            </div>
            <div className="text-danger" onClick={() => navigate("/ForgotPassword")}>
              Forget Password ?
            </div>
          </div>
          <div className="d-flex my-3">
            <button onClick={loginhandler} disabled={!LoginDetails.email || !LoginDetails.password} className="btn fw-bold btn_primary w-100">Sing In</button>
          </div>
          <div className="text-center">
            <span>Don’t have an account?</span><span onClick={() => navigate("/login")} className="text-danger fw-bold"> Registration</span>
          </div>
        </div>
      </div>
    </div>
  </>
}