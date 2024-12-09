import Paper from '@mui/material/Paper';
import { Avatar, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Slide } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import apiHelper from "../../../Common/ApiHelper"
import Loader from '../../../Component/Loader/Loader';


const ITEM_HEIGHT = 30;

export default function ServiceComplaint({ userInfo }) {
  const [isLoading, setisLoading] = useState(false)
  const [menu, setMenu] = useState(null);
  const handleClick = (event, note) => {
    setMenu(event.currentTarget);
  };
  const handleClose = () => setMenu(null);

  const handleDelete = async () => {
    try {

    } catch (error) {
      console.log(error)
      handleClose();
    }
  };
  const [Submission, setSubmission] = useState("Complaint")
  const [Comoplain, setComoplain] = useState([])
  const [Request, setRequest] = useState([])

  async function getComplaint() {
    try {
      setisLoading(true)
      const data = {
        memberId: userInfo?.societyData?._id,
        type: "Complain"
      }
      const result = await apiHelper.getComplainById(data)
      setComoplain(result?.data?.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  async function getRequest() {
    try {
      setisLoading(true)
      const data = {
        memberId: userInfo?.societyData?._id,
        type: "Request"
      }
      const result = await apiHelper.getComplainById(data)
      setRequest(result?.data?.data)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (Submission === "Complaint") {
      getComplaint()

    }
    if (Submission === "Request") {
      console.log(Submission)
      getRequest()
    }
  }, [Submission]);

  async function solveComplaint(data) {
    try {
      const Data = {
        complaintId: data?._id,
        status: "Solve"
      }
      await apiHelper.updateComplaintStatus(Data)
      getComplaint()
      getRequest()
    } catch (error) {
      console.log(error)
    }
  }

  return <>
    <div className='d-flex'>
      <button onClick={() => setSubmission("Complaint")} className={Submission === "Complaint" ? "btn btn_primary" : "btn btn_outline"}>Complaint Submission</button>
      <button onClick={() => setSubmission("Request")} className={Submission === "Request" ? "btn btn_primary" : "btn btn_outline"}>Request Submission</button>
    </div>
    <Paper >
      {
        Submission === "Complaint" ? <>
          <div className="d-flex justify-content-between p-3 align-items-center">
            <div className="h4" style={{ fontSize: "20px" }}>Complaint</div>
            <button className='btn btn_primary'>Create Complaint</button>
          </div>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <div className="row">
              {Comoplain?.map((data) => {
                return <div className="col-12 col-md-6 col-lg-3 my-2" key={"data.id"}>
                  <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "230px" }}>
                    <div className="w-100">
                      <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                        <div>{data?.complaintName}</div>
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
                          <MenuItem onClick={() => handleDelete(data)}>Delete</MenuItem>
                          <MenuItem onClick={() => solveComplaint(data)}>Solve</MenuItem>
                        </Menu>
                      </div>
                      <div className="p-2">
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Complain Date:</div>
                          <div>{data?.createdAt?.split("T")[0]}</div>
                        </div>
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Status:</div>
                          <div style={{ borderRadius: '10px', padding: "1px 5px" }} className={data?.status === "Pending" ? 'Pending text-center' : data?.status === 'Solve' ? "Solve text-center" : "Open text-center"}>{data?.status}</div>
                        </div>
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Priority:</div>
                          <div style={{ borderRadius: '10px', padding: "1px" }} className={data?.priorityStatus === "High" ? 'High text-center' : data?.priorityStatus === 'Medium' ? "Medium text-center" : "Low text-center"}>{data?.priorityStatus}</div>
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          <div className="text-muted">Description</div>
                          <div className=''>{data?.discription}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              })
              }
            </div>)}
        </> : <>
          <div className="d-flex justify-content-between p-3 align-items-center">
            <div className="h4" style={{ fontSize: "20px" }}>Request</div>
            <button className='btn btn_primary'>Create Request</button>
          </div>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <div className="row">
              {Request?.map((data) => {
                return <div className="col-12 col-md-6 col-lg-3 my-2" key={"data.id"}>
                  <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "230px" }}>
                    <div className="w-100">
                      <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                        <div>{data?.complaintName}</div>
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
                          <MenuItem onClick={() => handleDelete(data)}>Delete</MenuItem>
                          <MenuItem onClick={() => solveComplaint(data)}>Solve</MenuItem>
                        </Menu>
                      </div>
                      <div className="p-2">
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Complain Date:</div>
                          <div>{data?.createdAt?.split("T")[0]}</div>
                        </div>
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Status:</div>
                          <div style={{ borderRadius: '10px', padding: "1px 5px" }} className={data?.status === "Pending" ? 'Pending text-center' : data?.status === 'Solve' ? "Solve text-center" : "Open text-center"}>{data?.status}</div>
                        </div>
                        <div className="d-flex my-1 justify-content-between" style={{ fontSize: "14px" }}>
                          <div className="text-muted">Priority:</div>
                          <div style={{ borderRadius: '10px', padding: "1px" }} className={data?.priorityStatus === "High" ? 'High text-center' : data?.priorityStatus === 'Medium' ? "Medium text-center" : "Low text-center"}>{data?.priorityStatus}</div>
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          <div className="text-muted">Description</div>
                          <div className=''>{data?.discription}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              })
              }
            </div>)}
        </>
      }

    </Paper>
  </>
}