import { Avatar, Menu, MenuItem, Paper } from "@mui/material";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import apiHelper from "../../../Common/ApiHelper";
import Loader from "../../../Component/Loader/Loader";
const ITEM_HEIGHT = 30;

export default function PersonalDetailScreen({ userInfo }) {
  const [isLoading, setisLoading] = useState(false)
  const [menu, setMenu] = useState(null);
  const [date, setDate] = useState(null);
  const [Details, setDetails] = useState({});
  const [noteId, setNoteId] = useState(null); // Track ID of note being edited

  const handleClick = (event, note) => {
    setMenu(event.currentTarget);
    if (note) setNoteId(note.id);
  };
  const handleClose = () => setMenu(null);
  const [widthStyle, setWidthStyle] = useState(0);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthStyle(window.innerWidth)
    })
  }, [window.innerWidth]);



  const [dueMaintenance, setdueMaintenance] = useState([])
  const [pendingMaintenance, setpendingMaintenance] = useState([])

  async function getMember() {
    try {
      setisLoading(true)
      const result = await apiHelper.getMemberById(userInfo?.societyData?._id)
      setDetails(result.data.data)
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
      setisLoading(true)
      const result = await apiHelper.dueMaintenance(userInfo?.societyData?._id)
      setdueMaintenance(result.data.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getMember()
    getdueMaintenance()
    getpendingMaintenance()
  }, [])

  return <>

    <button className="btn btn_primary">{Details?.residentStatus}</button>
    <Paper className="mb-2" elevation={5}>
      <div className="row d-flex">
        <div className="col-12 col-lg-9">
          <div className="row p-2  d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-12">
              <div className="member_name d-flex justify-content-around">
                <div className="img">
                  <Avatar alt="Remy Sharp" className="img-fluid" src={Details?.profileImage} style={{ width: "80px", height: '80px' }} />
                </div>
                <div className="name mx-3 d-block d-md-none">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Full Name</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details.userId?.fullName}</div><br />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-10">
              <div className="row">
                <div className="col-lg-3 col-md-6 col-12 d-none d-md-block">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Full Name</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details.userId?.fullName}</div><br />
                </div>
                <div className="col-lg-3 col-md-6 col-12">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Phone Number</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details.userId?.phoneNumber}</div><br />
                </div>
                <div className="col-lg-3 col-md-6 col-12">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Email Address</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details?.userId?.email}</div><br />
                </div>

              </div>
              <div className="row">
                <div className="col-3">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Gender</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Male</div><br />
                </div>
                <div className="col-3">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Wing</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details?.wing?.wingName}</div>
                </div>
                <div className="col-3">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Age</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{Details?.age}</div>
                </div>
                <div className="col-3">
                  <div className="fw-bold" style={{ fontSize: '12px' }}>Unit</div>
                  <div classdive="text-muted" style={{ fontSize: '12px' }}>{Details?.unit?.unitNumber}</div><br />
                </div>

              </div>
            </div>

          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center col-12 col-lg-3">
          <div style={widthStyle > 998 ? { width: "100%" } : widthStyle > 576 ? { width: "75%" } : { width: "100%" }}>
            <div className="mem_docs">
              <div className="d-flex align-items-center p-1 gap-1" style={{ border: "2px solid  grey", borderRadius: '5px' }}>
                <div className="logo">
                  <InsertPhotoIcon className="text-primary" />
                </div>
                <div className="path">
                  <div style={{ fontSize: '12px' }}>Syncfusion Adharcard Front Side.JPG</div>
                  <div style={{ fontSize: '12px' }} className="text-muted">3.5M</div>
                </div>
              </div><br />
              <div className="d-flex align-items-center p-1 gap-1" style={{ border: "2px solid  grey", borderRadius: '5px' }}>
                <div className="logo">
                  <InsertPhotoIcon className="text-primary" />
                </div>
                <div className="path">
                  <div style={{ fontSize: '12px' }}>Address Proof Front Side.PDF</div>
                  <div style={{ fontSize: '12px' }} className="text-muted">3.5M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Paper>

    <Paper className="my-2 p-2" elevation={5}>
      <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Member : ({Details?.familyMember?.length})</div>
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
        <div className="row">
          {
            Details?.familyMember?.map((item) => {
              return <div className="col-12 col-md-6 col-lg-3 my-2">
                <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                  <div className="w-100">
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>{item?.fullName}</div>
                      <Button
                        aria-label="more"
                        onClick={(event) => handleClick(event, "data")}
                        sx={{ backgroundColor: '#ffffff', minWidth: '0px', color: "#5678E9", padding: "3px" }}
                      >
                        <MoreVertIcon sx={{ fontSize: "18px" }} />
                      </Button>
                      <Menu
                        anchorEl={menu}
                        open={Boolean(menu)}
                        onClose={handleClose}
                        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: '10ch' } }}
                      >
                        <MenuItem onClick={""}>Edit</MenuItem>
                        <MenuItem onClick={""}>Delete</MenuItem>
                      </Menu>
                    </div>
                    <div className="p-2">
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Email:</div>
                        <div>{item?.email}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Phone Number:</div>
                        <div>{item?.phoneNumber}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Age:</div>
                        <div>{item?.age}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Gender:</div>
                        <div>{item?.gender}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Relation:</div>
                        <div>{item.relation}</div>
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
      <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Vehicle : ({Details?.vehicle?.length})</div>
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
        <div className="row">
          {
            Details?.vehicle?.map((item) => {
              return <div className="col-12 col-md-6 col-lg-3 my-2">
                <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "100px" }}>
                  <div className="w-100">
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>{item?.vehicleType}</div>
                      <Button
                        aria-label="more"
                        onClick={(event) => handleClick(event, "data")}
                        sx={{ backgroundColor: '#ffffff', minWidth: '0px', color: "#5678E9", padding: "3px" }}
                      >
                        <MoreVertIcon sx={{ fontSize: "18px" }} />
                      </Button>
                      <Menu
                        anchorEl={menu}
                        open={Boolean(menu)}
                        onClose={handleClose}
                        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: '10ch' } }}
                      >
                        <MenuItem onClick={""}>Edit</MenuItem>
                        <MenuItem onClick={""}>Delete</MenuItem>
                      </Menu>
                    </div>
                    <div className="p-2">
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Vehicle Name:</div>
                        <div>{item?.vehicleName}</div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Vehicle Number:</div>
                        <div>{item?.vehicleNumber}</div>
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
      <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Pending Maintanance</div>
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
                      {/* <div className="d-flex justify-content-center my-2" style={{ fontSize: "14px" }}>
                      <div className="btn btn_primary w-75">Pay Now</div>
                    </div> */}
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
      {isLoading ? (
        <Loader message="Please wait, we are fetching data..." />
      ) : (
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
                      {/* <div className="d-flex justify-content-center my-2" style={{ fontSize: "14px" }}>
                      <div className="btn btn_primary w-75">Pay Now</div>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </div>)}
    </Paper>

    <Paper elevation={5} className="my-2 p-2">
      <div className="fw-bold my-2" style={{ fontSize: '12px' }}>Announcement Details</div>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-3 my-2">
          <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
            <div className="w-100">
              <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                <div>Community Initiatives</div>
                <Button
                  aria-label="more"
                  onClick={(event) => handleClick(event, "data")}
                  sx={{ backgroundColor: '#ffffff', minWidth: '0px', color: "#5678E9", padding: "3px" }}
                >
                  <MoreVertIcon sx={{ fontSize: "18px" }} />
                </Button>
                <Menu
                  anchorEl={menu}
                  open={Boolean(menu)}
                  onClose={handleClose}
                  PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: '10ch' } }}
                >
                  <MenuItem onClick={""}>Edit</MenuItem>
                  <MenuItem onClick={""}>Delete</MenuItem>
                </Menu>
              </div>
              <div className="p-2">
                <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Announcement Date:</div>
                  <div>01/02/2024</div>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Announcement Time</div>
                  <div>10:15 AM</div>
                </div>
                <div className="" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Description</div>
                  <div>The celebration of Ganesh Chaturthi involves the installation of clay idols of Ganesa in.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 my-2">
          <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
            <div className="w-100">
              <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                <div>Community Initiatives</div>
                <Button
                  aria-label="more"
                  onClick={(event) => handleClick(event, "data")}
                  sx={{ backgroundColor: '#ffffff', minWidth: '0px', color: "#5678E9", padding: "3px" }}
                >
                  <MoreVertIcon sx={{ fontSize: "18px" }} />
                </Button>
                <Menu
                  anchorEl={menu}
                  open={Boolean(menu)}
                  onClose={handleClose}
                  PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: '10ch' } }}
                >
                  <MenuItem onClick={""}>Edit</MenuItem>
                  <MenuItem onClick={""}>Delete</MenuItem>
                </Menu>
              </div>
              <div className="p-2">
                <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Announcement Date:</div>
                  <div>01/02/2024</div>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Announcement Time</div>
                  <div>10:15 AM</div>
                </div>
                <div className="" style={{ fontSize: "14px" }}>
                  <div className="text-muted">Description</div>
                  <div>The celebration of Ganesh Chaturthi involves the installation of clay idols of Ganesa in.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Paper>


  </>
}