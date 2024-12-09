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
// import Razorpay from 'razorpay';

const key = "rzp_test_oYzCquEuAY3r9N"; // Replace with your actual Razorpay Key ID


// import { QrCodeScanner as QrCodeScannerIcon } from '@mui/icons-material';



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

export default function MaintenanceInvoices({ userInfo, societyId, getNotification }) {
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()
  const [Details, setDetails] = useState({});
  const [dueMaintenance, setdueMaintenance] = useState([])
  const [pendingMaintenance, setpendingMaintenance] = useState([])
  const [Paymentopen, setPaymentOpen] = useState(false);
  const [paymentMethod, setpaymentMethod] = useState("");
  const [expireDate, setexpireDate] = useState("");
  const [Maintenance, setMaintenance] = useState([])

  const handlePaymentClose = () => {
    setpaymentMethod()
    setPaymentOpen(false);
  }

  function calculateTotalDonePayment(data) {
    return data
      .filter((item) => item.paymentStatus === "Done") // Filter records with paymentStatus "Done"
      .reduce((total, item) => total + item.amount, 0); // Calculate total
  }

  // Get the total maintenance amount
  const totalDonePayment = calculateTotalDonePayment(Maintenance);


  async function getMember() {
    try {
      const result = await apiHelper.getMemberById(userInfo?.societyData?._id)
      setDetails(result.data.data)
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

  async function getpendingMaintenance() {
    try {
      setisLoading(true)
      const result = await apiHelper.pendingMaintenance(userInfo?.societyData?._id)
      setpendingMaintenance(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }
  async function getdueMaintenance() {
    try {
      const result = await apiHelper.dueMaintenance(userInfo?.societyData?._id)
      setdueMaintenance(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMember()
    getdueMaintenance()
    getpendingMaintenance()
    getMaintenance()
  }, [])
  const [maintenancedetailsId, setmaintenancedetailsId] = useState('');

  const handlePayNow = async (id) => {
    try {
      if (dueMaintenance.length > 0) {
        let amount = dueMaintenance?.find((item) => item._id === id)
        setmaintenancedetailsId(id)
      } else if (pendingMaintenance.length > 0) {
        let amount = pendingMaintenance?.find((item) => item._id === id)
        setmaintenancedetailsId(id)
      }

      const orderResponse = await apiHelper.getMaintenanceDetailsByMember(id);

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
        description: "Pay your society maintenance fees",
        order_id: razorpayOrderId, // Razorpay order ID from backend
        handler: async function (response) {
          // On successful payment, verify the payment with the server
          try {
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              maintenanceId: id, // ID of the maintenance being paid
              memberId: userInfo?.societyData?._id, // Current user's member ID
              paymentDate: new Date(), // Current date for payment
            };

            const verifyResponse = await apiHelper.verifyPayment(verificationData);

            if (verifyResponse.status === 200) {
              alert("Payment successful and verified!");
              getdueMaintenance()
              getpendingMaintenance()
              getNotification()
              navigate(Path.maintenanceInvoices)
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

      console.log(options)
      const razorpay = new window.Razorpay(options);
      console.log(razorpay);
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
    <Paper>
      <div className="row d-flex align-items-center">
        <div className="col-12 col-lg-4 my-lg-0 my-2">
          <div className="fw-bold ms-4" style={{ fontSize: "14px" }}>Show Maintenance Details</div>
        </div>
        <div className="col-12 col-lg-8 d-flex justify-content-md-end justify-content-center">
          <div className='d-flex row'>
            <div className="col-12 col-md-6">
              <Paper className='py-3 pe-3 d-flex custom-section' style={{ borderRadius: '8px', width: "200px", }} elevation={10}>
                <div style={{ background: "green", width: "5px", height: "40px", borderTopRightRadius: "5px", borderEndEndRadius: "5px", marginRight: "10px", marginTop: "10px" }}>
                </div>
                <div>
                  <div className="h6 fw-bold" style={{ fontSize: '13px' }}>Maintenance Amount</div>
                  <div className="h4 text-success my-2 fw-bold">₹ {totalDonePayment}</div>
                </div>
              </Paper>
            </div>
            <div className="col-12 col-md-6">
              <Paper className='py-3 pe-3 d-flex custom-section2' style={{ borderRadius: '8px', width: "200px" }} elevation={5}>
                <div style={{ background: "red", width: "5px", height: "40px", borderTopRightRadius: "5px", borderEndEndRadius: "5px", marginRight: "10px", marginTop: "10px" }}>
                </div>
                <div>
                  <div className="h6 fw-bold" style={{ fontSize: '13px', color: "red" }}>Panelty Amount</div>
                  <div className="h4 text-danger my-2 fw-bold">₹ 0</div>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </Paper>
    <Paper elevation={5} className="my-2 p-2">
      <div className="d-flex justify-content-between">
        <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Pending Maintanance</div>
        <div onClick={() => navigate(Path.tableMaintenanceInvoices)} className="btn btn_primary">View Invoice</div>
      </div>
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
        <div className="row">
          {
            pendingMaintenance?.map((item) => {
              return <div className="col-12 col-md-6 col-lg-3 my-2">
                <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                  <div className="w-100">
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>Maintenance</div>
                      <div className="btn btn-primary text-white">{item?.paymentStatus}</div>
                    </div>
                    <div className="p-2">
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Bill Date:</div>
                        <div>{item?.paymentDate?.split("T")[0]}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Pending Date</div>
                        <div>{item?.maintenanceId?.dueDate}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Maintanance Amount</div>
                        <div className="text-danger"> ₹ {item?.amount}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Penalty Amount</div>
                        <div className="text-danger">₹ {item?.penaltyAmount}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted fw-bold">Grand Total</div>
                        <div className="fw-bold text-success">₹ {item?.penaltyAmount + item?.penaltyAmount}</div>
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
    <Paper elevation={5} className="my-2 p-2">
      <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Due Maintanance</div>
      <div className="row">
        {
          dueMaintenance?.map((item) => {
            return <div className="col-12 col-md-6 col-lg-3 my-2">
              <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                <div className="w-100">
                  <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                    <div>Maintenance</div>
                    <div className="btn btn-primary text-white">{item?.paymentStatus}</div>
                  </div>
                  <div className="p-2">
                    <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                      <div className="text-muted">Bill Date:</div>
                      <div>{item?.paymentDate?.split("T")[0]}</div>
                    </div>
                    <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                      <div className="text-muted">Amount</div>
                      <div className="text-danger"> ₹ {item?.amount}</div>
                    </div>
                    <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                      <div className="text-muted">Due Penalty Amount</div>
                      <div className="text-danger">₹ {item?.maintenanceId?.penaltyAmount}</div>
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
      </div>
    </Paper>

  </>
}