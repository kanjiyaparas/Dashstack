import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Avatar, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Slide } from '@mui/material';
import AddHomeIcon from '@mui/icons-material/AddHome';
import PersonIcon from '@mui/icons-material/Person';
import ThreePIcon from '@mui/icons-material/ThreeP';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from 'react';
import apiHelper from '../../Common/ApiHelper';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Loader from '../../Component/Loader/Loader';

// const Edit = <button className='btn text-success mx-1'>
//   <EditIcon style={{ fontSize: "18px" }} />
// </button>
// const view = <button className='btn text-primary mx-1'>
//   <VisibilityIcon style={{ fontSize: "18px" }} />
// </button>

const action = {
  Edit: <button className='btn text-success mx-1'>
    <EditIcon style={{ fontSize: "18px" }} />
  </button>,
  View: <button className='btn text-primary mx-1'>
    <VisibilityIcon style={{ fontSize: "18px" }} />
  </button>
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function ResidentScreen({ userInfo }) {
  const [isLoading, setIsLoading] = useState(false)
  const [Member, setMember] = useState([])
  const [open, setOpen] = useState(false);
  const [viewDetails, setviewDetails] = useState({})
  const navigate = useNavigate()

  const [widthStyle, setWidthStyle] = useState(0);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthStyle(window.innerWidth)
    })
  }, [window.innerWidth]);

  const handleClose = () => {
    setOpen(false);
  };

  async function getMember() {
    try {
      setIsLoading(true)
      const result = await apiHelper.listMember(userInfo?.societyData?.selectSociety)
      setMember(result.data.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }

  async function handleView(data) {
    try {
      console.log(data);

      let result = await apiHelper.imageDetails({
        aadharBack: data?.aadharBack,
        aadharFront: data?.aadharFront,
        agreement: data?.agreement,
        veraBill: data?.veraBill,
      })
      result = result.data.data
      let images = []
      console.log(result);
      images.push({ name: result?.aadharBack?.display_name, size: result?.aadharBack?.bytes })
      images.push({ name: result?.aadharFront?.display_name, size: result?.aadharFront?.bytes })
      images.push({ name: result?.agreement?.display_name, size: result?.agreement?.bytes })
      images.push({ name: result?.veraBill?.display_name, size: result?.veraBill?.bytes })

      setviewDetails({
        profileImage: data?.profileImage,
        fullName: data?.userId?.fullName,
        email: data?.userId?.fullName,
        wing: data?.wing?.wingName,
        unit: data?.unit?.unitNumber,
        age: data?.age,
        gender: "Male",
        member: data?.familyMember,
        vehicle: data?.vehicle,
        dolcuments: [...images],
        ownerInfo: data?.OwnerInfo ? {
          name: data?.OwnerInfo?.fullName,
          phone: data?.OwnerInfo?.phoneNumber,
          address: data?.OwnerInfo?.address,
        } : null,
      })
      setOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMember()
  }, []);

  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Resident Tenant and Owner Details</div >
        <div>
          <button className='btn btn_primary fw-bold' onClick={() => navigate("/member/register")} ><AddBoxIcon /> Add New Resident details</button>
        </div>
      </div >
      <TableContainer>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
            <TableHead style={{ background: "aliceblue" }}>
              <TableRow>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Full Name</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Status</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Resident Status</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Phone Number</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Member</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Vehicle</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Member && Member.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className='d-flex align-items-center justify-content-evenly'>
                    <Avatar alt="Remy Sharp" src={row.profileImage} /> <span>  {row.userId?.fullName}</span>
                  </TableCell>
                  <TableCell align="center"><span style={{ background: "lightblue", borderRadius: "50%", padding: "3px 5px" }}>{row.wing?.wingName}</span>&nbsp;{row.unit?.unitNumber}</TableCell>
                  <TableCell align="center"> <Chip className={row.unitStatus === "Occupied" ? "Occupied" : "Vacant"} label={row.unitStatus === "Occupied" ? <><BeenhereIcon />&nbsp;{row.unitStatus}</> : <><AddHomeIcon />&nbsp;{row.unitStatus}</>} variant="outlined" /></TableCell>
                  <TableCell align="center"> <Chip className={row.residentStatus === "Owner" ? "Owner" : row.residentStatus === "Tenant" ? "Tenant" : ""} label={row.residentStatus === "Owner" ? <><PersonIcon />&nbsp;{row.residentStatus}</> : row.residentStatus === "Tenant" ? <><ThreePIcon />&nbsp;{row.residentStatus}</> : "--"} variant="outlined" /></TableCell>
                  <TableCell align="center">{row.userId?.phoneNumber}</TableCell>
                  <TableCell align="center"><span style={{ background: "lightgrey", borderRadius: "50%", padding: "5px 8px" }}>{row.familyMember?.length}</span></TableCell>
                  <TableCell align="center"><span style={{ background: "lightgrey", borderRadius: "50%", padding: "5px 8px" }}>{row.vehicle?.length}</span></TableCell>
                  <TableCell align="center">
                    <span onClick={() => navigate("/member/update/" + row._id)}>{action.Edit}</span>
                    <span onClick={() => handleView(row)}>{action.View}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper >

    {/* View Details Dialog */}
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            borderRadius: '16px 0 0 16px', // Set the border radius here
            height: "100vh",
            width: "27vw",
            margin: "0px",
            position: "absolute",
            right: "0",
            maxHeight: "100vh",
            background: "#EDEDED",
          },
        }}>
        <DialogTitle className="" style={{ fontSize: "18px" }}>View Owner Details</DialogTitle>
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
        <DialogContent style={{ overflow: "scroll", scrollbarWidth: "none" }}>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <label htmlFor="file">
              <Avatar style={{ width: "75px", height: "75px" }} alt="" src={viewDetails?.profileImage || "/static/images/avatar/1.jpg"} />
            </label>
            <div className="d-flex flex-column justify-content-center align-items-center mt-2">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>{viewDetails?.fullName}</div>
              <div className='p-0 m-0' style={{ fontSize: "14px", color: "#4F4F4F" }}>{viewDetails?.email}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className='p-3' style={{ background: "#FFFFFF", borderRadius: "16px" }}>
              <div className='d-flex justify-content-between align-items-center'>
                <div style={{ fontWeight: 600 }}>Wing</div>
                <div style={{ color: "#4F4F4F" }} >{viewDetails?.wing}</div>
              </div>
              <hr className='p-0 my-2' />
              <div className='d-flex justify-content-between align-items-center'>
                <div style={{ fontWeight: 600 }}>Unit</div>
                <div style={{ color: "#4F4F4F" }} >{viewDetails?.unit}</div>
              </div>
              <hr className='p-0 my-2' />
              <div className='d-flex justify-content-between align-items-center'>
                <div style={{ fontWeight: 600 }}>Age</div>
                <div style={{ color: "#4F4F4F" }} >{viewDetails?.age}</div>
              </div>
              <hr className='p-0 my-2' />
              <div className='d-flex justify-content-between align-items-center'>
                <div style={{ fontWeight: 600 }}>Gender</div>
                <div style={{ color: "#4F4F4F" }} >{viewDetails?.gender}</div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className='p-3' style={{ background: "#FFFFFF", borderRadius: "16px" }}>
              <div style={{ fontWeight: 600 }}>Documnets</div>
              <div className="d-flex align-items-center justify-content-center pt-2">
                <div style={{ width: "100%" }}>
                  <div className="mem_docs">
                    {viewDetails?.dolcuments?.map((data, i) => (
                      <div key={i} className="d-flex align-items-center p-1 gap-1 mb-2" style={{ border: "2px solid  grey", borderRadius: '5px' }}>
                        <div className="logo p-2">
                          <InsertPhotoIcon className="text-primary" />
                        </div>
                        <div className="path">
                          <div style={{ fontSize: '12px' }}>{data?.name}</div>
                          <div style={{ fontSize: '12px' }} className="text-muted">{(data?.size / 1024).toFixed(2)} KB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            viewDetails?.ownerInfo && viewDetails?.ownerInfo !== null ? (
              <div className="mt-3">
                <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey" }}>
                  <div className="w-100" style={{ width: "100%" }}>
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>Owner Details</div>
                    </div>
                    <div className="p-3">
                      <div className='p-2 px-3' style={{ background: "#FFFFFF", borderRadius: "16px", fontSize: "14px" }}>
                        <div className='d-flex justify-content-between align-items-center'>
                          <div style={{ fontWeight: 600 }}>Name</div>
                          <div style={{ color: "#4F4F4F" }} >{viewDetails?.ownerInfo?.name}</div>
                        </div>
                        <hr className='p-0 my-2' />
                        <div className='d-flex justify-content-between align-items-center'>
                          <div style={{ fontWeight: 600 }}>Phone</div>
                          <div style={{ color: "#4F4F4F" }} >{viewDetails?.ownerInfo?.phone}</div>
                        </div>
                        <hr className='p-0 my-2' />
                        <div className='d-flex justify-content-between align-items-center'>
                          <div style={{ fontWeight: 600 }}>Address</div>
                          <div style={{ color: "#4F4F4F" }} >{viewDetails?.ownerInfo?.address?.length > 15 ? `${viewDetails?.ownerInfo?.address?.slice(0, 25)}...` : viewDetails?.ownerInfo?.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : ""
          }
          <div className="mt-3">
            <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey" }}>
              <div className="w-100" style={{ width: "100%" }}>
                <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                  <div>Member Counting</div>
                  <div>{viewDetails?.member?.length}</div>
                </div>
                <div className="p-2">
                  {viewDetails?.member?.map((data, i) => (
                    <div key={i} className='p-2 px-3 m-2 my-3' style={{ background: "#FFFFFF", borderRadius: "16px", fontSize: "14px" }}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>First Name</div>
                        <div style={{ color: "#4F4F4F" }} >{data.fullName}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Phone</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.phoneNumber}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Age</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.age}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Gender</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.gender}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Relation</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.relation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey" }}>
              <div className="w-100" style={{ width: "100%" }}>
                <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                  <div>Vehicle Counting</div>
                  <div>{viewDetails?.vehicle?.length}</div>
                </div>
                <div className="p-2">
                  {viewDetails?.vehicle?.map((data, i) => (
                    <div key={i} className='p-2 px-3 m-2 my-3' style={{ background: "#FFFFFF", borderRadius: "16px", fontSize: "14px" }}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Vehicle Name</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.vehicleName}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Vehicle Number</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.vehicleNumber}</div>
                      </div>
                      <hr className='p-0 my-2' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <div style={{ fontWeight: 600 }}>Vehicle Type</div>
                        <div style={{ color: "#4F4F4F" }} >{data?.vehicleType === "Two Wheeler" ? "Two Wheeler" : "Four Wheeler"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  </>
}