import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from 'react';
import zIndex from '@mui/material/styles/zIndex';
import apiHelper from '../../Common/ApiHelper';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import Loader from '../../Component/Loader/Loader';
import { useNotification } from '../../Component/NotificationContext';

const action = {
  Edit: <button className='btn text-success mx-1'>
    <EditIcon style={{ fontSize: "18px" }} />
  </button>,
  View: <button className='btn text-primary mx-1'>
    <VisibilityIcon style={{ fontSize: "18px" }} />
  </button>,
  Delete: <button className='btn text-danger mx-1'>
    <DeleteIcon style={{ fontSize: "18px" }} />
  </button>
}

export default function RequestTracking({ societyId, userInfo }) {
  const { refreshNotifications } = useNotification();
  const [isLoading, setisLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [selectedUnit, setselectedUnit] = useState();
  const [selectedWing, setselectedWing] = useState("");
  const [wingList, setwingList] = useState([]);
  const [unitList, setunitList] = useState([]);
  const [SelectMember, setSelectMember] = useState({});
  const [Complain, setComplain] = useState([]);
  const [complainDetails, setcomplainDetails] = useState({
    complaintName: "",
    discription: "",
  })
  const [isEdit, setIsEdit] = useState(false);
  const [detailsOpen, setdetailsOpen] = useState(false);
  const [viewDetails, setviewDetails] = useState({});
  const [selectCompainId, setselectCompainId] = useState("");
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleDailogClose = () => {
    setcomplainDetails({
      complaintName: "",
      discription: "",
    })
    setselectedUnit("")
    setselectedWing("")
    setSelectMember({})
    setSelectedPriority("Medium")
    setOpen(false);
  };

  const handleClose = () => {
    setdetailsOpen(false);
  };

  async function createComplaint() {
    try {
      const data = {
        ...complainDetails,
        complainerName: SelectMember?.userId?.fullName,
        wingId: selectedWing,
        unitId: selectedUnit,
        memberId: SelectMember?._id,
        societyId: societyId,
        priorityStatus: selectedPriority,
        complaintype: "Request"
      }
      if (isEdit) {
        console.log(data)
        await apiHelper.updateComplaint(selectCompainId, { ...data })
        enqueueSnackbar('Request Updated', { variant: 'info' })
      } else {
        await apiHelper.createComplaint({ ...data })
        enqueueSnackbar('Request Create Succesfully!', { variant: 'success' })
        refreshNotifications()
      }
      setOpen(false)
      setselectedUnit("")
      setselectedWing("")
      setSelectedPriority("Medium")
      getComplaint()
    } catch (error) {
      console.log(error);
    }
  }
  async function getComplaint() {
    try {
      setisLoading(true)
      const data = {
        societyId: societyId,
        type: "Request"
      }
      const result = await apiHelper.listAllComplain(data)
      setComplain(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }
  async function deleteComplaint(id) {
    try {
      await apiHelper.deleteComplaint(id)
      enqueueSnackbar('Complain Deleted', { variant: 'error' })
      getComplaint()
    } catch (error) {
      console.log(error);
    }
  }

  async function getWing() {
    try {
      const result = await apiHelper.listWing(societyId)
      setwingList(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  async function getUnit() {
    try {
      const result = await apiHelper.listUnit(selectedWing)
      setunitList(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getComplaint()
    getWing()
  }, []);

  useEffect(() => {
    if (selectedWing !== '') {
      getUnit()
    }
  }, [selectedWing]);

  async function getMemberByUnit() {
    try {
      const result = await apiHelper.listByUnit(selectedUnit)
      setSelectMember(result?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleEdit(data) {
    console.log(data);
    setselectCompainId(data?._id)
    setselectedWing(data?.wingId?._id)
    setselectedUnit(data?.unitId?._id)
    setcomplainDetails({
      complaintName: data?.complaintName,
      discription: data?.discription,
    })
    setSelectedPriority(data?.priorityStatus)
    setIsEdit(true)
    setOpen(true)
  }

  async function handleView(data) {
    console.log(data)
    const Data = {
      complaintId: data?._id,
      status: "Open"
    }
    setviewDetails({
      profileImage: data?.memberId?.profileImage,
      name: data?.memberId?.userId?.fullName,
      requestName: data?.complaintName,
      description: data?.discription,
      wing: data?.wingId?.wingName,
      unit: data?.unitId?.unitNumber,
      priority: data?.priorityStatus,
      status: data?.status
    })
    await apiHelper.updateComplaintStatus(Data)
    getComplaint()
    setdetailsOpen(true)
  }

  useEffect(() => {
    if (selectedUnit !== '') {
      getMemberByUnit()
    }
  }, [selectedUnit]);
  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Request Tracking</div>
        <div>
          <button className='btn btn_primary fw-bold' onClick={() => setOpen(true)} ><AddBoxIcon /> Add Request</button>
        </div>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
          <TableHead style={{ background: "aliceblue" }}>
            <TableRow>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="left">Requester Name</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="left">Request Name</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Number</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="left">Description</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Priority</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Status</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <TableBody>
              {Complain.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" className='d-flex align-items-center'>
                    <Avatar alt={row?.memberId?.userId?.fullName} src={row?.memberId?.profileImage} /> <span className="ms-2">{row?.memberId?.userId?.fullName}</span>
                  </TableCell>
                  <TableCell align="left">{row.complaintName?.length > 25 ? `${row.complaintName.slice(0, 28)}...` : row.complaintName}</TableCell>
                  <TableCell align="center"><span style={{ background: "lightblue", borderRadius: "50%", padding: "3px 5px" }}>{row?.wingId?.wingName}</span>&nbsp;{row?.unitId?.unitNumber}</TableCell>
                  <TableCell align="left">{row?.discription?.length > 30
                    ? `${row.discription.slice(0, 30)}...`
                    : row.discription}</TableCell>
                  <TableCell align="center"><Chip className={row?.priorityStatus === "High" ? "High" : row?.priorityStatus === "Medium" ? "Medium" : "Low"} label={row?.priorityStatus} variant="outlined" /></TableCell>
                  <TableCell align="center"><Chip className={row?.status === "Solve" ? "Solve" : row?.status === "Open" ? "Open" : "Pending"} label={row?.status} variant="outlined" /></TableCell>
                  <TableCell align="center">
                    <span onClick={() => handleEdit(row)}>{action.Edit}</span>
                    <span onClick={() => handleView(row)}>{action.View}</span>
                    <span onClick={() => deleteComplaint(row._id)} >{action.Delete}</span>
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
            width: "450px",
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "24px" }}>{isEdit ? "Update Complaint" : "Create Complaint"}</DialogTitle>
        <hr className="mx-4 my-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="d-flex justify-content-between" style={{ width: "100%" }}>
            <div className="my-2" style={{ width: "49%" }}>
              <label className='mb-2' style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="phoneNumber">Wing<span style={{ color: "red" }}>*</span></label>
              <FormControl fullWidth>
                {/* <InputLabel id="demo-simple-select-label">Wing</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedWing}
                  displayEmpty
                  onChange={(e) => setselectedWing(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value=""><em className='text-muted' color='gray'>Wing</em></MenuItem>
                  {wingList?.map((data, index) => (
                    <MenuItem key={index} value={data._id}>
                      {data.wingName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="my-2" style={{ width: "49%" }}>
              <label className='mb-2' style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="phoneNumber">Unit<span style={{ color: "red" }}>*</span></label>
              <FormControl disabled={!selectedWing} fullWidth>
                {/* <InputLabel id="demo-simple-select-label">Unit</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUnit}
                  displayEmpty
                  onChange={(e) => setselectedUnit(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value=""><em className='text-muted' color='gray'>Unit</em></MenuItem>
                  {unitList && unitList.map((data, index) => (
                    <MenuItem key={index} value={data._id}><span className=" text-light rounded-pill me-1 px-1" style={{ fontSize: "14px", background: "darkorange" }}>{data.wingId.wingName}</span>{data.unitNumber}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mb-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="description">Requester Name<span style={{ color: "red" }}>*</span></label>
            <TextField
              disabled
              className="w-100"
              id="complainerName"
              value={SelectMember?.userId?.fullName}
              variant="outlined"
              fullWidth
              rows={3}
              margin="dense"
              onChange={(e) => setcomplainDetails({ ...complainDetails, complainerName: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="description">Request Name<span style={{ color: "red" }}>*</span></label>
            <TextField
              className="w-100"
              id="complaintName"
              placeholder="Enter Request Name"
              variant="outlined"
              fullWidth
              rows={3}
              margin="dense"
              value={complainDetails?.complaintName}
              onChange={(e) => setcomplainDetails({ ...complainDetails, complaintName: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>
          <div className="my-1" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="description">Description<span style={{ color: "red" }}>*</span></label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              margin="dense"
              value={complainDetails?.discription}
              onChange={(e) => setcomplainDetails({ ...complainDetails, discription: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>

          <div className="my-2" style={{ width: "100%" }}>
            <FormControl fullWidth>
              <label className="mb-1" style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="description">
                Priority<span style={{ color: "red" }}>*</span>
              </label>
              <RadioGroup
                row
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                aria-labelledby="priority-radio-buttons-group"
                name="priority-radio-buttons-group"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                {["High", "Medium", "Low"].map((priority) => (
                  <Button
                    key={priority}
                    variant="outlined"
                    sx={{
                      borderColor: selectedPriority === priority ? "orange" : "#ddd",
                      border: selectedPriority === priority ? "2px solid #FE512E" : "",
                      color: selectedPriority === priority ? "black" : "#666",
                      borderRadius: "10px"
                    }}
                  >
                    <FormControlLabel
                      value={priority}
                      control={
                        <Radio
                          sx={{
                            color: "#FE512E",
                            "&.Mui-checked": {
                              color: "#FE512E", // Color when selected
                            },
                          }}
                        />
                      }
                      label={<span style={{ fontWeight: "500" }}>{priority}</span>}
                    />
                  </Button>
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={createComplaint} style={{ width: "45%" }}>
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
        <DialogTitle className="" style={{ fontSize: "18px" }}>View Request</DialogTitle>
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
            <div className="d-flex flex-column">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>{viewDetails?.name}</div>
            </div>
          </div>
          <div className='mt-4'>
            <div style={{ color: "#A7A7A7" }} >Request Name</div>
            <div>{viewDetails.requestName}</div>
          </div>
          <div className='mt-3'>
            <div style={{ color: "#A7A7A7" }} >Description</div>
            <div>{viewDetails.description}</div>
          </div>
          <div className="d-flex align-items-center row mt-3">
            <div className='p-1 px-2 col-2 with-line'>
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Wing</div>
              <div className='text-center'>
                <span style={{ background: "lightblue", borderRadius: "50%", padding: "1px 7px" }}>{viewDetails.wing}</span>
              </div>
            </div>
            <div className='p-1 px-2 col-3 with-line'>
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Unit</div>
              <div className='text-center'>{viewDetails.unit}</div>
            </div>
            <div className='p-1 px-2 col-4 with-line text-center'>
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Status</div>
              <Chip className={viewDetails?.priority === "High" ? "High" : viewDetails?.priority === "Medium" ? "Medium" : "Low"} label={viewDetails?.priority} variant="outlined" />
              {/* <Chip className={viewDetails?.residentStatus === "Owner" ? "Owner" : viewDetails?.residentStatus === "Tenant" ? "Tenant" : ""} label={viewDetails?.residentStatus === "Owner" ? <><PersonIcon />&nbsp;{viewDetails?.residentStatus}</> : viewDetails?.residentStatus === "Tenant" ? <><ThreePIcon />&nbsp;{viewDetails?.residentStatus}</> : "--"} variant="outlined" /> */}
            </div>
            <div className='p-1 px-2 col-3'>
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Status</div>
              <Chip className={viewDetails?.status === "Solve" ? "Solve" : viewDetails?.status === "Open" ? "Open" : "Pending"} label={viewDetails?.status} variant="outlined" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  </>
}