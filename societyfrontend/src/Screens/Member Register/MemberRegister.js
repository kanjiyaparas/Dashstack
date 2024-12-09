import { Avatar, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import React, { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import apiHelper from "../../Common/ApiHelper";
import { useSnackbar } from "notistack"

export default function MemberRegister({ userInfo }) {
  const [mebetNumber, setmebetNumber] = useState("")
  const { enqueueSnackbar } = useSnackbar()
  const [vehicleCount, setvehicleCount] = useState("")
  const [familyMember, setfamilyMember] = useState([{ fullName: '', phoneNumber: '', email: '', age: '', gender: '', relation: '' }]);
  const [vehicle, setvehicle] = useState([{ vehicleName: '', vehicleNumber: '', vehicleType: '' }]);
  const [residentType, setresidentType] = useState("Owner")
  const [selectedWing, setselectedWing] = React.useState("");
  const [selectedUnit, setselectedUnit] = React.useState("");
  const [selectedGender, setselectedGender] = React.useState("");
  const [Wing, setWing] = React.useState([]);
  const [Unit, setUnit] = React.useState([]);
  const [OwnerInfo, setOwnerInfo] = React.useState({
    fullName: "",
    phoneNumber: "",
    address: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [RegisterDetails, setRegisterDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: 0,
    age: "",
  })
  console.log(userInfo)
  async function getWing() {
    try {
      const result = await apiHelper.listWing(userInfo?.societyData?.selectSociety)
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

  const [selectedFiles, setSelectedFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    addressProof: null,
    rentAgreement: null,
    profileImage: null
  });

  const [dragging, setDragging] = useState({
    aadharFront: false,
    aadharBack: false,
    addressProof: false,
    rentAgreement: false,
    profileImage: false
  });

  // Handle file selection
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
    }
    if (file && type === "profileImage") {
      // Create a URL for the selected file and update state
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle drag over event
  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragging((prev) => ({ ...prev, [type]: true }));
  };

  // Handle drag leave event
  const handleDragLeave = (type) => {
    setDragging((prev) => ({ ...prev, [type]: false }));
  };

  // Handle file drop event
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
      setDragging((prev) => ({ ...prev, [type]: false }));
    }
  };
  console.log(imagePreview);
  const renderUploadSection = (label, type) => (
    <div className="col-3 p-3">
      <p style={{ fontSize: "12px", fontWeight: "bold" }}>{label}</p>
      {selectedFiles[type] ? (
        <div className="border p-2" style={{ border: "2px solid #007bff", borderRadius: "12px", overflow: "hidden" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="ps-2" style={{ width: "80%", fontSize: "14px" }}>
              <div>{selectedFiles[type].name}</div>
              <div style={{ color: "#A7A7A7" }}>{(selectedFiles[type].size / 1024).toFixed(2)} KB</div>
              <div style={{ color: "green" }}>File Uploaded Successfully</div>
            </div>
            <div className="pe-3" style={{ width: "20%", textAlign: "end" }}>
              <DeleteIcon sx={{ color: "#A7A7A7" }} onClick={() => setSelectedFiles((prev) => ({ ...prev, [type]: null }))} />
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={type}
          className={`box py-3 ${dragging[type] ? 'border border-primary' : ''}`}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={() => handleDragLeave(type)}
          onDrop={(e) => handleDrop(e, type)}
          style={{
            border: dragging[type] ? "2px dashed #007bff" : "2px dashed #ccc",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <input
            id={type}
            type="file"
            hidden
            onChange={(e) => handleFileChange(e, type)}
          />
          <div className="logo d-flex justify-content-center">
            <AddPhotoAlternateIcon className="fs-1 text-muted" />
          </div>
          <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}>
            <span className="text-primary">Upload a file</span>
            <span> or drag and drop</span>
          </div>
          <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
        </label>
      )}
    </div>
  );


  async function registerHandler() {
    try {
      const data = {
        ...RegisterDetails,
        societyId: userInfo?.societyData?.selectSociety,
        wing: selectedWing,
        unit: selectedUnit,
        gender: selectedGender,
        residentStatus: residentType,
      }
      // files: { ...selectedFiles }
      const formdata = new FormData();

      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key])
      })
      formdata.append('familyMember', JSON.stringify(familyMember));
      formdata.append('vehicle', JSON.stringify(vehicle));
      formdata.append('OwnerInfo', JSON.stringify(OwnerInfo));
      formdata.append("profileImage", selectedFiles.profileImage)
      formdata.append("aadharFront", selectedFiles.aadharFront)
      formdata.append("aadharBack", selectedFiles.aadharBack)
      formdata.append("veraBill", selectedFiles.addressProof)
      formdata.append("agreement", selectedFiles.rentAgreement)
      const result = await apiHelper.createMember(formdata)
      enqueueSnackbar('Member Add Succesfully!', { variant: 'success' })
      setSelectedFiles({
        aadharFront: null,
        aadharBack: null,
        addressProof: null,
        rentAgreement: null,
        profileImage: null
      })
      setRegisterDetails({
        fullName: "",
        email: "",
        phoneNumber: 0,
        age: "",
      })
      setvehicle([{ vehicleName: '', vehicleNumber: '', vehicleType: '' }])
      setfamilyMember([{ fullName: '', phoneNumber: '', email: '', age: '', gender: '', relation: '' }])
      setselectedWing('')
      setselectedUnit('')
      setselectedGender('')
    } catch (error) {
      console.log(error)
      enqueueSnackbar('something wrong in Add Member', { variant: 'error' })
    }
  }

  const handleMemberCountChange = (e) => {
    const memberCount = e.target.value;
    setmebetNumber(memberCount);
    const updatedFamilyMember = [...familyMember];
    while (updatedFamilyMember.length < memberCount) {
      updatedFamilyMember.push({ fullName: "", phoneNumber: "", email: "", age: "", gender: "", relation: "" });
    }
    while (updatedFamilyMember.length > memberCount) {
      updatedFamilyMember.pop();
    }
    setfamilyMember(updatedFamilyMember);
  };
  const handleFamilyChange = (index, field, value) => {
    const updatedfamilyMember = [...familyMember];
    updatedfamilyMember[index][field] = value;
    setfamilyMember(updatedfamilyMember);
  };

  const handleVehicleCountChange = (e) => {
    const vehicleCount = e.target.value;
    setvehicleCount(vehicleCount);
    const updatedVehicle = [...vehicle];
    while (updatedVehicle.length < vehicleCount) {
      updatedVehicle.push({ vehicleName: '', vehicleNumber: '', vehicleType: '' });
    }
    while (updatedVehicle.length > vehicleCount) {
      updatedVehicle.pop();
    }
    setvehicle(updatedVehicle);
  };
  const handleVehicleChange = (index, field, value) => {
    const updatedvehicle = [...vehicle];
    updatedvehicle[index][field] = value;
    setvehicle(updatedvehicle);
  };


  useEffect(() => {
    getWing()
  }, []);

  useEffect(() => {
    if (selectedWing !== '') {
      getUnit()
    }
  }, [selectedWing]);

  return <>
    <Paper elevation={5} className="d-flex" style={{ width: "fit-content" }}>
      <button onClick={() => setresidentType("Owner")} className={residentType === "Owner" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Owner</button>
      <button onClick={() => setresidentType("Tenant")} className={residentType === "Tenant" ? "btn fw-bold p-2 px-3 btn_primary" : "btn fw-bold p-2 px-3"} style={{ borderBottom: "2px solid #FE512E", fontSize: '14px' }}>Tenant</button>
    </Paper>
    {
      residentType === "Tenant" ? <Paper elevation={5} className="p-3 d-flex justify-content-between w-100">
        <div style={{ width: "32%" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="ownerName">Owner Full Name*</label><br />
          <TextField onChange={(e) => setOwnerInfo({ ...OwnerInfo, fullName: e.target.value })} className="w-100" id="ownerName" placeholder="Enter Full Name" variant="outlined" style={{ padding: "0px" }} />
        </div>
        <div style={{ width: "32%" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="ownerPhone">Owner Phone Number*</label><br />
          <TextField onChange={(e) => setOwnerInfo({ ...OwnerInfo, phoneNumber: e.target.value })} className="w-100" id="ownerPhone" placeholder="+91...." variant="outlined" style={{ padding: "0px" }} />
        </div>
        <div style={{ width: "32%" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="ownerAddress">Owner Address*</label><br />
          <TextField onChange={(e) => setOwnerInfo({ ...OwnerInfo, address: e.target.value })} className="w-100 p-0" id="ownerAddress" placeholder="Enter Address" variant="outlined" style={{ padding: "0px" }} />
        </div>
      </Paper> : ""
    }
    <Paper elevation={5} className="p-3 my-2">
      <div className="row">
        <div className="col-2">
          <label className="d-flex justify-content-center" htmlFor="file">
            <Avatar style={{ width: "100px", height: "100px" }} alt="" src={imagePreview || "/static/images/avatar/1.jpg"} />
            <input onChange={(e) => handleFileChange(e, "profileImage")} id="file" type="file" hidden /></label><br />
          <label htmlFor="file" className="mx-3 text-primary my-2 d-flex justify-content-center" style={{ fontSize: "14px" }}>Add Photo</label>
        </div>
        <div className="col-10">
          <div className="row gap-2 justify-content-start">
            <div style={{ width: "32%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="fullName">Full Name*</label><br />
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, fullName: e.target.value })} className="w-100" id="fullName" placeholder="Enter Full Name" variant="outlined" />
            </div>
            <div style={{ width: "32%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="phoneNumber">Phone Number*</label><br />
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, phoneNumber: e.target.value })} className="w-100" id="phoneNumber" placeholder="+91...." variant="outlined" />
            </div>
            <div style={{ width: "32%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="emailAddress">Email Address*</label><br />
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, email: e.target.value })} className="w-100" id="emailAddress" placeholder="Enter Email" variant="outlined" />
            </div>
          </div>
          <div className="row my-2 gap-2">
            <div style={{ width: "23.5%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="fullName">Age*</label><br />
              <TextField onChange={(e) => setRegisterDetails({ ...RegisterDetails, age: Number(e.target.value) })} className="w-100" id="age" placeholder="Age" variant="outlined" />
            </div>
            <div style={{ width: "24%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="gender">Gender*</label><br />
              <FormControl fullWidth>
                <Select
                  labelId="gender"
                  id="demo-simple-select"
                  value={selectedGender}
                  placeholder="Gender"
                  onChange={(e) => setselectedGender(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>--- Select Gender ---</em>
                  </MenuItem>
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Others"}>Others</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ width: "24%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="wing">Wing*</label><br />
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
            <div style={{ width: "24%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor="unit">Unit*</label><br />
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
        </div>
      </div>
      <div className="row">
        {/* <div className="col-3 p-3">
          <p style={{ fontSize: "12px", fontWeight: "bold" }}>Upload Aadhar Card (Front Side)</p>
          <label htmlFor="aadharfront" className="box py-3">
            <input id="aadharfront" type="file" hidden />
            <div className="logo d-flex justify-content-center">
              <AddPhotoAlternateIcon className="fs-1 text-muted" />
            </div>
            <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}><span className="text-primary">Upload a file</span><span>or drag and drop</span></div>
            <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
          </label>
        </div>
        <div className="col-3 p-3">
          <p style={{ fontSize: "12px", fontWeight: "bold" }}>Upload Aadhar Card (Back Side)</p>
          <label htmlFor="aadharback" className="box py-3">
            <input id="aadharback" type="file" hidden />
            <div className="logo d-flex justify-content-center">
              <AddPhotoAlternateIcon className="fs-1 text-muted" />
            </div>
            <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}>
              <span className="text-primary">Upload a file</span>
              <span>or drag and drop</span>
            </div>
            <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
          </label>
        </div>
        <div className="col-3 p-3">
          <p style={{ fontSize: "12px", fontWeight: "bold" }}>Address Proof (Vera Bill OR Light Bill)</p>
          <label htmlFor="address" className="box py-3">
            <input id="address" type="file" hidden />
            <div className="logo d-flex justify-content-center">
              <AddPhotoAlternateIcon className="fs-1 text-muted" />
            </div>
            <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}><span className="text-primary">Upload a file</span><span>or drag and drop</span></div>
            <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
          </label>
        </div >
        <div className="col-3 p-3">
          <p style={{ fontSize: "12px", fontWeight: "bold" }}>Rent Agreement</p>
          <label htmlFor="rent" className="box py-3">
            <input id="rent" type="file" hidden />
            <div className="logo d-flex justify-content-center">
              <AddPhotoAlternateIcon className="fs-1 text-muted" />
            </div>
            <div className="h6 fw-bold d-flex justify-content-center" style={{ fontSize: "14px" }}><span className="text-primary">Upload a file</span><span>or drag and drop</span></div>
            <div className="text-muted text-center" style={{ fontSize: '10px' }}>PNG, JPG, GIF up to 10MBs</div>
          </label>
        </div > */}
        {renderUploadSection("Upload Aadhar Card (Front Side)", "aadharFront")}
        {renderUploadSection("Upload Aadhar Card (Back Side)", "aadharBack")}
        {renderUploadSection("Address Proof (Vera Bill OR Light Bill)", "addressProof")}
        {renderUploadSection("Rent Agreement", "rentAgreement")}
      </div >
    </Paper >
    <Paper elevation={5} className="p-3 my-2">
      <div className="d-flex justify-content-between">
        <div style={{ fontSize: "14px", fontWeight: "bold" }}><span>Member Counting :</span><span className="text-muted"> (Others Members)</span></div>
        <div className="d-flex gap-2 align-items-center" style={{ fontSize: "14px", fontWeight: "bold" }}>
          <div>Select Member</div>
          <div style={{ width: "50px" }}>
            <FormControl fullWidth>
              {/* <InputLabel id="member">0</InputLabel> */}
              <Select
                labelId="member"
                id="demo-simple-select"
                value={mebetNumber}
                displayEmpty
                onChange={handleMemberCountChange}
              >
                <MenuItem value="">
                  <span>0</span>
                </MenuItem>
                {[...Array(9).keys()].map((number) => (
                  <MenuItem key={number + 1} value={number + 1}>
                    {number + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </div>
        </div>
      </div>
      <hr />
      {Array.from({ length: mebetNumber }).map((_, index) => (
        <div key={index} className="row mb-3">
          <div className="col-12 d-flex justify-content-between">
            <div style={{ width: "17%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`fullName-${index}`}>
                Full Name*
              </label>
              <TextField
                className="w-100"
                id={`fullName-${index}`}
                placeholder="Enter Full Name"
                variant="outlined"
                onChange={(e) => handleFamilyChange(index, "fullName", e.target.value)}
              />
            </div>
            <div style={{ width: "17%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`phoneNumber-${index}`}>
                Phone Number*
              </label>
              <TextField
                className="w-100"
                id={`phoneNumber-${index}`}
                placeholder="+91...."
                variant="outlined"
                onChange={(e) => handleFamilyChange(index, "phoneNumber", e.target.value)}
              />
            </div>
            <div style={{ width: "17%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`emailAddress-${index}`}>
                Email Address*
              </label>
              <TextField
                className="w-100"
                id={`emailAddress-${index}`}
                placeholder="Email Address"
                variant="outlined"
                onChange={(e) => handleFamilyChange(index, "email", e.target.value)}
              />
            </div>
            <div style={{ width: "12%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`age-${index}`}>
                Age*
              </label>
              <TextField
                className="w-100"
                id={`age-${index}`}
                placeholder="Age"
                variant="outlined"
                onChange={(e) => handleFamilyChange(index, "age", e.target.value)}
              />
            </div>
            <div style={{ width: "17%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`gender-${index}`}>
                Gender*
              </label>
              <FormControl fullWidth>
                {/* <InputLabel id={`gender-${index}`}>--- Select Gender ---</InputLabel> */}
                <Select
                  labelId={`gender-${index}`}
                  id={`gender-select-${index}`}
                  value={familyMember[index]?.gender}
                  displayEmpty
                  onChange={(e) => handleFamilyChange(index, "gender", e.target.value)}
                >
                  <MenuItem value="">
                    <em >--- Select Gender ---</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ width: "17%" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`relation-${index}`}>
                Relation
              </label>
              <TextField
                className="w-100"
                id={`relation-${index}`}
                placeholder="Relation"
                variant="outlined"
                onChange={(e) => handleFamilyChange(index, "relation", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </Paper>
    <Paper elevation={5} className="p-3 my-2">
      <div className="d-flex justify-content-between">
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>Vehicle Counting :</div>
        <div className="d-flex gap-2 align-items-center" style={{ fontSize: "14px", fontWeight: "bold" }}>
          <div>Select Vehicle</div>
          <div style={{ width: "50px" }}>
            <FormControl fullWidth>
              <InputLabel id="vehicale">0</InputLabel>
              <Select
                labelId="vehicale"
                id="demo-simple-select"
                value={vehicleCount}
                placeholder="Age"
                onChange={handleVehicleCountChange}
              >
                {[...Array(9).keys()].map((number) => (
                  <MenuItem key={number + 1} value={number + 1}>
                    {number + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <hr />
      <div className="row mb-3">
        {Array.from({ length: vehicleCount }).map((_, index) => (
          <div className="col-6 my-2">
            <div style={{ borderRadius: "8px", border: "2px solid lightgrey", width: "100%", display: "flex", padding: "8px", justifyContent: "space-between" }}>
              <div style={{ width: "32%" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`phoneNumber-${index}`}>
                  Vehicle Type*
                </label>
                <FormControl fullWidth>
                  <InputLabel id="vehicale">Vehicle Type</InputLabel>
                  <Select
                    labelId="vehicale"
                    id="demo-simple-select"
                    value={vehicle[index]?.vehicleType}
                    placeholder="Age"
                    onChange={(e) => handleVehicleChange(index, "vehicleType", e.target.value)}
                  >
                    <MenuItem key={0} value={"Two_Wheeler"}>Two Wheeler</MenuItem>
                    <MenuItem key={1} value={"Four_Wheeler"}>Four Wheeler</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ width: "32%" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`phoneNumber-${index}`}>
                  Vehicle Name*
                </label>
                <TextField
                  className="w-100"
                  id={`phoneNumber-${index}`}
                  placeholder="Vehicle Name"
                  variant="outlined"
                  onChange={(e) => handleVehicleChange(index, "vehicleName", e.target.value)}
                />
              </div>
              <div style={{ width: "32%" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold" }} htmlFor={`emailAddress-${index}`}>
                  Vehicle Number*
                </label>
                <TextField
                  className="w-100"
                  id={`emailAddress-${index}`}
                  placeholder="Vehicle Number"
                  variant="outlined"
                  onChange={(e) => handleVehicleChange(index, "vehicleNumber", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Paper>
    <Paper className="d-flex justify-content-end" style={{ background: "whitesmoke" }}>
      <button className="btn btn_outline mx-2 my-1">Cancel</button>
      <button className="btn btn_primary mx-2 my-1" onClick={registerHandler}>Save</button>
    </Paper>
  </>
}