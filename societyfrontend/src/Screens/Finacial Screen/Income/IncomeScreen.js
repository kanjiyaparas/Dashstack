import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ThreePIcon from '@mui/icons-material/ThreeP';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VerifiedIcon from '@mui/icons-material/Verified';
import TimerIcon from '@mui/icons-material/Timer';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import apiHelper from '../../../Common/ApiHelper';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useSnackbar } from "notistack";
import Loader from '../../../Component/Loader/Loader';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function IncomeScreen({ societyId }) {
  const action = (row) => ({
    Edit: (
      <button
        className="btn text-success mx-1"
        onClick={() => {
          cashPaymentHandler(row)
        }}
      >
        {
          row?.paymentStatus === "Done" ? <VerifiedIcon style={{ fontSize: "18px" }} /> : <EditIcon style={{ fontSize: "18px" }} />
        }
      </button>
    ),
    View: (
      <button
        className="btn text-primary mx-1"
        onClick={() => handleClickOpen(row)}
      >
        <VisibilityIcon style={{ fontSize: "18px" }} />
      </button>
    )
  });

  const [isLoading, setisLoading] = useState(false);
  const [incomeType, setincomeType] = useState("Maintenance")
  const [open, setOpen] = useState(false);
  const [detailsOpen, setdetailsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()
  const [viewDetails, setviewDetails] = useState({
    profileImage: "/static/images/avatar/1.jpg",
    name: "Cody Fisher",
    date: "Feb 10, 2024",
    wing: "A",
    unit: "1001",
    residentStatus: "Owner",
    amount: "1000",
    penalty: "500",
    paymentStatus: "Pending",
    PaymentMethod: "Online"
  });
  // const [date, setDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [maintenanceDetails, setmaintenanceDetails] = useState({
    maintenanceAmount: 0,
    penaltyAmount: 0,
    dueDate: "",
    dueDays: "0",
  })
  const [Maintenance, setMaintenance] = useState([])
  // const [eventData, seteventData] = useState([])
  const navigate = useNavigate()

  const handleDailogClose = () => {
    setOpen(false);
  };

  function calculateTotalDonePayment(data) {
    return data
      .filter((item) => item.paymentStatus === "Done") // Filter records with paymentStatus "Done"
      .reduce((total, item) => total + item.amount, 0); // Calculate total
  }

  // Get the total maintenance amount
  const totalDonePayment = calculateTotalDonePayment(Maintenance);



  const createMaintenance = async () => {
    try {
      console.log(maintenanceDetails);
      await apiHelper.createMaintenance({ ...maintenanceDetails, societyId: societyId })
      enqueueSnackbar('Event Add Succesfully!', { variant: 'success' })
      getMaintenance()
    } catch (error) {
      console.log(error)
    }
  }

  const getMaintenance = async () => {
    try {
      setisLoading(true)
      const result = await apiHelper.listMaintenance(societyId)
      console.log(result?.data?.data);
      setMaintenance(result?.data?.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  const handleClickOpen = (data) => {
    setviewDetails({
      profileImage: data?.memberId?.profileImage,
      name: data?.memberId?.userId?.fullName,
      date: data?.maintenanceId?.dueDate?.split("T")[0],
      wing: data?.memberId?.wing?.wingName,
      unit: data?.memberId?.unit?.unitNumber,
      residentStatus: data?.memberId?.residentStatus,
      amount: data?.amount,
      penalty: data?.penaltyAmount,
      paymentStatus: data?.paymentStatus,
      PaymentMethod: data?.paymentMethod
    })
    setdetailsOpen(true);
  };
  const handleClose = () => {
    setdetailsOpen(false);
  };

  useEffect(() => {
    getMaintenance()
  }, [])


  async function cashPaymentHandler(row) {
    try {
      const data = {
        societyId: societyId,
        maintenanceId: row?.maintenanceId?._id,
        memberId: row?.memberId?._id
      }
      const result = await apiHelper.updateMaintenanceDetails(data)
      if (result.data.message === "Success") {
        getMaintenance()
      }
    } catch (error) {
      console.log(error);
    }
  }

  return <>
    <Paper className='d-flex justify-content-between align-items-center my-3 p-2 bg-light' elevation={1}>
      <div className='d-flex gap-3'>
        <Paper className='py-3 pe-3 d-flex custom-section' style={{ borderRadius: '8px', width: "250px", }} elevation={10}>
          <div style={{ background: "green", width: "5px", height: "40px", borderTopRightRadius: "5px", borderEndEndRadius: "5px", marginRight: "10px", marginTop: "10px" }}>
          </div>
          <div>
            <div className="h6 fw-bold" style={{ fontSize: '14px' }}>Maintenance Amount</div>
            <div className="h4 text-success my-2 fw-bold">₹ {totalDonePayment}</div>
          </div>
        </Paper>
        <Paper className='py-3 pe-3 d-flex custom-section' style={{ borderRadius: '8px', width: "250px" }} elevation={5}>
          <div style={{ background: "red", width: "5px", height: "40px", borderTopRightRadius: "5px", borderEndEndRadius: "5px", marginRight: "10px", marginTop: "10px" }}>
          </div>
          <div>
            <div className="h6 fw-bold" style={{ fontSize: '14px' }}>Panelty Amount</div>
            <div className="h4 text-danger my-2 fw-bold">₹ 0</div>
          </div>
        </Paper>
      </div>
      <div>
        <button className='btn btn_primary fw-bold' onClick={() => setOpen(true)} ><AddBoxIcon /> Set Maintenance</button>
      </div>
    </Paper>
    <Paper elevation={5} className="d-flex" style={{ width: "fit-content" }}>
      <button onClick={() => setincomeType("Maintenance")} className={incomeType === "Maintenance" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Maintenance</button>
      <button onClick={() => navigate("/finacial/event")} className={incomeType === "Other" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Other Income</button>
    </Paper>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Maintenance  Details</div>
      </div>
      <TableContainer>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
            <TableHead style={{ background: "aliceblue" }}>
              <TableRow>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Name</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Date</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Status</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Phone Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Amount</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Penalty</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">status</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Payment</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Maintenance.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" className='d-flex align-items-center justify-content-evenly'>
                    <Avatar alt={row.name} src={row.memberId?.profileImage} /> <span>{row.memberId?.fullName}</span>
                  </TableCell>
                  <TableCell align="center"><span style={{ background: "lightblue", borderRadius: "50%", padding: "3px 5px" }}>{row.memberId?.wing?.wingName}</span>&nbsp;{row.memberId?.unit?.unitNumber}</TableCell>
                  <TableCell align="center">{row.maintenanceId?.dueDate?.split("T")[0]}</TableCell>
                  <TableCell align="center"> <Chip className={row.memberId?.residentStatus === "Owner" ? "Owner" : row.memberId?.residentStatus === "Tenant" ? "Tenant" : ""} label={row.memberId?.residentStatus === "Owner" ? <><PersonIcon />&nbsp;{row.memberId?.residentStatus}</> : row.memberId?.residentStatus === "Tenant" ? <><ThreePIcon />&nbsp;{row.memberId?.residentStatus}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center">{row.memberId?.userId?.phoneNumber}</TableCell>
                  <TableCell align="center">{row?.amount}</TableCell>
                  <TableCell align="center">{row?.penaltyAmount}</TableCell>
                  <TableCell align="center"> <Chip className={row?.paymentStatus === "Done" ? "Paid" : row?.paymentStatus === "Pending" ? "Pending" : "Empty"} label={row?.paymentStatus === "Done" ? <><VerifiedIcon />&nbsp;{row?.paymentStatus}</> : row?.paymentStatus === "Pending" ? <><TimerIcon />&nbsp;{row?.paymentStatus}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center"> <Chip className={row?.paymentMethod === "Online" ? "Online" : row?.paymentMethod === "Cash" ? "Cash" : "Empty"} label={row?.paymentMethod === "Online" ? <><QrCodeScannerIcon />&nbsp;{row?.paymentMethod}</> : row?.paymentMethod === "Cash" ? <><CurrencyRupeeIcon />&nbsp;{row?.paymentMethod}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center">
                    <span>{action(row).Edit}</span>
                    <span>{action(row).View}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "450px"
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "24px" }}>Add Maintenance Detail</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className='d-flex justify-content-between align-items-center w-100'>
            <div className='my-2' style={{ width: "47%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="date">Maintenance Amount</label>
              <TextField
                className="w-100"
                id="maintenance_amount"
                placeholder="Amount"
                variant="outlined"
                fullWidth
                margin="dense"
                type="number"
                onChange={(e) => setmaintenanceDetails({ ...maintenanceDetails, maintenanceAmount: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                  '& input[type=number]': {
                    // Hide the arrows for number input on most modern browsers
                    MozAppearance: 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <span style={{ fontWeight: 'bold' }}>₹</span>
                  </InputAdornment>,
                }}
              />
            </div>
            <div className='my-2' style={{ width: "47%" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="date">Penalty Amount</label>
              <TextField
                className="w-100"
                id="penalty_amount"
                placeholder="Amount"
                variant="outlined"
                fullWidth
                margin="dense"
                type="number"
                onChange={(e) => setmaintenanceDetails({ ...maintenanceDetails, penaltyAmount: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                  '& input[type=number]': {
                    // Hide the arrows for number input on most modern browsers
                    MozAppearance: 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <span style={{ fontWeight: 'bold' }}>₹</span>
                  </InputAdornment>,
                }}
              />
            </div>
          </div>
          <div className="d-flex flex-column" style={{ width: "100%" }}>
            <label className='my-2' style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="date">Due Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dueDate}
                onChange={(newValue) => {
                  setmaintenanceDetails({
                    ...maintenanceDetails,
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
            </LocalizationProvider>
          </div>
          <div className="my-2 mt-3" style={{ width: "100%" }}>
            <label className='mb-3' style={{ fontSize: "14px", fontWeight: "bold" }} htmlFor="phoneNumber">Select Penalty Applied After Day Selection</label>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Select</InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={maintenanceDetails.dueDays}
                placeholder="Society"
                onChange={(e) => setmaintenanceDetails({ ...maintenanceDetails, dueDays: e.target.value })}
              >
                {/* {
                  SocietyList && SocietyList.map((item) => {
                    return <MenuItem value={item._id}>{item.societyName}</MenuItem>
                  })
                } */}
                <MenuItem value="0">Select Day</MenuItem>
                <MenuItem value="1">1 Day</MenuItem>
                <MenuItem value="2">2 Day</MenuItem>
                <MenuItem value="3">3 Day</MenuItem>
                <MenuItem value="4">4 Day</MenuItem>
                <MenuItem value="5">5 Day</MenuItem>
                <MenuItem value="6">6 Day</MenuItem>
                <MenuItem value="7">7 Day</MenuItem>
                <MenuItem value="8">8 Day</MenuItem>
                <MenuItem value="9">9 Day</MenuItem>
                <MenuItem value="10">10 Day</MenuItem>
                <MenuItem value="11">11 Day</MenuItem>
                <MenuItem value="12">12 Day</MenuItem>
                <MenuItem value="13">13 Day</MenuItem>
                <MenuItem value="14">14 Day</MenuItem>
                <MenuItem value="15">15 Day</MenuItem>
              </Select>
            </FormControl>
          </div>

        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={createMaintenance} style={{ width: "45%" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    {/* Details dialog */}

    <React.Fragment>
      <Dialog open={detailsOpen} onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "450px"
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "18px" }}>View Maintenance Details</DialogTitle>
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
              <div style={{ fontSize: "18px", fontWeight: "600" }}>{viewDetails?.name}</div>
              <div className='p-0 m-0' style={{ color: "#A7A7A7" }}>{viewDetails.date}</div>
            </div>
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
              <Chip className={viewDetails?.residentStatus === "Owner" ? "Owner" : viewDetails?.residentStatus === "Tenant" ? "Tenant" : ""} label={viewDetails?.residentStatus === "Owner" ? <><PersonIcon />&nbsp;{viewDetails?.residentStatus}</> : viewDetails?.residentStatus === "Tenant" ? <><ThreePIcon />&nbsp;{viewDetails?.residentStatus}</> : "--"} variant="outlined" />
            </div>
            <div className='p-1 px-2 col-3'>
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Amount</div>
              <div className='text-center' style={{ color: "#39973D" }}>₹ {viewDetails.amount}</div>
            </div>
          </div>
          <div className="d-flex align-items-center row mt-3">
            <div className="p-1 px-2 col-4 with-line text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Penalty</div>
              <Chip className={viewDetails.penalty === "" ? "px-3" : "penalty px-3"}
                label={viewDetails.penalty === "" ? "--" : viewDetails.penalty}
              />
            </div>
            <div className="p-1 px-2 col-4 with-line text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Status</div>
              <Chip className={viewDetails?.paymentStatus === "Paid" ? "Paid" : viewDetails?.paymentStatus === "Pending" ? "Pending" : "Empty"} label={viewDetails?.paymentStatus === "Paid" ? <><VerifiedIcon />&nbsp;{viewDetails?.paymentStatus}</> : viewDetails?.paymentStatus === "Pending" ? <><TimerIcon />&nbsp;{viewDetails?.paymentStatus}</> : "--"} variant="outlined" />
            </div>
            <div className="p-1 px-2 col-4 text-center">
              <div className='text-center pb-1' style={{ color: "#A7A7A7" }}>Payment</div>
              <Chip className={viewDetails?.PaymentMethod === "Online" ? "Online" : viewDetails?.PaymentMethod === "Cash" ? "Cash" : "Empty"} label={viewDetails?.PaymentMethod === "Online" ? <><QrCodeScannerIcon />&nbsp;{viewDetails?.PaymentMethod}</> : viewDetails?.PaymentMethod === "Cash" ? <><CurrencyRupeeIcon />&nbsp;{viewDetails?.PaymentMethod}</> : "--"} variant="outlined" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  </>
}