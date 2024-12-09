import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Avatar, Chip } from '@mui/material';
import AddHomeIcon from '@mui/icons-material/AddHome';
import PersonIcon from '@mui/icons-material/Person';
import ThreePIcon from '@mui/icons-material/ThreeP';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import apiHelper from '../../../../Common/ApiHelper';
import Path from '../../../../Common/Path';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from '../../../../Component/Loader/Loader';


const action = {
  View: <button className='btn text-primary mx-1'>
    <VisibilityIcon style={{ fontSize: "18px" }} />
  </button>
}


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

export default function MaintenanceTable({ userInfo }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const handleClose = () => setOpen(false);
  const [BillDetails, setBillDetails] = useState([])
  const [MaintenanceDetails, setMaintenanceDetails] = useState({});

  async function getBillDetails() {
    try {
      setisLoading(true)
      const result = await apiHelper.completedMaintenance(userInfo?.societyData?._id)
      setBillDetails(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  const handleOpen = async (id) => {
    const result = await apiHelper.getMaintenanceDetailsByMember(id)
    setMaintenanceDetails(result?.data?.data)
    setOpen(true)
  };

  useEffect(() => {
    getBillDetails()
  }, [])


  const downloadInvoice = () => {
    const invoiceContent = document.getElementById("invoice-content");

    const ownerName = MaintenanceDetails?.memberId?.userId?.fullName || "Owner";
    const dueDate = MaintenanceDetails?.maintenanceId?.dueDate?.split("T")[0] || "Date";
    const fileName = `${ownerName}_${dueDate}_Invoice.pdf`;

    html2canvas(invoiceContent, { scale: 2 }).then(canvas => {
      const pdf = new jsPDF("p", "pt", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    });
  };



  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Maintenance Invoices</div>
        <div>
          {/* <button className='btn btn_primary fw-bold' onClick={() => navigate(Path.MemberRegister)} ><AddBoxIcon /> Add New Resident details</button> */}
        </div>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
          <TableHead style={{ background: "aliceblue" }}>
            <TableRow>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Invoice ID</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Bill Date</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Payment Date</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Maintenance Amount</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Penalty Amount</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Payment Method</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <TableBody>
              {BillDetails && BillDetails.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>{row?._id}</TableCell>
                  <TableCell align="center">{row?.maintenanceId?.dueDate?.split("T")[0]}</TableCell>
                  <TableCell align="center">{row.paymentDate?.split("T")[0]}</TableCell>
                  <TableCell align="center" className='text-success fw-bold'>₹ {row.amount}</TableCell>
                  <TableCell align="center" className='text-danger fw-bold'>₹ {row.penaltyAmount}</TableCell>
                  <TableCell align="center"><Chip className={row?.paymentMethod === "Online" ? "Online" : row?.paymentMethod === "Cash" ? "Cash" : ""} label={row?.paymentMethod === "Online" ? <><QrCodeScannerIcon />&nbsp;{row?.paymentMethod}</> : row?.paymentMethod === "Cash" ? <><CurrencyRupeeIcon />&nbsp;{row?.paymentMethod}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center"><span onClick={() => {
                    handleOpen(row?._id)
                  }}>{action.View}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>)}
        </Table>
      </TableContainer>
    </Paper>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div id="invoice-content">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Maintenance Invoices
          </Typography>
          <Typography id="invoice-content" sx={{ mt: 2 }}>
            <Paper elevation={5} style={{ background: 'whitesmoke', padding: '10px' }}>
              <div className="my-2">
                <div className="text-muted">Invoice Id</div>
                <div className="">{MaintenanceDetails?._id}</div>
              </div>
              <div className="d-flex justify-content-between my-2">
                <div className="">
                  <div className="text-muted">Bill Date</div>
                  <div className="">{MaintenanceDetails?.maintenanceId?.dueDate?.split("T")[0]}</div>
                </div>
                <div className="">
                  <div className="text-muted text-end">Payment Date</div>
                  <div className="text-end">{MaintenanceDetails?.paymentDate?.split("T")[0]}</div>
                </div>
              </div>
              <div className="my-2">
                <div className="">Owner Name</div>
                <div className="">{MaintenanceDetails?.memberId?.userId?.fullName}</div>
              </div>
              <div className="my-2">
                <div className="text-muted">Phone Number</div>
                <div className="">{MaintenanceDetails?.memberId?.userId?.phoneNumber}</div>
              </div>
              <div className="my-2">
                <div className="text-muted">Email</div>
                <div className="">{MaintenanceDetails?.memberId?.userId?.email}</div>
              </div>
            </Paper>
            <Paper elevation={5} style={{ background: 'whitesmoke', padding: '10px', marginTop: '12px' }}>
              <div className="d-flex justify-content-between">
                <div className="">Maintenance Amount</div>
                <div className="text-success">₹ {MaintenanceDetails?.amount}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="">Penalty</div>
                <div className="text-danger">₹ {MaintenanceDetails?.penaltyAmount}</div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div className="">Grand Total</div>
                <div className="fw-bold">₹ {MaintenanceDetails?.amount + MaintenanceDetails?.penaltyAmount}</div>
              </div>
            </Paper>
            <div className="d-flex justify-content-center mt-3">
              <button onClick={downloadInvoice} className="btn btn_primary w-100"><ArrowDownwardIcon /> Download Invoice</button>
            </div>
          </Typography>
        </div>
      </Box>
    </Modal>



  </>
}