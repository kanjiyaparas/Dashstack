import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import apiHelper from '../../../Common/ApiHelper';
import DeleteDialog from '../../../Common/DeleteDialog';
import { useSnackbar } from 'notistack';
import Loader from '../../../Component/Loader/Loader';

export default function ExpensesScreen({ societyId }) {
  const [isLoading, setisLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [detailsOpen, setdetailsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()
  const [viewDetails, setviewDetails] = useState({
    title: "",
    description: "",
    date: "",
    amount: "",
    bill: ""
  });
  const [eventDetails, seteventDetails] = useState({
    title: "",
    date: "",
    amount: "",
    discription: ""
  })

  const [eventdata, seteventData] = useState([])



  const handleClose = () => {
    setdetailsOpen(false);
  };
  const handleDailogClose = () => {
    setOpen(false);
    seteventDetails({
      title: "",
      date: "",
      amount: "",
      discription: ""
    })
    setSelectedFile(null)
  };

  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDeleteDialog = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedId(null);
  };




  const handleEditOpen = (data) => {
    seteventDetails({
      title: data.title,
      date: dayjs(data.date).format('YYYY-MM-DD'),
      amount: data.amount,
      discription: data.discription,
    });
    setSelectedFile(data.billDocument);
    setEditingId(data._id);
    setIsEditMode(true);
    setOpen(true);
  };



  const handleViewOpen = async (data) => {
    try {
      let billData = await apiHelper.imageDetails({ billDocument: data?.billDocument })
      billData = billData.data.data
      console.log(billData)
      setviewDetails({
        title: data.title,
        description: data.discription,
        date: dayjs(data.date).format('DD/MM/YYYY'),
        amount: data.amount,
        bill: {
          name: billData?.billDocument?.display_name,
          size: billData?.billDocument?.bytes,
          format: billData?.billDocument?.format,
          url: billData?.billDocument?.url
        }
      });
      setdetailsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  async function editExpense() {
    try {
      const data = {
        ...eventDetails,
        societyId: societyId,
      };
      const formdata = new FormData();

      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key]);
      });
      formdata.append("file", selectedFile);

      await apiHelper.updateexpence(editingId, formdata);
      enqueueSnackbar('Expense Update Succesfully!', { variant: 'info' })
      listexpence();
      handleDailogClose()
      setIsEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSave = () => {
    if (isEditMode) {
      editExpense();
    } else {
      createexpence();
    }
  };

  async function createexpence() {
    try {
      const data = {
        ...eventDetails,
        societyId: societyId,
      }
      const formdata = new FormData();

      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key])
      })
      console.log(formdata);
      formdata.append("file", selectedFile)

      await apiHelper.createexpence(formdata)
      enqueueSnackbar('Expense Create Succesfully!', { variant: 'success' })
      listexpence()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteexpense = async (id) => {
    try {
      const result = await apiHelper.deleteexpence(id)
      if (result && result.data) {
        enqueueSnackbar('Expense Deleted!', { variant: 'error' })
        listexpence()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const listexpence = async () => {
    try {
      setisLoading(true)
      const result = await apiHelper.listexpence(societyId)
      console.log(result.data)
      if (result && result.data) {
        seteventData(result.data.data)
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    listexpence()
  }, [])


  const handleDragLeave = () => setDragging(false);

  return <>
    <Paper elevation={5} className='p-2'>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
        <div className="h6 fw-bold mt-2">Add Expenses Details</div>
        <div>
          <button className='btn btn_primary fw-bold' onClick={() => setOpen(true)} ><AddBoxIcon /> Add New Expenses details</button>
        </div>
      </div>
      <TableContainer>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
            <TableHead style={{ background: "aliceblue" }}>
              <TableRow>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Title</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Description</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Date</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Amount</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Bill Format</TableCell>
                <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventdata.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="start">{row.title}</TableCell>
                  <TableCell align="start">{row.discription}</TableCell>
                  <TableCell align="center">{dayjs(row.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                  <TableCell align="center">{typeof row.billDocument === "string" && row.billDocument.split('.').pop() === "pdf" ? (
                    <InsertDriveFileIcon className='text-danger mx-1' />
                  ) : (
                    <InsertPhotoIcon className='text-success mx-1' />
                  )}
                    {row.billFormat}</TableCell>
                  <TableCell align="center">
                    <button className='btn text-success mx-1'>
                      <EditIcon style={{ fontSize: "18px" }} onClick={() => handleEditOpen(row)} />
                    </button>
                    <button className='btn text-primary mx-1' >
                      <VisibilityIcon style={{ fontSize: "18px" }} onClick={() => handleViewOpen(row)} />
                    </button>
                    <button className='btn text-danger mx-1' >
                      <DeleteIcon style={{ fontSize: "18px" }} onClick={() => openDeleteDialog(row._id)} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper >
    <React.Fragment>
      <Dialog open={open} onClose={handleDailogClose}
        PaperProps={{
          style: {
            borderRadius: '16px',
            width: "450px",
          },
        }}>
        <DialogTitle style={{ fontSize: "24px" }}>{isEditMode ? "Update Expense" : "Add Expense"}</DialogTitle>
        <hr className="mx-4 my-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="mb-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Title<span style={{ color: "red" }}>*</span></label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Title"
              variant="outlined"
              value={eventDetails.title}
              fullWidth
              rows={3}
              margin="dense"
              onChange={(e) => seteventDetails({ ...eventDetails, title: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="my-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Description<span style={{ color: "red" }}>*</span></label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Enter Description"
              variant="outlined"
              value={eventDetails.discription}
              fullWidth
              multiline
              rows={3}
              margin="dense"
              onChange={(e) => seteventDetails({ ...eventDetails, discription: e.target.value })}
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
                <label className='mb-2' style={{ fontSize: "14px" }} htmlFor="date">Date<span style={{ color: "red" }}>*</span></label>
                <DatePicker
                  value={date}
                  onChange={(newValue) => {
                    seteventDetails({
                      ...eventDetails,
                      date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : "",
                    });
                    setDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="w-100"
                      placeholder="Select Date"
                      variant="outlined"
                      value={date}
                      fullWidth
                      margin="dense"
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          paddingRight: "0px",
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className="my-2" style={{ width: "47%" }}>
                <label className='mb-2' style={{ fontSize: "14px" }} htmlFor="amount">Amount<span style={{ color: "red" }}>*</span></label>
                <TextField
                  className="w-100"
                  id="amount"
                  placeholder="Amount"
                  value={eventDetails.amount}
                  variant="outlined"
                  fullWidth
                  onChange={(e) => seteventDetails({ ...eventDetails, amount: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <span style={{ fontWeight: 'bold' }}>₹</span>
                    </InputAdornment>,
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>
          <div className="my-2" style={{ width: "100%" }}>
            <div className="">
              <p className="p-0 mb-2" style={{ fontSize: "14px" }}>
                Upload Bill<span style={{ color: "red" }}>*</span>
              </p>
              {selectedFile !== null ? (
                <>
                  <label
                    htmlFor="aadharfront"
                    className={`py-3 border`}
                    // onDragOver={handleDragOver}
                    // onDragLeave={handleDragLeave}
                    // onDrop={handleDrop}
                    style={{
                      border: "2px solid #007bff",
                      borderRadius: "12px",
                      width: "100%"
                      // cursor: "pointer",
                    }}
                  >
                    <div className='d-flex w-100 justify-content-between align-items-center'>
                      <div className='ps-2' style={{ width: "80%", fontSize: "14px" }}>
                        <div>{selectedFile.name}</div>
                        <div style={{ color: "#A7A7A7" }}>{selectedFile.size} kb</div>
                        <div style={{ color: "green" }}>File Uploaded Successfully</div>
                      </div>
                      <div className='pe-3' style={{ width: "20%", textAlign: "end" }}>
                        <DeleteIcon sx={{ color: "#A7A7A7" }} onClick={() => setSelectedFile(null)} />
                      </div>
                    </div>
                  </label>
                </>
              ) : (
                <label
                  htmlFor="aadharfront"
                  className={`box py-3 ${dragging ? 'border border-primary' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: dragging ? "2px dashed #007bff" : "2px dashed #ccc",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    id="aadharfront"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                  <div className="logo d-flex justify-content-center">
                    <AddPhotoAlternateIcon className="fs-1 text-muted" />
                  </div>
                  <div className="h6 fw-bold d-flex justify-content-center">
                    <span className="text-primary">Upload a file</span>
                    <span> or drag and drop</span>
                  </div>
                  <div className="text-muted text-center" style={{ fontSize: '10px' }}>
                    PNG, JPG, GIF up to 10MBs
                  </div>
                </label>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
            Cancel
          </Button>
          <Button variant="contained" className="btn btn_primary" onClick={handleSave} style={{ width: "45%" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    {/* View Details Dialog */}
    <React.Fragment>
      <Dialog open={detailsOpen} onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '16px',
            width: "450px"
          },
        }}>
        <DialogTitle style={{ fontSize: "18px" }}>View Expense Details</DialogTitle>
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
        <DialogContent>
          <div className="mb-2">
            <strong>Title:</strong> {viewDetails.title}
          </div>
          <div className="mb-2">
            <strong>Description:</strong> {viewDetails.description}
          </div>
          <div className="mb-2">
            <strong>Date:</strong> {viewDetails.date}
          </div>
          <div className="mb-2">
            <strong>Amount:</strong> ₹{viewDetails.amount}
          </div>
          <div className="mb-2">
            <strong>Bill:</strong>
            <div className="d-flex align-items-center mt-1">
              {`${viewDetails?.bill?.name}.${viewDetails?.bill?.format}`.endsWith(".pdf") ? (
                <InsertDriveFileIcon className='text-danger mx-1' />
              ) : (
                <InsertPhotoIcon className='text-success mx-1' />
              )}
              {viewDetails.bill && (
                <>
                  <span>{`${viewDetails?.bill?.name}.${viewDetails?.bill?.format}`}</span>
                  {/* <span>{viewDetails?.bill?.name}</span> */}
                  <IconButton
                    onClick={() => window.open(viewDetails?.bill?.url, "_blank")}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>

    <DeleteDialog
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
      onConfirm={deleteexpense}
      itemId={selectedId}
      text={'Expense'}
    />

  </>
}