import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import apiHelper from "../../Common/ApiHelper";
import { useSnackbar } from "notistack";
import Loader from "../../Component/Loader/Loader";

const ITEM_HEIGHT = 30;

export default function AnnouncementScreen({ societyId }) {
  const [isLoading, setisLoading] = useState(false)
  const [menu, setmenu] = useState(false)
  const [open, setOpen] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [selectAnnouncment, setselectAnnouncment] = useState("")
  const [Announcment, setAnnouncment] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [AnnouncmentDetails, setAnnouncmentDetails] = useState({
    announcementTitle: '',
    announcementDescription: '',
    announcementDate: '',
    announcementTime: ''
  });

  const handleClick = (event, data) => {
    setmenu(event.currentTarget);
    if (data) setselectAnnouncment(data)
  };
  const handleClose = () => {
    setmenu(false);
  };
  const handleDailogClose = () => {
    setOpen(false);
    setisEdit(false)
    setAnnouncmentDetails({
      announcementTitle: '',
      announcementDescription: '',
      announcementDate: '',
      announcementTime: ''
    })
  };

  async function createOrUpdateAnnouncement() {
    try {
      const data = {
        ...AnnouncmentDetails,
        societyId: societyId
      }
      if (isEdit) {
        console.log(selectAnnouncment)
        await apiHelper.updateAnnouncement(selectAnnouncment._id, data)
        enqueueSnackbar('Announcment Message Updated', { variant: 'info' })
      } else {
        await apiHelper.createAnnouncement(data)
        enqueueSnackbar('Announcment Message Added', { variant: 'success' })
      }
      listAnnouncement()
      setOpen(false)
    } catch (error) {
      enqueueSnackbar(`${error.message}`, { variant: 'error' })
      console.log(error);
    }
  }

  async function listAnnouncement() {
    try {
      setisLoading(true)
      const result = await apiHelper.listAnnouncement(societyId)
      setAnnouncment(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  async function handleEdit() {
    const [hours, minutes] = selectAnnouncment.announcementTime ? selectAnnouncment.announcementTime.split(":") : [null, null];
    setAnnouncmentDetails({
      announcementTitle: selectAnnouncment.announcementTitle,
      announcementDescription: selectAnnouncment.announcementDescription,
      announcementDate: selectAnnouncment.announcementDate.split("T")[0],
      announcementTime: hours && minutes ? dayjs().hour(hours).minute(minutes) : null,
    });
    setisEdit(true);
    setOpen(true);
    handleClose();
  }
  async function handleDelete() {
    try {
      await apiHelper.deleteAnnouncement(selectAnnouncment._id)
      enqueueSnackbar('Announcment Message Deleted', { variant: 'error' })
      listAnnouncement()
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    listAnnouncement()
  }, [])
  console.log(AnnouncmentDetails);

  return <>
    <Paper elevation={5} className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="h6 fw-bold mt-2">Announcement</div>
        <div>
          <button className="btn btn_primary fw-bold" onClick={() => setOpen(true)}>Create Announcement</button>
        </div>
      </div>
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
        <div className="mt-4 row">
          {Announcment && Announcment?.map((data, index) => (
            <div className="col-3 my-2 " key={index}  >
              <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                <div className="w-100" style={{ width: "100%", height: "210px" }}>
                  <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                    <div>{data.announcementTitle}</div>
                    <div className="d-flex align-items-center">
                      <Button
                        aria-label="more"
                        id="long-button"
                        aria-controls={menu ? 'long-menu' : undefined}
                        aria-expanded={menu ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, data)}
                        sx={{ backgroundColor: '#ffffff', minWidth: '0px', color: "#5678E9", padding: "3px" }}
                      >
                        <MoreVertIcon sx={{ fontSize: "18px" }} />
                      </Button>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={menu}
                        open={menu}
                        onClose={handleClose}
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: '10ch',
                            },
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleEdit(data)}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="p-2">
                      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "14px" }}>
                        <div style={{ color: "#4F4F4F" }}>Announcement Date</div>
                        <div className="p-1 rounded-5 px-2">{data?.announcementDate?.split("T")[0]}</div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "14px" }}>
                        <div style={{ color: "#4F4F4F" }}>Announcement Time</div>
                        <div className="p-1 rounded-5 px-2">{data?.announcementTime}</div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div className="text-muted">Description</div>
                        <div>{data?.announcementDescription}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>)}
    </Paper>
    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "400px",
          },

        }}>
        <DialogTitle className="" style={{ fontSize: "1rem" }}>{isEdit ? "Update AnnouncmentDetails" : "Add AnnouncmentDetails"}</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Title</label>
            <TextField
              className="w-100"
              id="description"
              variant="outlined"
              value={AnnouncmentDetails.announcementTitle}
              placeholder='Enter title'
              fullWidth
              rows={3}
              onChange={(e) => setAnnouncmentDetails({ ...AnnouncmentDetails, announcementTitle: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Discription</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Description"
              value={AnnouncmentDetails.announcementDescription}
              variant="outlined"
              fullWidth
              rows={3}
              onChange={(e) => setAnnouncmentDetails({ ...AnnouncmentDetails, announcementDescription: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Date</label>
                <DatePicker
                  sx={{ width: "100%" }}
                  onChange={(newValue) => {
                    setAnnouncmentDetails({
                      ...AnnouncmentDetails,
                      announcementDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                  }}
                  value={AnnouncmentDetails.announcementDate ? dayjs(AnnouncmentDetails.announcementDate) : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Date"
                      variant="outlined"
                      fullWidth
                      rows={3}
                    />
                  )}
                />
              </div>
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">time</label>
                <TimePicker
                  // label="Time"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  onChange={(newValue) => {
                    setAnnouncmentDetails({
                      ...AnnouncmentDetails,
                      announcementTime: newValue ? dayjs(newValue).format('HH:mm:ss') : "",
                    });
                  }}
                  value={AnnouncmentDetails.announcementTime ? dayjs(AnnouncmentDetails.announcementTime, 'HH:mm:ss') : null}
                  // value={AnnouncmentDetails.announcementTime || null}
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
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={createOrUpdateAnnouncement} style={{ width: "45%" }}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  </>
}