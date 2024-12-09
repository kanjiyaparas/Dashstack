import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Box, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import apiHelper from '../../../Common/ApiHelper';
import { enqueueSnackbar, useSnackbar } from 'notistack';

export default function EmergencyManagement({ userInfo }) {
  const [alertType, setAlertType] = useState('');
  const [description, setDescription] = useState('');
  const [emergencydata, setemergencydata] = useState({
    alertType: '',
    description: ''
  })
  const { enqueueSnackbar } = useSnackbar()
  const isFormFilled = emergencydata.alertType && emergencydata.description;

  const createemergency = async () => {
    try {
      const data = {
        ...emergencydata,
        societyId: userInfo.societyData.societyId,
        securityId: userInfo?._id
      }

      const result = await apiHelper.createemergency(data)
      if (result && result.data) {
        enqueueSnackbar('Emergency Message Sent', { variant: 'info' })
        setemergencydata({
          alertType: '',
          description: ''
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#F6F8FB', height: '80vh' }}>
      <Box
        sx={{
          width: 500,
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h5" style={{ textAlign: 'left', fontWeight: '700' }} gutterBottom>
          Alert
        </Typography>

        <Form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <label style={{ fontSize: "14px" }} htmlFor="description">Visitor Name <span style={{ color: 'red' }}>*</span></label>
            <Select
              value={emergencydata.alertType}
              displayEmpty
              onChange={(e) => setemergencydata({ ...emergencydata, alertType: e.target.value })}
            >
              <MenuItem value="">
                <em className='text-muted' color='#A7A7A7'>Select Alert</em>
              </MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
              <MenuItem value="Warning">Warning</MenuItem>
              <MenuItem value="Information">Information</MenuItem>
              <MenuItem value="Information">Fire Alarm</MenuItem>
              <MenuItem value="Information">High Winds</MenuItem>
              <MenuItem value="Information">Thunder</MenuItem>
            </Select>
          </FormControl>
          <label style={{ fontSize: "14px" }} htmlFor="description">Discription<span style={{ color: 'red' }}>*</span></label>
          <TextField
            multiline
            rows={4}
            placeholder="An emergency description typically refers to a detailed account or explanation of an emergency situation."
            variant="outlined"
            fullWidth
            margin="normal"
            value={emergencydata.description}
            onChange={(e) => setemergencydata({ ...emergencydata, description: e.target.value })}
          />

          <Button
            variant="contained"
            className="w-100 mt-3"
            style={{
              backgroundColor: isFormFilled ? '' : '#F6F8FB',
              backgroundImage: isFormFilled ? 'linear-gradient(#FE512E, #F09619)' : 'none',
              color: isFormFilled ? 'white' : 'black',
              border: 'none',
              fontWeight: '700',
              cursor: isFormFilled ? 'pointer' : 'not-allowed',
            }}
            disabled={!isFormFilled}
            onClick={createemergency}
          >
            Send
          </Button>
        </Form>
      </Box>
    </Container>
  );
}