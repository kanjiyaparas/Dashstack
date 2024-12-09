import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Avatar, Chip, IconButton, Select } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import apiHelper from "../../Common/ApiHelper";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import Loader from '../../Component/Loader/Loader';

const acton = {
  Edit: <button className='btn text-success mx-1 p-0 px-1'>
    <EditIcon style={{ fontSize: "18px" }} />
  </button>,
  View: <button className='btn text-primary mx-1 p-0 px-1'>
    <VisibilityIcon style={{ fontSize: "18px" }} />
  </button>,
  Delete: <button className='btn text-danger mx-1 p-0 px-1'>
    <DeleteIcon style={{ fontSize: "18px" }} />
  </button>
}


export default function SecurityGaurdScreen({ societyId }) {
  const [isLoading, setisLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGender, setselectedGender] = useState("");
  const [selectedShift, setselectedShift] = useState("");
  const [Gaurd, setGaurd] = useState([])
  const [updateGaurdId, setupdateGaurdId] = useState("")
  const { enqueueSnackbar } = useSnackbar()
  const [GaurdDetails, setGaurdDetails] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    shiftTime: ''
  });
  const [detailsOpen, setdetailsOpen] = useState(false);
  const [viewDetails, setviewDetails] = useState({
    profileImage: '',
    fullName: '',
    joiningDate: '',
    shift: "",
    shiftTime: '',
    gender: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({
    adharCardImage: null,
    profileImage: null
  });
  const [dragging, setDragging] = useState({
    adharCardImage: false,
    profileImage: false
  });

  const handleDailogClose = () => {
    setImagePreview(null)
    setselectedGender("")
    setselectedShift("")
    setSelectedFiles({
      adharCardImage: null,
      profileImage: null
    })
    setDragging({
      adharCardImage: false,
      profileImage: false
    })
    setviewDetails({
      profileImage: '',
      fullName: '',
      joiningDate: '',
      shift: "",
      shiftTime: '',
      gender: "",
    })
    setGaurdDetails({
      fullName: '',
      email: '',
      phoneNumber: '',
      joiningDate: '',
      shiftTime: ''
    })
    setOpen(false);
    setIsEdit(false)
  };

  const handleClose = () => {
    setdetailsOpen(false);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
    }
    if (file && type === "profileImage") {
      // Create a URL for the selected file and update state
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle drag over event
  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragging((prev) => ({ ...prev, [type]: true }));
  };

  // Handle drag leave event
  const handleDragLeave = (type) => {
    setDragging((prev) => ({ ...prev, [type]: false }));
  };

  // Handle file drop event
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
      setDragging((prev) => ({ ...prev, [type]: false }));
    }
  };
  const renderUploadSection = (label, type) => (
    <div className="col-3 mt-1 w-100">
      <p style={{ fontSize: "12px", fontWeight: "bold", margin: "2px" }}>{label}</p>
      {selectedFiles[type] ? (
        <div className="border p-2" style={{ border: "2px solid #007bff", borderRadius: "12px", overflow: "hidden" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="ps-2" style={{ width: "80%", fontSize: "14px" }}>
              <div>{selectedFiles[type].name}</div>
              <div style={{ color: "#A7A7A7" }}>{(selectedFiles[type].size / 1024).toFixed(2)} KB</div>
              <div style={{ color: "green" }}>Uploaded File</div>
            </div>
            <div className="pe-3" style={{ width: "20%", textAlign: "end" }}>
              <DeleteIcon sx={{ color: "#A7A7A7" }} onClick={() => setSelectedFiles((prev) => ({ ...prev, [type]: null }))} />
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={type}
          className={`box py-3 ${dragging[type] ? 'border border-primary' : ''}`}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={() => handleDragLeave(type)}
          onDrop={(e) => handleDrop(e, type)}
          style={{
            border: dragging[type] ? "2px dashed #007bff" : "2px dashed #ccc",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <input
            id={type}
            type="file"
            hidden
            onChange={(e) => handleFileChange(e, type)}
          />
          <div className="logo d-flex justify-content-center">
            <AddPhotoAlternateIcon className="fs-1 text-muted" />
          </div>
          <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}>
            <span className="text-primary">Upload a file</span>
            <span> or drag and drop</span>
          </div>
          <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
        </label>
      )}
    </div>
  );

  async function createGaurd() {
    try {
      const data = {
        ...GaurdDetails,
        societyId: societyId,
        shift: selectedShift,
        gender: selectedGender,
      }
      const formdata = new FormData();

      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key])
      })
      formdata.append("profileImage", selectedFiles.profileImage)
      formdata.append("adharCardImage", selectedFiles.adharCardImage)
      await apiHelper.createGaurd(formdata)
      enqueueSnackbar("SecurityGaurd Add successfull!", { variant: "success" });
      listsecurityGaurd()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function listsecurityGaurd() {
    try {
      setisLoading(true)
      const result = await apiHelper.listGaurd(societyId)
      setGaurd(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  async function handleEdit(data) {

    let result = await apiHelper.imageDetails({ profileImage: data.profileImage, adharCardImage: data.adharCardImage })
    result = result.data.data


    const [hours, minutes] = data.shiftTime ? data.shiftTime.split(":") : [null, null];
    setupdateGaurdId(data._id)
    setGaurdDetails({
      fullName: data?.userId?.fullName,
      email: data?.userId?.email,
      phoneNumber: data?.userId?.phoneNumber,
      joiningDate: data.joiningDate,
      shiftTime: hours && minutes ? dayjs().hour(hours).minute(minutes) : null
    })
    setselectedShift(data.shift)
    setselectedGender(data.gender)
    setSelectedFiles({
      adharCardImage: { name: `${result?.adharCardImage.display_name}.${result?.adharCardImage.format}`, size: result?.adharCardImage.bytes },
      profileImage: { name: `${result?.profileImage.display_name}.${result?.profileImage.format}`, size: result?.profileImage?.bytes }
    })
    setImagePreview(data.profileImage)
    setIsEdit(true)
    setOpen(true)
  }

  async function updateGaurd() {
    try {
      const data = {
        ...GaurdDetails,
        societyId: societyId,
        shift: selectedShift,
        gender: selectedGender,
      }
      const formdata = new FormData();

      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key])
      })
      formdata.append("profileImage", selectedFiles.profileImage)
      formdata.append("adharCardImage", selectedFiles.adharCardImage)
      await apiHelper.editGaurd(updateGaurdId, formdata)
      enqueueSnackbar("Updated successfull!", { variant: "info" });
      listsecurityGaurd()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }
  async function handleDelete(data) {
    try {
      await apiHelper.deleteGaurd(data._id)
      enqueueSnackbar("Deleted Succesfull!", { variant: "error" });
      listsecurityGaurd()
    } catch (error) {
      console.log(error);
    }
  }

  function formatTimeToAMPM(time) {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  async function handleView(data) {
    setviewDetails({
      profileImage: data?.profileImage,
      fullName: data?.userId?.fullName,
      joiningDate: data?.joiningDate,
      shift: data?.shift,
      shiftTime: formatTimeToAMPM(data?.shiftTime),
      gender: data?.gender,
    })
    setdetailsOpen(true)
    console.log(data)
  }

  useEffect(() => {
    listsecurityGaurd()
  }, []);

  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Security Guard Details</div>
        <div>
          <button className='btn btn_primary fw-bold' onClick={() => setOpen(true)} ><AddBoxIcon />Add Security</button>
        </div>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
          <TableHead style={{ background: "aliceblue" }}>
            <TableRow>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Security Guard Name</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Phone Number</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Select Shift</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Shift Date</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Shift Time</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Gender</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <TableBody>
              {Gaurd && Gaurd?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" className='d-flex align-items-center justify-content-evenly'>
                    <Avatar alt="Remy Sharp" src={row.profileImage} /> <span>  {row.userId?.fullName}</span>
                  </TableCell>
                  <TableCell align="center">{row.userId?.phoneNumber}</TableCell>
                  <TableCell align="center"><Chip className={row.shift === "Day" ? "Day" : "Night"} label={row.shift === "Day" ? <><LightModeIcon />&nbsp;{row.shift}</> : <><DarkModeIcon />&nbsp;{row.shift}</>} variant="outlined" /></TableCell>
                  <TableCell align="center">{row.joiningDate}</TableCell>
                  <TableCell align="center">{formatTimeToAMPM(row.shiftTime)}</TableCell>
                  <TableCell align="center"><Chip className={row.gender === "Male" ? "Male" : "Female"} label={row.gender === "Male" ? <><ManIcon />&nbsp;{row.gender}</> : <><WomanIcon />&nbsp;{row.gender}</>} variant="outlined" /></TableCell>
                  <TableCell align="center">
                    <span onClick={() => handleEdit(row)}>{acton.Edit}</span>
                    <span onClick={() => handleView(row)}>{acton.View}</span>
                    <span onClick={() => handleDelete(row)}>{acton.Delete}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>)}
        </Table>
      </TableContainer>
    </Paper>

    {/* Edit Dialog */}
    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "400px",
          },

        }}>
        <DialogTitle className="py-2" style={{ fontSize: "1rem" }}>{isEdit ? "Update Security Gaurd" : "Add Security Gaurd"}</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent className='px-3 pt-1'>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="file">
              <Avatar style={{ width: "50px", height: "50px" }} alt="" src={imagePreview || "/static/images/avatar/1.jpg"} />
              <input onChange={(e) => handleFileChange(e, "profileImage")} id="file" type="file" hidden /></label><br />
            <label htmlFor="file" className="mx-3 text-primary fw-bold" style={{ fontSize: "14px" }}>Add Photo</label>
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">FullName</label>
            <TextField
              className="w-100"
              id="description"
              variant="outlined"
              value={GaurdDetails.fullName}
              placeholder='Enter FullName'
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setGaurdDetails({ ...GaurdDetails, fullName: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Email</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Email"
              value={GaurdDetails.email}
              variant="outlined"
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setGaurdDetails({ ...GaurdDetails, email: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-1" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Phone Number</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Phone Number"
              value={GaurdDetails.phoneNumber}
              variant="outlined"
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setGaurdDetails({ ...GaurdDetails, phoneNumber: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-1 d-flex justify-content-between" style={{ width: "100%" }}>
            <div style={{ width: "49%" }}>
              <label style={{ fontSize: "14px" }} htmlFor="phoneNumber">Gender</label><br />
              <Select
                className='w-100'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedGender}
                displayEmpty
                onChange={(e) => setselectedGender(e.target.value)}
              >
                <MenuItem value={""}>
                  <em>Gender</em>
                </MenuItem>
                <MenuItem key={"Male"} value={"Male"}>Male</MenuItem>
                <MenuItem key={"Female"} value={"Female"}>Female</MenuItem>
                <MenuItem key={"Others"} value={"Others"}>Others</MenuItem>
              </Select>
            </div>
            <div style={{ width: "49%" }}>
              <label style={{ fontSize: "14px" }} htmlFor="phoneNumber">Shift</label><br />
              <Select
                className='w-100'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedShift}
                displayEmpty
                onChange={(e) => setselectedShift(e.target.value)}
              >

                <MenuItem value={""}>
                  <em>Shift</em>
                </MenuItem>
                <MenuItem key={"Day"} value={"Day"}>Day</MenuItem>
                <MenuItem key={"Night"} value={"Night"}>Night</MenuItem>
              </Select>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="my-1" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Date</label>
                <DatePicker
                  sx={{ width: "100%" }}
                  onChange={(newValue) => {
                    setGaurdDetails({
                      ...GaurdDetails,
                      joiningDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                  }}
                  value={GaurdDetails.joiningDate ? dayjs(GaurdDetails.joiningDate) : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Date"
                      variant="outlined"
                      fullWidth
                      rows={3}
                      margin="dense"
                    />
                  )}
                />
              </div>
              <div className="my-1" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">time</label>
                <TimePicker
                  // label="Time"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  onChange={(newValue) => {
                    setGaurdDetails({
                      ...GaurdDetails,
                      shiftTime: newValue ? dayjs(newValue).format('HH:mm:ss') : "",
                    });
                  }}
                  value={GaurdDetails.shiftTime ? dayjs(GaurdDetails.shiftTime) : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Time"
                      variant="outlined"
                      fullWidth
                      rows={3}
                      margin="dense"
                    />
                  )}
                />
              </div>
            </div>
          </LocalizationProvider>
          <div className="row">
            {renderUploadSection("Upload Aadhar Card", "adharCardImage")}
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={isEdit ? updateGaurd : createGaurd} style={{ width: "45%" }}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    {/* View Details Dialog */}
    <React.Fragment>
      <Dialog open={detailsOpen} onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "450px"
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "18px" }}>View Security Guard Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="file">
              <Avatar style={{ width: "70px", height: "70px" }} alt="" src={viewDetails.profileImage || "/static/images/avatar/1.jpg"} />
              <input onChange={(e) => ""} id="file" type="file" hidden />
            </label><br />
            {/* <label htmlFor="file" className="mx-3 text-primary fw-bold" style={{ fontSize: "14px" }}>Add Photo</label> */}
            <div className="d-flex flex-column">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>{viewDetails?.fullName}</div>
              <div className='p-0 m-0' style={{ color: "#A7A7A7" }}>{viewDetails?.joiningDate}</div>
            </div>
          </div>
          <div className="d-flex align-items-center row mt-3">
            <div className="p-1 px-2 col-4 with-line text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Select Shift</div>
              <Chip className={viewDetails.shift === "Day" ? "Day" : "Night"} label={viewDetails.shift === "Day" ? <><LightModeIcon />&nbsp;{viewDetails.shift}</> : <><DarkModeIcon />&nbsp;{viewDetails.shift}</>} variant="outlined" />
            </div>
            <div className="p-1 px-2 col-4 with-line text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Shift Time</div>
              <Chip label={viewDetails.shiftTime} variant="outlined" />
            </div>
            <div className="p-1 px-2 col-4 with-line text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Select Shift</div>
              <Chip className={viewDetails.gender === "Male" ? "Male" : "Female"} label={viewDetails.gender === "Male" ? <><ManIcon />&nbsp;{viewDetails.gender}</> : <><WomanIcon />&nbsp;{viewDetails.gender}</>} variant="outlined" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  </>
}
