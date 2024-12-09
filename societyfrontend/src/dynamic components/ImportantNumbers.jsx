import React, { useEffect, useState } from "react";
import addIcon from "../assets/icons/add-icon.svg";
import trash from "../assets/icons/trash-icon.svg";
import edit from "../assets/icons/edit-icon.svg";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import apiHelper from "../Common/ApiHelper";
import { useSnackbar } from "notistack";

const ImportantNumbers = ({
  toggleModal,
  toggleEditModal,
  toggleDeleteModal,
  userInfo,
  societyId
}) => {
  const contacts = [
    { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
    { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
    { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
    { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
    { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
  ];
  const [number , setnumber] = useState({
    fullName : '',
    phoneNumber : '',
    work:''
  })
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false);
  const [selectednumber, setSelectednumber] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [numberdetails , setnumberdetails] = useState([])
  const [numberId , setSelectednumberId] = useState(null)

  const handleClose = () => {
    setnumber(null);
    setSelectednumber(null)
    setSelectednumberId(null)
  };

  const handleDailogClose = () => {
    setOpen(false);
    setnumber({
      fullName : '',
      phoneNumber : '',
      work:''
    })
    handleClose()
  };

  const getnumber = async () => {
    try {
      const id = userInfo?.societyData?.societyId ? userInfo?.societyData?.societyId : userInfo?.societyData?.selectSociety
      const result = await apiHelper.getnumber(id)
      if (result && result.data) {
        setnumberdetails(result?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createnumber = async () => {
    try {
      const data = {
        ...number, societyId: userInfo.societyData.societyId ? userInfo.societyData.societyId : userInfo.societyData.selectSociety,
      }
      let result
      if (isEdit) {
        result = await apiHelper.updatenumber(numberId, data)
        enqueueSnackbar('Workers Updated', { variant: 'info' })
      } else {
        result = await apiHelper.createnumber(data)
        enqueueSnackbar('Workers Create Succesfully!', { variant: 'success' })
      }
      if (result && result.data) {
        getnumber()
        handleDailogClose()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDialogOpen = (contact = null) => {
    if (contact) {
      // Set edit mode and populate dialog fields for editing
      setIsEdit(true);
      setSelectednumberId(contact._id);
      setnumber({
        fullName : contact.fullName,
        phoneNumber : contact.phoneNumber,
        work:contact.work
      });
    } else {
      // Set create mode
      setIsEdit(false);
      setnumber({
        fullName : '',
        phoneNumber : '',
        work:''
      });
    }
    setOpen(true);
  };

  const deletenumber = async(contactId) => {
    try {
      const result = await apiHelper.deletenumber(contactId)
      if (result && result.data) {
        enqueueSnackbar("SecurityProtocol Deleted", { variant: "error" });
        getnumber()
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getnumber()
  },[])


  return (
    <>
    <div className="flex flex-col gap-3 bg-white p-1 rounded-[15px] h-full max-w-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">Important Numbers</h2>
        <button
          className="button-gradient flex items-center gap-2 px-2 py-1 rounded-md"
        >
          <img src={addIcon} alt="Add" className="w-5 h-5" />
          <span className="text-lg" onClick={() => setOpen(true)}>Add</span>
        </button>
      </div>

      <div className="overflow-y-auto h-[390px] pr-2 custom-scrollbar">
        {numberdetails.map((contact, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-2 border-[#F6F8FB] bg-white rounded-[10px] px-3 py-2.5 mb-3"
          >
            <div>
              <p className="font-medium text-sm text-[#202224]">
                Name : <span className="text-[#A7A7A7]">{contact.fullName}</span>
              </p>
              <p className="font-medium text-sm text-[#202224]">
                Ph Number:{" "}
                <span className="text-[#A7A7A7]">{contact.phoneNumber}</span>
              </p>
              <p className="font-medium text-sm text-[#202224]">
                Work: <span className="text-[#A7A7A7]">{contact.work}</span>
              </p>
            </div>
            <div className="bg-[#F6F8FB] w-[1px] h-[46px]"></div>
            <div className="flex items-center gap-3">
              <button
                className="flex justify-center items-center w-[30px] h-[30px] bg-[#F6F8FB] rounded-full"
                onClick={()=>deletenumber(contact?._id)}
              >
                <img src={trash} alt="Delete" />
              </button>
              <button
                className="flex justify-center items-center w-[30px] h-[30px] bg-[#F6F8FB] rounded-full"
                onClick={() => handleDialogOpen(contact)}
              >
                <img src={edit} alt="Edit" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

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
      <label style={{ fontSize: "14px" }} htmlFor="description">Full Name*</label>
      <TextField
        className="w-100"
        id="description"
        variant="outlined"
        placeholder='Enter Full Name'
        value={number?.fullName}
        fullWidth
        rows={3}
        margin=""
        onChange={(e) => setnumber({ ...number, fullName: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px', // Apply your desired border radius
          },
        }}
      />
    </div>
    <div className="my-2" style={{ width: "100%" }}>
      <label style={{ fontSize: "14px" }} htmlFor="description">Phone Number*</label>
      <TextField
        className="w-100"
        id="description"
        placeholder="Enter Phone Number"
        variant="outlined"
        fullWidth
        rows={3}
        margin=""
        value={number?.phoneNumber}
        onChange={(e) => setnumber({ ...number, phoneNumber: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        }}
      />
    </div>
    <div className="my-2" style={{ width: "100%" }}>
      <label style={{ fontSize: "14px" }} htmlFor="description">Work*</label>
      <TextField
        className="w-100"
        id="description"
        placeholder="Enter Work"
        variant="outlined"
        fullWidth
        rows={3}
        margin=""
        value={number?.work}
        onChange={(e) => setnumber({ ...number, work: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        }}
      />
    </div>

  </DialogContent>
  <DialogActions className="d-flex justify-content-around">
    <Button variant="outlined" className="btn_outline" color="primary" onClick={handleDailogClose} style={{ width: "45%" }}>
      Cancel
    </Button>
    <Button variant="contained" className="btn btn_primary" onClick={createnumber} style={{ width: "45%" }}>
      {isEdit ? "Update" : "Save"}
    </Button>
  </DialogActions>
</Dialog>
</React.Fragment>
</>
  );
};



export default ImportantNumbers;
