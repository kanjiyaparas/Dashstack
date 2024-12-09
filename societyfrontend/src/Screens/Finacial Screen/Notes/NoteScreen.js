import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import 'flatpickr/dist/themes/material_green.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import apiHelper from "../../../Common/ApiHelper";
import { useSnackbar } from "notistack";
import Loader from "../../../Component/Loader/Loader";
import { useNavigate } from "react-router-dom";
import Path from "../../../Common/Path";

const ITEM_HEIGHT = 30;

export default function NoteScreen({ societyId }) {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
  const [menu, setMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [noteData, setnoteData] = useState({}); // Track ID of note being edited
  const [isEdit, setIsEdit] = useState(false); // Track if dialog is in edit mode
  const [Note, setNote] = useState([]);
  const { enqueueSnackbar } = useSnackbar()
  const [notesDetails, setNotesDetails] = useState({
    title: "",
    description: "",
    date: ""
  });

  const handleClick = (event, note) => {
    setMenu(event.currentTarget);
    if (note) setnoteData(note);
  };
  const handleClose = () => setMenu(null);
  const handleDialogClose = () => {
    setNotesDetails({ title: "", description: "", date: "" });
    setDate(null)
    setOpen(false);
    setIsEdit(false);
  };

  const handleEdit = () => {
    setNotesDetails({
      title: noteData.title,
      description: noteData.description,
      date: noteData.date.split("T")[0]
    });
    setDate(dayjs(noteData.date));
    setIsEdit(true);
    setOpen(true);
    handleClose();
  };
  const handleDelete = async () => {
    try {
      await apiHelper.deleteNote(noteData._id)
      enqueueSnackbar('Note Deleted!', { variant: 'error' })
      handleClose();
      getNotes()
    } catch (error) {
      console.log(error)
      handleClose();
    }
  };

  async function createOrUpdateNote() {
    try {
      const data = { ...notesDetails, societyId: societyId };
      if (isEdit) {
        await apiHelper.updateNote(noteData._id, data);
        enqueueSnackbar('Note Update Succesfully!', { variant: 'info' })
      } else {
        await apiHelper.createNotes(data);
        enqueueSnackbar('Note Add Succesfully!', { variant: 'success' })
      }
      setOpen(false);
      setIsEdit(false);
      getNotes();
    } catch (error) {
      console.log(error);
    }
  }

  async function getNotes() {
    try {
      setisLoading(true)
      const result = await apiHelper.listNotes(societyId);
      setNote(result?.data?.data);
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <Paper elevation={5} className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="h6 fw-bold mt-2">Notes</div>
          <button className="btn btn_primary fw-bold" onClick={() => setOpen(true)}>Create Notes</button>
        </div>
        {isLoading ? (
          <Loader message="Please wait, we are fetching data..." />
        ) : (
          <div className="mt-4 row">
            {Note && Note.map((data) => (
              <div className="col-3 my-2" key={data.id}>
                <div className="d-flex justify-content-center" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid lightgrey", width: "96%", minHeight: "150px" }}>
                  <div className="w-100">
                    <div className="w-100 d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ background: "#5678E9" }}>
                      <div>{data.title}</div>
                      <Button
                        aria-label="more"
                        onClick={(event) => handleClick(event, data)}
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
                        <MenuItem onClick={() => handleEdit(data)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(data)}>Delete</MenuItem>
                      </Menu>
                    </div>
                    <div className="p-2">
                      <div className="d-flex gap-1" style={{ fontSize: "14px" }}>
                        <div className="text-muted">Date:</div>
                        <div>{data.date.split("T")[0]}</div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div className="text-muted">Description</div>
                        <div>{data.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>)}
      </Paper>
      <Dialog open={open} onClose={handleDialogClose} PaperProps={{
        style: {
          borderRadius: '16px',
          width: "450px",
        },
      }}>
        <DialogTitle style={{ fontSize: "24px" }}>{isEdit ? "Edit Note" : "Create Note"}</DialogTitle>
        <hr className="mx-4 my-0" style={{ color: "#b6b6b6", textAlign: "center" }} />
        <DialogContent>
          <div className="mb-2" style={{ width: "100%" }}>
            <label style={{ fontSize: "14px" }} htmlFor="description">Title<span style={{ color: "red" }}>*</span></label>
            <TextField
              className="w-100"
              id="description"
              placeholder="Title"
              variant="outlined"
              fullWidth
              rows={3}
              margin="dense"
              value={notesDetails.title}
              onChange={(e) => setNotesDetails({ ...notesDetails, title: e.target.value })}
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
              placeholder="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="dense"
              value={notesDetails.description}
              onChange={(e) => setNotesDetails({ ...notesDetails, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div className="d-flex flex-col" style={{ width: "100%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <label className='mb-2' style={{ fontSize: "14px" }} htmlFor="date">Date<span style={{ color: "red" }}>*</span></label>
              <DatePicker
                placeholder="Select Date"
                value={date}
                onChange={(newValue) => {
                  setNotesDetails({
                    ...notesDetails,
                    date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ""
                  });
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    className="w-100"
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
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-around">
          <Button variant="outlined" className="btn_outline" onClick={handleDialogClose} color="primary" style={{ width: "45%" }}>Cancel</Button>
          <Button variant="contained" className="btn btn_primary" onClick={createOrUpdateNote} style={{ width: "45%" }}>{isEdit ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
