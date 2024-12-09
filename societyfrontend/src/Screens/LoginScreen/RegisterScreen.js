import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiHelper from "../../Common/ApiHelper";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Path from "../../Common/Path";
import { useSnackbar } from "notistack"


export default function RegisterScreen({ Auth, userInfo }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = React.useState(false);
  const [selectedWing, setselectedWing] = React.useState();
  const [selectedFloor, setselectedFloor] = React.useState();
  const [selectedSeries, setselectedSeries] = React.useState();
  const [selectedUnit, setselectedUnit] = React.useState();
  const [selectedType, setselectedType] = React.useState("");
  const [SocietyDetails, setSocietyDetails] = React.useState({
    societyName: "",
    societyAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const [SocietyList, setSocietyList] = useState([])
  const [selectSociety, setselectSociety] = useState("")
  const [RegisterDetails, setRegisterDetails] = React.useState({
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: 0,
    password: "",
    confirmPassword: ""
  });

  async function getSociety() {
    try {
      const result = await apiHelper.listSociety()
      setSocietyList(result.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function registerHandler() {
    try {
      if (RegisterDetails.password !== RegisterDetails.confirmPassword) return window.alert("Do not match Password")
      const data = { ...RegisterDetails, selectSociety: selectSociety }
      await apiHelper.createChairman(data)
      navigate(Path.LoginScreen)
    } catch (error) {
      console.log(error);
    }
  }

  async function createSociety() {
    try {
      const data = ({
        ...SocietyDetails,
        societyType: selectedType,
        wingCount: selectedWing,
      })
      const result = await apiHelper.createSociety(data)
      const Data = {
        societyId: result?.data?.data?._id,
        unitCount: selectedUnit,
        series: selectedSeries,
        floor: selectedFloor
      }
      await apiHelper.createUnit(Data)
      enqueueSnackbar('society Add Succesfully!', { variant: 'success' })
      getSociety()
      navigate(Path.RegisterScreen)
    } catch (error) {
      console.log(error)
      enqueueSnackbar('something wrong in create society', { variant: 'error' })
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    getSociety()
  }, []);

  useEffect(() => {
    if (Auth && userInfo?._id || localStorage.getItem("token")) {
      navigate("/dashboard")
    }
  }, [Auth])

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
          <span className='h5 fw-bold'>Connect, Collaborate, and Control – </span>
          <span className='h5 fw-bold' style={{ color: "#FE512E" }}> Society <br /> Management</span>
          <span className='h5 fw-bold'> Simplified</span>
        </div>
      </div>
      <div className="col-6 d-flex align-items-center justify-content-center" style={{ background: "whitesmoke", height: "100vh" }}>
        <div className="login_part p-3 w-75" style={{ background: "white" }}>
          <div className="h4 my-3 fw-bold">Registration</div>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">First Name*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, firstName: e.target.value })} className="w-100" id="phoneNumber" placeholder="Enter First Name" variant="outlined" />
            </div>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Last Name*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, lastName: e.target.value })} className="w-100" id="phoneNumber" placeholder="Enter your Last Name" variant="outlined" />
            </div>
          </div>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Email*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, email: e.target.value })} className="w-100" id="phoneNumber" placeholder="Enter your email" variant="outlined" />
            </div>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Phone Number*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, phoneNumber: Number(e.target.value) })} className="w-100" id="phoneNumber" placeholder="Enter your Phone Number" variant="outlined" />
            </div>
          </div>
          {/* <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "32%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Country*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, country: e.target.value })} className="w-100" id="phoneNumber" label="Your Country" variant="outlined" />
            </div>
            <div className="my-2" style={{ width: "32%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">State*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, state: e.target.value })} className="w-100" id="phoneNumber" label="Your State" variant="outlined" />
            </div>
            <div className="my-2" style={{ width: "32%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">City*</label>
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, city: e.target.value })} className="w-100" id="phoneNumber" label="Your City" variant="outlined" />
            </div>
          </div> */}
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Select Society*</label>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Society</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectSociety}
                onChange={(e) => setselectSociety(e.target.value)}
              >
                {
                  SocietyList && SocietyList.map((item) => {
                    return <MenuItem value={item._id}>{item.societyName}</MenuItem>
                  })
                }
                <MenuItem><div onClick={() => setOpen(true)} className="btn btn_primary w-100">Create Society</div></MenuItem>

              </Select>
            </FormControl>
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Password*</label>
            <FormControl sx={{ width: '100%' }} variant="outlined">
              {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
              <OutlinedInput
                onChange={(e) => setRegisterDetails({ ...RegisterDetails, password: e.target.value })}
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
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Confirm Password*</label>
            <FormControl sx={{ width: '100%' }} variant="outlined">
              {/* <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel> */}
              <OutlinedInput
                onChange={(e) => setRegisterDetails({ ...RegisterDetails, confirmPassword: e.target.value })}
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
                placeholder="Confirm Password"
              />
            </FormControl>
          </div>
          <div className="d-flex my-2 gap-2">
            <div className="text-dark d-flex gap-1">
              <input type="checkbox" name="checkbox" id="checkbox" />
              <label htmlFor="checkbox">I agree to all the Terms and </label>
            </div>

            <div className="text-danger">
              Privacy Policies.
            </div>
          </div>
          <div className="d-flex my-3">
            <button onClick={registerHandler} disabled={!RegisterDetails.email || !RegisterDetails.password} className="btn fw-bold btn_primary w-100">Register</button>
          </div>
          <div className="text-center">
            <span>Already have an account?</span><span onClick={() => navigate("/")} className="text-danger fw-bold"> Login</span>
          </div>
        </div>
      </div>
    </div>
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "450px"
          },
        }}
      >
        <DialogTitle>Create Society</DialogTitle>
        <DialogContent>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Society Name*</label>
            <TextField className="w-100" id="phoneNumber" placeholder="Enter Society Name" variant="outlined"
              onChange={(e) => setSocietyDetails({ ...SocietyDetails, societyName: e.target.value })} />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Society Address*</label>
            <TextField className="w-100" id="phoneNumber" placeholder="Enter Society Address" variant="outlined"
              onChange={(e) => setSocietyDetails({ ...SocietyDetails, societyAddress: e.target.value })} />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Society Type</label>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Society Type</InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedType}
                displayEmpty
                onChange={(e) => setselectedType(e.target.value)}
              >
                <MenuItem value=""><em className='text-muted' color='gray'>Select Type</em></MenuItem>
                <MenuItem key={"apartment"} value={"apartment"}>Apartment</MenuItem>
                <MenuItem key={"tenement"} value={"tenement"}>Tenement</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={selectedType === "apartment" ? { width: "32%" } : { width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Total Wing*</label>
              <FormControl fullWidth>
                {/* <InputLabel id="demo-simple-select-label">Total Wing</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedWing}
                  // placeholder="select wing"
                  displayEmpty
                  onChange={(e) => setselectedWing(e.target.value)}
                >
                  <MenuItem defaultValue={'Select Wing'}><em className='text-muted' color='gray'>Select Wing</em></MenuItem>
                  {[...Array(9).keys()].map((number) => (
                    <MenuItem key={number + 1} value={number + 1}>
                      {number + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="my-2" style={selectedType === "apartment" ? { width: "32%", display: 'block' } : { width: "49%", display: "none" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Total Floor*</label>
              <FormControl fullWidth>
                {/* <InputLabel id="demo-simple-select-label">Floor</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedFloor}
                  displayEmpty
                  onChange={(e) => setselectedFloor(e.target.value)}
                >
                  <MenuItem defaultValue={'Select Floor'}><em className='text-muted' color='gray'>Select Floor</em></MenuItem>
                  {[...Array(9).keys()].map((number) => (
                    <MenuItem key={number + 1} value={number + 1}>
                      {number + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="my-2" style={selectedType === "apartment" ? { width: "32%" } : { width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Total Unit*</label>
              <FormControl fullWidth>
                {/* <InputLabel id="demo-simple-select-label">Total Unit</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUnit}
                  displayEmpty
                  onChange={(e) => setselectedUnit(e.target.value)}
                >
                  <MenuItem defaultValue={'Select Unit'}><em className='text-muted' color='gray'>Select Unit</em></MenuItem>
                  {[...Array(9).keys()].map((number) => (
                    <MenuItem key={number + 1} value={number + 1}>
                      {number + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Select Series*</label>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Select Series</InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedSeries}
                displayEmpty
                onChange={(e) => setselectedSeries(e.target.value)}
              >
                <MenuItem defaultValue={'Select Series'}><em className='text-muted' color='gray'>Select Series</em></MenuItem>
                {[...Array(4).keys()].map((number) => (
                  <MenuItem key={Math.pow(100, number)} value={Math.pow(100, number)}>
                    {Math.pow(10, number)}
                  </MenuItem>
                ))}

              </Select>
            </FormControl>
          </div>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Country*</label>
              <TextField className="w-100" id="phoneNumber" placeholder="Country" variant="outlined"
                onChange={(e) => setSocietyDetails({ ...SocietyDetails, country: e.target.value })} />
            </div>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">State*</label>
              <TextField className="w-100" id="phoneNumber" placeholder="State" variant="outlined"
                onChange={(e) => setSocietyDetails({ ...SocietyDetails, state: e.target.value })} />
            </div>
          </div>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">City*</label>
              <TextField className="w-100" id="phoneNumber" placeholder="City" variant="outlined"
                onChange={(e) => setSocietyDetails({ ...SocietyDetails, city: e.target.value })} />
            </div>
            <div className="my-2" style={{ width: "49%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Zip Code*</label>
              <TextField onChange={(e) => setSocietyDetails({ ...SocietyDetails, zipCode: Number(e.target.value) })} className="w-100" id="phoneNumber" placeholder="Zip Code" variant="outlined" />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-evenly">
          <button className="btn btn_outline w-25 fw-bold" onClick={handleClose}>Cancel</button>
          <button className="btn btn_primary w-25 fw-bold" onClick={createSociety} type="submit">Create</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  </>
}