import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
} from '@mui/material';
import { Container } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import apiHelper from '../../Common/ApiHelper';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import Loader from '../../Component/Loader/Loader';

export default function SecurityProtocol({ societyId, userInfo }) {
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProtocolId, setSelectedProtocolId] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const { enqueueSnackbar } = useSnackbar()
  const handleDialogClose = () => {
    setOpen(false);
  };

  const [securityProtocol, setsecurityProtocol] = useState({
    title: '',
    discription: '',
    date: '',
    time: ''
  })

  const [protocolData, setProtocolData] = useState([])


  const handleDialogOpen = (protocol = null) => {
    if (protocol) {
      // Set edit mode and populate dialog fields for editing
      setEditMode(true);
      setSelectedProtocolId(protocol._id);
      setsecurityProtocol({
        title: protocol.title,
        discription: protocol.discription,
        date: protocol.date,
        time: protocol.time,
      });
    } else {
      // Set create mode
      setEditMode(false);
      setsecurityProtocol({
        title: '',
        discription: '',
        date: '',
        time: '',
      });
    }
    setOpen(true);
  };

  const handleDailogClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedProtocolId(null);
  };

 
  const listprotocol = async () => {
    try {
      setisLoading(true)
      const id = userInfo?.societyData?.societyId ? userInfo?.societyData?.societyId : userInfo?.societyData?.selectSociety
      const result = await apiHelper.listsecurityProtocol(id)
      if (result && result.data) {
        setProtocolData(result?.data?.data)
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  const saveProtocol = async () => {
    const data = { ...securityProtocol, societyId: userInfo.societyData.societyId ? userInfo.societyData.societyId : userInfo.societyData.selectSociety, };
    try {
      if (editMode) {
        // Update existing protocol
        await apiHelper.updatesecurityProtocol(selectedProtocolId, data);
        enqueueSnackbar("SecurityProtocol Update successfull!", { variant: "info" });
      } else {
        // Create new protocol
        await apiHelper.createsecurityProtocol(data);
        enqueueSnackbar("SecurityProtocol Add successfull!", { variant: "success" });
      }
      listprotocol();
      handleDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProtocol = async (protocolId) => {
    try {
      const result = await apiHelper.deletesecurityProtocol(protocolId)
      if (result && result.data) {
        enqueueSnackbar("SecurityProtocol Deleted", { variant: "error" });
        listprotocol()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewDialogOpen = (protocol) => {
    const time = formatTimeToAMPM(protocol.time)
    protocol = { ...protocol, time: time }
    setSelectedProtocol(protocol);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  function formatTimeToAMPM(time) {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  useEffect(() => {
    listprotocol()
  }, [])

  console.log(securityProtocol);
  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Security Protocols</div>
        {userInfo?.role === 'Chairman' ? <div>
          <button className='btn btn_primary fw-bold' onClick={() => handleDialogOpen()}><AddBoxIcon />Create Protocol</button>
        </div> : ''}
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
          <TableHead style={{ background: "aliceblue" }}>
            <TableRow>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="start">Title</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="start">Description</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Date</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Time</TableCell>
              <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <TableBody>
              {protocolData.map((protocol, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="start">{protocol.title}</TableCell>
                  <TableCell align="start">{protocol.discription}</TableCell>
                  <TableCell align="center">{dayjs(protocol.date).format('YYYY-MM-DD')}</TableCell>
                  <TableCell align="center">{formatTimeToAMPM(protocol?.time)}</TableCell>

                  <TableCell align="center">
                    {userInfo?.role === 'Chairman' ? <button className='btn text-success mx-1' >
                      <EditIcon style={{ fontSize: "18px" }} onClick={() => handleDialogOpen(protocol)} />
                    </button> : ''}
                    <button className='btn text-primary mx-1' >
                      <VisibilityIcon style={{ fontSize: "18px" }} onClick={() => handleViewDialogOpen(protocol)} />
                    </button>
                    {userInfo?.role === 'Chairman' ? <button className='btn text-danger mx-1' >
                      <DeleteIcon style={{ fontSize: "18px" }} onClick={() => deleteProtocol(protocol._id)} />
                    </button> : ''}
                  </TableCell>
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
        <DialogTitle className="" style={{ fontSize: "1rem" }}>{editMode ? 'Edit Protocol' : 'Create Protocol'}</DialogTitle>
        <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Title</label>
            <TextField
              className="w-100"
              id="description"
              variant="outlined"
              value={securityProtocol.title}
              placeholder='Enter title'
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setsecurityProtocol({ ...securityProtocol, title: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Discription</label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Description"
              value={securityProtocol.discription}
              variant="outlined"
              fullWidth
              rows={3}
              margin=""
              onChange={(e) => setsecurityProtocol({ ...securityProtocol, discription: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="my-2" style={{ width: "47%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Date</label>
                <DatePicker
                  // sx={{ width: "47%" }}
                  value={securityProtocol.date ? dayjs(securityProtocol.date) : null}
                  onChange={(newValue) => {
                    setsecurityProtocol({
                      ...securityProtocol,
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
                <label style={{ fontSize: "14px" }} htmlFor="date">time</label>
                <TimePicker
                  // label="Time"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={securityProtocol.time ? dayjs(securityProtocol.time, 'HH:mm:ss') : null}
                  onChange={(newValue) => {
                    setsecurityProtocol({
                      ...securityProtocol,
                      time: newValue ? dayjs(newValue).format('HH:mm:ss') : "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Time"
                      // value={securityProtocol.time ? dayjs(securityProtocol.time) : null}
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
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDialogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={saveProtocol} style={{ width: "45%" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    {/* protocol view dialog */}
    <Dialog open={viewDialogOpen} onClose={handleViewDialogClose} PaperProps={{ style: { borderRadius: 12, padding: '16px', width: '450px' } }}>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="p" style={{ fontWeight: 'bold' }}>View Security Protocol</Typography>
          <IconButton onClick={handleViewDialogClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>Title</Typography>
        <Typography variant="body1" gutterBottom>{selectedProtocol?.title || 'N/A'}</Typography>

        <Typography variant="subtitle2" color="textSecondary" gutterBottom>Description</Typography>
        <Typography variant="body1" gutterBottom>{selectedProtocol?.discription || 'N/A'}</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Date</Typography>
            <Typography variant="body1">{selectedProtocol?.date || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Time</Typography>
            <Typography variant="body1">{selectedProtocol?.time || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  </>
}
