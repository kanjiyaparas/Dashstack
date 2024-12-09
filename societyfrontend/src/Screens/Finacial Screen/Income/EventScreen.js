import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import 'flatpickr/dist/themes/material_green.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import apiHelper from "../../../Common/ApiHelper";
import { useSnackbar } from "notistack";
import Loader from "../../../Component/Loader/Loader";
import Path from "../../../Common/Path";
import EventViewScreen from "./EventViewScreen";
import { Card } from "react-bootstrap";


const options = ['Edit', 'Delete'];
const ITEM_HEIGHT = 30;

export default function EventScreen({ societyId, userInfo, getNotification }) {
  const [eventopen, seteventOpen] = useState(false);
  const [selectedEvent, setselectedEvent] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const [isLoading, setisLoading] = useState(false)
  const [incomeType, setincomeType] = useState("Other")
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setmenu] = useState(false)
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const { enqueueSnackbar } = useSnackbar()
  const [eventDetails, seteventDetails] = useState({
    title: "",
    date: "",
    dueDate: "",
    amount: "",
    description: ""
  })
  const [eventData, seteventData] = useState([])
  const navigate = useNavigate()

  const handleClick = (event, data) => {
    setmenu(event.currentTarget);
    if (data) seteditData(data)
  };

  const handleClickOpen = (data) => {
    setselectedEvent(data._id)
    seteventOpen(true)
  };
  const handleClose = () => {
    setmenu(false);
  }
  const handleDailogClose = () => {
    seteventDetails({
      title: "",
      date: "",
      dueDate: "",
      amount: "",
      description: ""
    })
    setDate(null)
    setDueDate(null)
    setIsEdit(false)
    setOpen(false);
    handleClose()
  };
  const getEvent = async () => {
    try {
      setisLoading(true)
      const result = await apiHelper.getEvents(societyId)
      if (result && result.data) {
        seteventData(result.data.data)
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  const updateevent = async () => {
    try {
      const data = { ...eventDetails, societyId: societyId, eventId: editData?._id }
      const result = await apiHelper.updateevent(data)
      if (result) {
        getEvent()
        enqueueSnackbar('Event Update Successfully!', { variant: 'info' })
        setOpen(false)
      }
      handleDailogClose()
    } catch (error) {
      console.log(error)
    }
  }

  const createEvent = async () => {
    try {
      console.log(eventDetails)
      const result = await apiHelper.createEvent({ ...eventDetails, societyId: societyId })
      if (result && result.data) {
        enqueueSnackbar('Event Add Succesfully!', { variant: 'success' })
        getEvent()
        setOpen(false)
      }
      handleDailogClose()
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = () => {
    console.log(editData);
    seteventDetails({
      title: editData?.title,
      date: editData?.date,
      dueDate: editData?.dueDate,
      amount: editData?.amount,
      description: editData?.description
    })
    setDate(editData?.date)
    setDueDate(editData?.dueDate)
    setIsEdit(true)
    setOpen(true)
  }
  const handleDelete = async () => {
    try {
      await apiHelper.deleteEvent(editData._id)
      handleDailogClose()
      enqueueSnackbar('Event Deleted!', { variant: 'error' })
      getEvent()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEvent()
  }, [])



  return <>
    <EventViewScreen getNotification={getNotification} userInfo={userInfo} eventopen={eventopen} societyId={societyId} selectedEvent={selectedEvent} />
    {!eventopen ? <> <Paper elevation={5} className="d-flex" style={{ width: "fit-content" }}>
      <button onClick={() => navigate("/finacial/income")} className={incomeType === "Maintenance" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Maintenance</button>
      <button onClick={() => setincomeType("Other")} className={incomeType === "Other" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Other Income</button>
    </Paper>
      <Paper elevation={5} className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="h6 fw-bold mt-2">Other Income</div>
          <div>
            <button className="btn btn_primary fw-bold" onClick={() => setOpen(true)}>Create Other income</button>
          </div>
        </div>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <Grid container spacing={2}>
            {eventData?.map((data) => (
              <Grid style={{ borderRadius: "10px" }} item xs={12} sm={6} md={4} lg={3} key={data._id}>
                <Card
                  variant="outlined"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    // position: 'relative',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    height: "320px"
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5678E9' }} className='p-2'>
                    <div>
                      <Typography variant="p" style={{ color: '#ffffff' }}>{data?.title}</Typography>
                    </div>
                    <div>
                      <div onClick={() => toggleDropdown(data._id)} style={{ backgroundColor: '#ffffff', minWidth: '0px', padding: '1px 3px', borderRadius: "8px" }}>
                        <MoreVertIcon sx={{ color: '#5678E9', fontSize: '18px' }} />
                        {activeDropdown === data._id && (<ul style={{ position: "absolute", backgroundColor: '#ffffff', padding: "10px", zIndex: 100, borderRadius: "8px", right: 0 }}>
                          <li onClick={handleEdit}>Edit</li>
                          <li onClick={handleDelete}>Delete</li>
                          <li onClick={() => {
                            handleClickOpen(data)
                          }}>View</li>
                        </ul>)}
                      </div>
                    </div>
                  </div>
                  <CardContent>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Date :</span>
                      <span>{data?.date?.split("T")[0]}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Due Date :</span>
                      <span>{data?.dueDate?.split("T")[0]}</span>
                    </div>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                      <div>Description :</div>
                      <div className=''>{data?.description}</div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper > </> : ""}
    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "450px"
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "24px" }}>{isEdit ? "Update Other Income" : "Create Other Income"}</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Title*</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Title"
              variant="outlined"
              fullWidth
              rows={3}
              margin="dense"
              value={eventDetails?.title}
              onChange={(e) => seteventDetails({ ...eventDetails, title: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Date*</label>
                <DatePicker
                  value={date ? dayjs(date) : null}
                  onChange={(newValue) => {
                    seteventDetails({
                      ...eventDetails,
                      date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                    setDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100"
                      placeholder="Select Date"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  )}
                />
              </div>
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Due Date*</label>
                <DatePicker
                  value={dueDate ? dayjs(dueDate) : null}
                  onChange={(newValue) => {
                    seteventDetails({
                      ...eventDetails,
                      dueDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                    setDueDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100"
                      placeholder="Select Date"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  )}
                />
              </div>
            </div>
          </LocalizationProvider>

          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Description*</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="dense"
              value={eventDetails?.description}
              onChange={(e) => seteventDetails({ ...eventDetails, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>

          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="amount">Amount*</label>
            <TextField
              className="w-100"
              id="amount"
              placeholder="00"
              variant="outlined"
              fullWidth
              margin="dense"
              value={eventDetails?.amount}
              onChange={(e) => seteventDetails({ ...eventDetails, amount: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <span style={{ fontWeight: 'bold' }}>₹</span>
                </InputAdornment>,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={isEdit ? updateevent : createEvent} style={{ width: "45%" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  </>
}