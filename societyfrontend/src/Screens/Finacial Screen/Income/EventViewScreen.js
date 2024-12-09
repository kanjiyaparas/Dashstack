import { Chip, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import Loader from "../../../Component/Loader/Loader";
import { useEffect, useState } from "react";
import apiHelper from "../../../Common/ApiHelper";
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import ThreePIcon from '@mui/icons-material/ThreeP';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const key = "rzp_test_oYzCquEuAY3r9N"; // Replace with your actual Razorpay Key ID

export default function EventViewScreen({ societyId, eventopen, selectedEvent, userInfo, getNotification }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedUnit("")
    setselectedWing("")
    setSelectMember({})
    setEvent({})
  };

  const [isLoading, setisLoading] = useState(false);
  const [eventdata, seteventData] = useState([])
  async function getEvent() {
    try {
      const data = {
        societyId: societyId,
        eventId: selectedEvent
      }
      console.log(data);
      const result = await apiHelper.eventParticipants(data)
      seteventData(result?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const [selectedUnit, setselectedUnit] = useState("");
  const [selectedWing, setselectedWing] = useState("");
  const [paidMessage, setpaidMessage] = useState("");
  const [wingList, setwingList] = useState([]);
  const [unitList, setunitList] = useState([]);
  const [Event, setEvent] = useState({});
  const [SelectMember, setSelectMember] = useState({});


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
    getEvent()
    getWing()
  }, [eventopen]);

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

  useEffect(() => {
    if (selectedUnit !== '') {
      getMemberByUnit()
    }
  }, [selectedUnit]);

  async function getEventByMember() {
    try {
      const data = {
        memberId: SelectMember?._id,
        eventId: selectedEvent
      }
      const result = await apiHelper.pendingEvent(data)
      if (result?.data?.data) {
        setEvent(result?.data?.data)
      } if (result?.data?.message) {
        setpaidMessage(result?.data?.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (Object.keys(SelectMember).length > 0) {
      getEventByMember()
    }
  }, [Object.keys(SelectMember).length > 0]);

  async function cashPaymentHandler() {
    try {
      const data = {
        societyId: societyId,
        eventId: selectedEvent,
        memberId: SelectMember?._id
      }
      const result = await apiHelper.updateEventDetails(data)
      if (result.data.message === "Success") {
        getEvent()
        setOpen(false)
      }
    } catch (error) {
      console.log(error);
    }
  }


  const handlePayNow = async () => {
    try {
      const orderResponse = await apiHelper.getEventDetailsById(Event?._id);

      if (!orderResponse?.data?.data) {
        alert("Failed to fetch order details. Please try again.");
        return;
      }

      const { razorpayOrderId, amount, currency } = orderResponse.data.data;

      // Debugging Logs (optional)
      console.log("Fetched Razorpay Order ID:", razorpayOrderId);
      console.log("Amount:", amount, "Currency:", currency);

      // Razorpay options
      const options = {
        key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_oYzCquEuAY3r9N", // Razorpay key
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Society Maintenance",
        description: "Pay your society event payment",
        order_id: razorpayOrderId, // Razorpay order ID from backend
        handler: async function (response) {
          // On successful payment, verify the payment with the server
          try {
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              eventId: selectedEvent, // ID of the maintenance being paid
              memberId: SelectMember?._id, // Current user's member ID
              paymentDate: new Date(), // Current date for payment
            };

            const verifyResponse = await apiHelper.eventverifyPayment(verificationData);

            if (verifyResponse.status === 200) {
              alert("Payment successful and verified!");
              getEvent()
              getNotification()
              setOpen(false)
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userInfo?.name || "John Doe",
          email: userInfo?.email || "example@gmail.com",
          contact: userInfo?.contact || "9586684761",
        },
        theme: {
          color: "#FE512E",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // razorpay.on("payment.failed", function (response) {
      //   console.error("Payment failed:", response.error);
      //   alert("Payment failed. Please try again.");
      // });
    } catch (error) {
      console.error("Error in handlePayNow:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };
  return <>
    {eventopen ? <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Event Participant</div>
        <div>
          <button className='btn btn_primary fw-bold' onClick={handleClickOpen} ><AddBoxIcon />Add Payment</button>
        </div>
      </div>
      <TableContainer>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
            <TableHead style={{ background: "aliceblue" }}>
              <TableRow>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Payment Date</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Tnant/Owner Status</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Phone Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Amount</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventdata?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center"><span style={{ background: "#FE512E", borderRadius: "50%", padding: "2px 5px", color: "white", marginRight: "5px" }}>{row?.memberId?.wing?.wingName}</span><span>{row?.memberId?.unit?.unitNumber}</span></TableCell>
                  <TableCell align="center">{row?.paymentDate?.split("T")[0]}</TableCell>
                  <TableCell align="center"><Chip className={row?.memberId?.residentStatus === "Owner" ? "Owner" : row?.memberId?.residentStatus === "Tenant" ? "Tenant" : ""} label={row?.memberId?.residentStatus === "Owner" ? <><PersonIcon />&nbsp;{row?.memberId?.residentStatus}</> : row?.memberId?.residentStatus === "Tenant" ? <><ThreePIcon />&nbsp;{row?.memberId?.residentStatus}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center">{row?.memberId?.userId?.phoneNumber}</TableCell>
                  <TableCell className="text-success fw-bold" align="center">₹ {row?.amount}</TableCell>
                  <TableCell align="center"> <Chip className={row?.paymentMethod === "Online" ? "Online" : row?.paymentMethod === "Cash" ? "Cash" : "Empty"} label={row?.paymentMethod === "Online" ? <><QrCodeScannerIcon />&nbsp;{row?.paymentMethod}</> : row?.paymentMethod === "Cash" ? <><CurrencyRupeeIcon />&nbsp;{row?.paymentMethod}</> : "--"} variant="outlined" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper > : ""}

    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Make Payment</DialogTitle>
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
            <label style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="description">Member Name<span style={{ color: "red" }}>*</span></label>
            <TextField
              disabled
              className="w-100"
              id="complainerName"
              value={SelectMember?.userId?.fullName}
              variant="outlined"
              fullWidth
              rows={3}
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply your desired border radius
                },
              }}
            />
          </div>
          {
            Event?.paymentStatus === "Done" ? <>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Payment Method :</span><span className="text-primary fw-bold">{Event?.paymentMethod}</span></div>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Amount :</span><span className="text-success fw-bold">₹ {Event?.amount}</span></div>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Payment Date :</span><span>{Event?.paymentDate?.split("T")[0]}</span></div>
              <div className="text-success mt-2" style={{ fontSize: "14px" }}>*Your event amount already paid</div>
            </> : <div className="border p-2">
              <div className="h6">Event Details</div>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Title :</span><span>{Event?.eventId?.title}</span></div>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Amount :</span><span className="text-success fw-bold">₹ {Event?.amount}</span></div>
              <div style={{ fontSize: "14px" }} className="d-flex justify-content-between"><span className="text-muted">Date :</span><span>{Event?.eventId?.date?.split("T")[0]}</span></div>
            </div>}
        </DialogContent>
        <DialogActions>
          <button className="btn btn_outline" onClick={handleClose}>Cancel</button>
          {
            Event?.paymentStatus === "Done" ? "" : <>
              <button className="btn btn_primary" onClick={handlePayNow}>Online Payment</button>
              <button className="btn btn_primary" onClick={cashPaymentHandler}>Cash Payment</button>
            </>
          }

        </DialogActions>
      </Dialog>
    </React.Fragment>
  </>
}