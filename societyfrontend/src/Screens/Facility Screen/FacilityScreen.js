
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
  Paper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Container } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import apiHelper from '../../Common/ApiHelper';
import { useSnackbar } from 'notistack';
import Loader from '../../Component/Loader/Loader';

const FacilityManagement = ({ societyId }) => {
  const [isLoading, setisLoading] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // const [date, setDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const { enqueueSnackbar } = useSnackbar()
  const [facilityDetails, setfacilityDetails] = useState({
    facilityName: "",
    description: "",
    serviceDate: "",
    remindBefore: "",
  })
  const [facilityData, setfacilityData] = useState([])
  const menu = Boolean(anchorEl);
  const handleClick = (event, facility) => {
    setAnchorEl(event.currentTarget);
    setSelectedFacility(facility); // Set the clicked facility data
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFacility(null);
  };

  const handleDailogClose = () => {
    setOpen(false);
    setfacilityDetails({
      facilityName: "",
      description: "",
      serviceDate: "",
      remindBefore: "",
    })
    handleClose()
  };

  const getfacility = async () => {
    try {
      setisLoading(true)
      const result = await apiHelper.listFacility(societyId)
      if (result && result.data) {
        setfacilityData(result?.data?.data)
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error)
    }
  }

  const createfacility = async () => {
    try {
      const data = {
        ...facilityDetails, societyId: societyId
      }
      let result
      if (isEdit) {
        result = await apiHelper.editFacility(selectedFacility._id, data)
        enqueueSnackbar('Facility Updated', { variant: 'info' })
      } else {
        result = await apiHelper.createFacility(data)
        enqueueSnackbar('Facility Create Succesfully!', { variant: 'success' })
      }
      console.log(result)
      if (result && result.data) {
        getfacility()
        handleDailogClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = () => {
    setfacilityDetails({
      facilityName: selectedFacility.facilityName,
      description: selectedFacility.description,
      serviceDate: selectedFacility.serviceDate,
      remindBefore: selectedFacility.remindBefore,
    })
    setIsEdit(true)
    setOpen(true)
  }

  useEffect(() => {
    getfacility()
  }, [])


  return (
    <>
      <Container fluid className="p-4">
        <Paper elevation={5} className="p-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Typography variant="h5" style={{ fontWeight: '500', fontFamily: 'unset', color: '#202224' }}>Facility Management</Typography>
            <button variant="contained" className='btn btn_primary' onClick={() => setOpen(true)} style={{ color: '#fff' }} >
              Create Facility
            </button>
          </div>
          {isLoading ? (
            <Loader message="Please wait, we are fetching data..." />
          ) : (
            <Grid container spacing={2}>
              {facilityData?.map((facility) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={facility._id}>
                  <Card
                    variant="outlined"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      position: 'relative',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      height: "180px"
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5678E9' }} className='p-2'>
                      <Typography variant="p" style={{ color: '#ffffff' }}>{facility?.facilityName}</Typography>
                      <div>
                        <Button
                          id="demo-positioned-button"
                          aria-controls={open ? 'demo-positioned-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(event) => handleClick(event, facility)}
                          sx={{ backgroundColor: '#ffffff', minWidth: '0px', padding: '3px' }}
                        >
                          <MoreVertIcon sx={{ color: '#5678E9', fontSize: '18px' }} />
                        </Button>
                        <Menu
                          id="demo-positioned-menu"
                          aria-labelledby="demo-positioned-button"
                          anchorEl={anchorEl}
                          open={menu}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        </Menu>
                      </div>
                    </div>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: '3px' }}>
                        Upcoming Schedule Service Date: <strong>{facility?.serviceDate}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                        {/* {facility?.description} */}
                        <div>Description :</div>
                        <div className='fw-bold'>{facility?.description}</div>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>)}
        </Paper>

      </Container>
      <React.Fragment>
        <Dialog open={open} onClose={handleDailogClose}
          PaperProps={{
            style: {
              borderRadius: '16px', // Set the border radius here
              width: "400px",
            },

          }}>
          <DialogTitle className="" style={{ fontSize: "1rem" }}>{isEdit ? "Update Facility" : "Create Facility"}</DialogTitle>
          <hr className="mx-4 mb-0 mt-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
          <DialogContent>
            <div className="my-2" style={{ width: "100%" }}>
              <label style={{ fontSize: "14px" }} htmlFor="description">Facility Name*</label>
              <TextField
                className="w-100"
                id="description"
                variant="outlined"
                placeholder='Enter Name'
                value={facilityDetails?.facilityName ? facilityDetails.facilityName : ''}
                fullWidth
                rows={3}
                margin=""
                onChange={(e) => setfacilityDetails({ ...facilityDetails, facilityName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px', // Apply your desired border radius
                  },
                }}
              />
            </div>
            <div className="my-2" style={{ width: "100%" }}>
              <label style={{ fontSize: "14px" }} htmlFor="description">Description*</label>
              <TextField
                className="w-100"
                id="description"
                placeholder="Enter Description"
                variant="outlined"
                fullWidth
                rows={3}
                margin=""
                value={facilityDetails?.description ? facilityDetails.description : ''}
                onChange={(e) => setfacilityDetails({ ...facilityDetails, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="my-2" style={{ width: "100%" }}>
                <label style={{ fontSize: "14px" }} htmlFor="date">Schedule Service Date</label>
                <DatePicker
                  sx={{ width: "100%" }}
                  value={facilityDetails?.serviceDate ? dayjs(facilityDetails?.serviceDate) : null}
                  onChange={(newValue) => {
                    setfacilityDetails({
                      ...facilityDetails,
                      serviceDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                    setDueDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100 position-absolute"
                      placeholder="Select Schedule Service Date"
                      variant="outlined"
                      fullWidth
                      rows={3}
                      margin="dense"
                    />
                  )}
                />
              </div>
            </LocalizationProvider>
            <div className="my-2 mt-1" style={{ width: "100%" }}>
              <label className='mb-1' style={{ fontSize: "14px" }} htmlFor="phoneNumber">Remind Before</label>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={facilityDetails.remindBefore}
                  displayEmpty
                  onChange={(e) => setfacilityDetails({ ...facilityDetails, remindBefore: e.target.value })}
                >
                  {/* {
                  SocietyList && SocietyList.map((item) => {
                    return <MenuItem value={item._id}>{item.societyName}</MenuItem>
                  })
                } */}
                  <MenuItem value=""><em className='text-muted' color='gray'>Select Day</em></MenuItem>
                  <MenuItem value="1_days">1 Days</MenuItem>
                  <MenuItem value="2_days">2 Days</MenuItem>
                  <MenuItem value="3_days">3 Days</MenuItem>
                  <MenuItem value="4_days">4 Days</MenuItem>
                  <MenuItem value="5_days">5 Days</MenuItem>
                  <MenuItem value="6_days">6 Days</MenuItem>
                  <MenuItem value="7_days">7 Days</MenuItem>
                  <MenuItem value="8_days">8 Days</MenuItem>
                  <MenuItem value="9_days">9 Days</MenuItem>
                  <MenuItem value="10_days">10 Days</MenuItem>
                  <MenuItem value="11_days">11 Days</MenuItem>
                  <MenuItem value="12_days">12 Days</MenuItem>
                  <MenuItem value="13_days">13 Days</MenuItem>
                  <MenuItem value="14_days">14 Days</MenuItem>
                  <MenuItem value="15_days">15 Days</MenuItem>
                </Select>
              </FormControl>
            </div>

          </DialogContent>
          <DialogActions className="d-flex justify-content-around">
            <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
              Cancel
            </Button>
            <Button variant="contained" className="btn btn_primary" onClick={createfacility} style={{ width: "45%" }}>
              {isEdit ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default FacilityManagement;



// import React, { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Grid,
//   TextField,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { Container } from 'react-bootstrap';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from "dayjs";
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';

// const FacilityManagement = () => {
//   const [facilities, setFacilities] = useState([
//     { id: 1, name: 'Parking Facilities', scheduleDate: '01/07/2024', description: 'Description of Parking Facilities.' },
//     { id: 2, name: 'Community Center', scheduleDate: '01/07/2024', description: 'Description of Community Center.' },
//     // Add more facilities as needed
//   ]);

//   const [selectedFacility, setSelectedFacility] = useState(null);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [open, setOpen] = useState(false);
//   const [dueDate, setDueDate] = useState(null);
//   const [facilityDetails, setFacilityDetails] = useState({
//     id: null,
//     facilityName: "",
//     description: "",
//     serviceDate: "",
//     remindBefore: "",
//   });
//   const menu = Boolean(anchorEl);

//   const handleClick = (event, facility) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedFacility(facility);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const editFacility = (facility) => {
//     setFacilityDetails({
//       id: facility.id,
//       facilityName: facility.name,
//       description: facility.description,
//       serviceDate: facility.scheduleDate,
//       remindBefore: facility.remindBefore || "",
//     });
//     setOpen(true);
//   };

//   const handleDialogClose = () => {
//     setOpen(false);
//     setFacilityDetails({
//       id: null,
//       facilityName: "",
//       description: "",
//       serviceDate: "",
//       remindBefore: "",
//     });
//   };

//   const handleSave = () => {
//     setFacilities(prevFacilities =>
//       prevFacilities.map(facility =>
//         facility.id === facilityDetails.id
//           ? {
//             ...facility,
//             name: facilityDetails.facilityName,
//             description: facilityDetails.description,
//             scheduleDate: facilityDetails.serviceDate,
//             remindBefore: facilityDetails.remindBefore,
//           }
//           : facility
//       )
//     );
//     handleDialogClose();
//   };

//   return (
//     <>
//       <Container fluid className="p-4">
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//           <Typography variant="h5">Facility Management</Typography>
//           <Button variant="contained" onClick={() => setOpen(true)}>Create Facility</Button>
//         </div>

//         <Grid container spacing={2}>
//           {facilities.map((facility) => (
//             <Grid item xs={12} sm={6} md={4} key={facility.id}>
//               <Card variant="outlined" style={{ position: 'relative', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#5678E9' }} className="p-2">
//                   <Typography style={{ color: '#ffffff' }}>{facility.name}</Typography>
//                   <IconButton onClick={(event) => handleClick(event, facility)}>
//                     <MoreVertIcon sx={{ color: '#ffffff' }} />
//                   </IconButton>
//                 </div>
//                 <Menu anchorEl={anchorEl} open={menu} onClose={handleCloseMenu}>
//                   <MenuItem onClick={() => { editFacility(selectedFacility); handleCloseMenu(); }}>Edit</MenuItem>
//                 </Menu>
//                 <CardContent>
//                   <Typography><strong>Service Date:</strong> {facility.scheduleDate}</Typography>
//                   <Typography>{facility.description}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       <Dialog open={open} onClose={handleDialogClose}>
//         <DialogTitle>{facilityDetails.id ? "Edit Facility" : "Create Facility"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Facility Name"
//             fullWidth
//             margin="dense"
//             value={facilityDetails.facilityName}
//             onChange={(e) => setFacilityDetails({ ...facilityDetails, facilityName: e.target.value })}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             margin="dense"
//             multiline
//             rows={3}
//             value={facilityDetails.description}
//             onChange={(e) => setFacilityDetails({ ...facilityDetails, description: e.target.value })}
//           />
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Service Date"
//               value={dueDate ? dayjs(dueDate) : dayjs(facilityDetails.serviceDate)}
//               onChange={(newValue) => setFacilityDetails({ ...facilityDetails, serviceDate: dayjs(newValue).format('MM/DD/YYYY') })}
//               renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
//             />
//           </LocalizationProvider>
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Remind Before</InputLabel>
//             <Select
//               value={facilityDetails.remindBefore}
//               onChange={(e) => setFacilityDetails({ ...facilityDetails, remindBefore: e.target.value })}
//             >
//               <MenuItem value="1_day">1 Day</MenuItem>
//               <MenuItem value="3_days">3 Days</MenuItem>
//               <MenuItem value="7_days">7 Days</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose}>Cancel</Button>
//           <Button onClick={handleSave}>Save</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default FacilityManagement;

