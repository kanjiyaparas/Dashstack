import { useEffect, useState } from "react"
import apiHelper from "../../../Common/ApiHelper"
import { Paper, TextField } from "@mui/material";
import Path from "../../../Common/Path";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { styled } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { QRCodeCanvas } from 'qrcode.react';
import Loader from "../../../Component/Loader/Loader";

const key = "rzp_test_oYzCquEuAY3r9N";

const OrangeRadio = styled('input')({
  '&:checked': {
    accentColor: '#FE512E', // Orange color for the checked state
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

export default function OtherIncomeInvoice({ userInfo, societyId, getNotification }) {
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()
  const [Details, setDetails] = useState({});
  const [Event, setEvent] = useState([])

  async function getMember() {
    try {
      const result = await apiHelper.listMember(userInfo?.societyData?.societyId)
      setDetails(result.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function getEventlist() {
    try {
      setisLoading(true)
      const result = await apiHelper.getEvents(userInfo?.societyData?.societyId)
      setEvent(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getMember()
    getEventlist()
  }, [])
  console.log(Event)

  const handlePayNow = async (id) => {
    try {
      const data = {
        memberId: userInfo?.societyData?._id,
        eventId: id
      }
      const orderResponse = await apiHelper.pendingEvent(data);
      console.log(orderResponse);

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
              eventId: id, // ID of the maintenance being paid
              memberId: userInfo?.societyData?._id, // Current user's member ID
              paymentDate: new Date(), // Current date for payment
            };
            console.log(verificationData);
            const verifyResponse = await apiHelper.eventverifyPayment(verificationData);

            if (verifyResponse.status === 200) {
              alert("Payment successful and verified!");
              setEvent()
              getNotification()
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
      console.log(options);

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
    <Paper elevation={5} className="my-2 p-2">
      <div className="d-flex justify-content-between">
        <div className="fw-bold my-2" style={{ fontSize: '16px' }}>Due Maintanance</div>
        <button onClick={() => navigate(Path.tableOtherInvoices)} className="btn btn_primary">View Invoice</button>

      </div>
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
        <div className="row">
          {
            Event?.map((item) => {
              return <div className="col-12 col-md-6 col-lg-3 my-2">
                <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                  <div className="w-100">
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>Maintenance</div>
                      <div className="btn btn-primary text-white">{"Pending"}</div>
                    </div>
                    <div className="p-2">
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Bill Date:</div>
                        <div>{item?.date?.split("T")[0]}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Total Amount</div>
                        <div className="text-danger"> ₹ {item?.amount}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Per Unit Amount</div>
                        <div className="text-danger">₹ {Math.floor(item?.amount / Details?.length)}</div>
                      </div>
                      <div className="d-flex justify-content-center my-2" style={{ fontSize: "14px" }}>
                        <div onClick={() => {
                          handlePayNow(item?._id)
                        }} className="btn btn_primary w-75">Pay Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </div>)}
    </Paper>

  </>
}