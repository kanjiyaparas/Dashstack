import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import apiHelper from '../../Common/ApiHelper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Container } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import {
  Card, CardContent, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Loader from '../../Component/Loader/Loader';

export default function VisitorScreen({ societyId, userInfo }) {
  const [isLoading, setisLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedWing, setselectedWing] = useState("");
  const [selectedUnit, setselectedUnit] = useState("");
  const [Wing, setWing] = useState([]);
  const [Unit, setUnit] = useState([]);
  const [visitordetails, setvisitordetails] = useState({
    visitorName: '',
    time: '',
    date: '',
  })
  const [visitor, setvisitor] = useState([])

  const handleDailogClose = () => {
    setOpen(false);
    setvisitordetails({
      visitorName: '',
      time: '',
      date: '',
    })
    setselectedWing('')
    setselectedUnit('')
  };

  async function getWing() {
    try {
      const id = userInfo?.societyData?.societyId ? userInfo?.societyData?.societyId : userInfo?.societyData?.selectSociety
      const result = await apiHelper.listWing(id)
      setWing(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getUnit() {
    try {
      const result = await apiHelper.listUnit(selectedWing)
      setUnit(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addvisitor = async () => {
    try {
      const data = {
        ...visitordetails,
        societyId: userInfo.societyData.societyId ? userInfo.societyData.societyId : userInfo.societyData.selectSociety,
        securityId: userInfo?._id,
        wingId: selectedWing,
        unitId: selectedUnit
      }
      const result = await apiHelper.createvisitor(data)
      if (result && result.data) {
        listvisitor()
        enqueueSnackbar("Visitor add  successful!", { variant: "success" });
        handleDailogClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const listvisitor = async () => {
    try {
      setisLoading(true)
      const id = userInfo.societyData.societyId ? userInfo.societyData.societyId : userInfo.societyData.selectSociety
      const result = await apiHelper.listvisitor(id)
      if (result && result.data) {
        setvisitor(result.data.data)
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    listvisitor()
    getWing()
  }, [])

  useEffect(() => {
    if (selectedWing !== '') {
      getUnit()
    }
  }, [selectedWing]);


  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Visitor Logs</div>
        {userInfo?.role === 'Security' ? <div>
          <button className='btn btn_primary fw-bold' onClick={() => { setOpen(true) }} ><AddBoxIcon /> Add Visitor</button>
        </div> : ''}
        {/* <div>
          <button className='btn btn_primary fw-bold' onClick={() => { setOpen(true) }}><AddBoxIcon /> Add Visitor</button>
        </div> */}
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
          <TableHead style={{ background: "aliceblue" }}>
            <TableRow>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="start">Full Name</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Wing Name</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Unit Number</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Date</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Time</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <TableBody>
              {visitor.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='start' component="th" scope="row" className='d-flex align-items-center justify-content-start gap-2'>
                    <span>{row.visitorName}</span>
                  </TableCell>
                  <TableCell align="center"><span style={{ background: "lightblue", borderRadius: "50%", padding: "3px 7px" }}>{row?.wingId?.wingName}</span></TableCell>
                  <TableCell align="center">{row?.unitId?.unitNumber}</TableCell>
                  <TableCell align="center">{dayjs(row.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell align="center">{row.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>)}
        </Table>
      </TableContainer>
    </Paper>

    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px', // Set the border radius here
            width: "400px",
          },

        }}>
        <DialogTitle className="" style={{ fontSize: "1rem" }}>{'Create Visitor'}</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Visitor Name <span style={{ color: 'red' }}>*</span></label>
            <TextField
              className="w-100"
              id="description"
              variant="outlined"
              value={visitordetails.visitorName}
              placeholder='Enter Visitor Name'
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setvisitordetails({ ...visitordetails, visitorName: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="my-2" style={{ width: "47%" }}>
              <label style={{ fontSize: "12px" }} htmlFor="wing">Wing <span style={{ color: 'red' }}>*</span></label><br />
              <FormControl fullWidth>
                <Select
                  labelId="wing"
                  id="demo-simple-select"
                  value={selectedWing}
                  placeholder="Wing"
                  onChange={(e) => setselectedWing(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>--- Select Wing ---</em>
                  </MenuItem>
                  {
                    Wing && Wing.map((item) => {
                      return <MenuItem value={item._id}>{item.wingName}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </div>
            <div className="my-2" style={{ width: "47%" }}>
              <label style={{ fontSize: "12px" }} htmlFor="unit">Unit<span style={{ color: 'red' }}>*</span></label><br />
              <FormControl fullWidth disabled={!selectedWing}>
                <Select
                  labelId="unit"
                  id="demo-simple-select"
                  value={selectedUnit}
                  placeholder="Unit"
                  onChange={(e) => setselectedUnit(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>--- Select Unit ---</em>
                  </MenuItem>
                  {
                    Unit && Unit.map((item) => {
                      return <MenuItem value={item._id}><span className=" text-light rounded-pill me-1 px-1" style={{ fontSize: "14px", background: "darkorange" }}>{item.wingId.wingName}</span>{item.unitNumber}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Date <span style={{ color: 'green' }}>*</span></label>
                <DatePicker
                  // sx={{ width: "47%" }}
                  value={visitordetails.date ? dayjs(visitordetails.date) : null}
                  onChange={(newValue) => {
                    setvisitordetails({
                      ...visitordetails,
                      date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Date"
                      // value={securityProtocol.date ? dayjs(securityProtocol.date) : null}
                      variant="outlined"
                      fullWidth
                      rows={3}
                      margin="dense"
                    />
                  )}
                />
              </div>
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">time <span style={{ color: 'red' }}>*</span></label>
                <TimePicker
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={visitordetails.time ? dayjs(visitordetails.time, 'h:mm A') : null}
                  onChange={(newValue) => {
                    setvisitordetails({
                      ...visitordetails,
                      time: newValue ? dayjs(newValue).format('h:mm A') : "",
                    });
                  }}
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
          <Button variant="contained" className="btn btn_primary" onClick={addvisitor} style={{ width: "45%" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  </>
}
