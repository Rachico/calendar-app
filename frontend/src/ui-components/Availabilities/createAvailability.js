import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Container,
    Box,
    Typography,
    CssBaseline,
    TextField,
    Button,
} from "@mui/material";

import React, {useState} from "react";

import { DateTimePicker } from '@mui/x-date-pickers';
import { useToasts } from 'react-toast-notifications';
import { saveAvailability } from '../../services/availabilityService';

const CreateAvailability = () => {
    
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false); 
    let currentDate = new Date();
    
    const { addToast } = useToasts();



  const handleSubmitAvailability = async () => {
    try {
        setIsLoading(true);
        await saveAvailability({
            start : new Date(start),
            end : new Date(end)
        });
        setIsLoading(false);
        addToast(`Saved Availability from ${start.toUTCString()} to ${end.toUTCString()}.`, { appearance: 'success' })
    } catch (error) {
        console.log(error);
        addToast(error.response.data, { appearance: 'error' })
        setIsLoading(false);
    }

  }

    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box
            component="form"
            sx={{
              mt: 8,
            }}
          >
            <Typography component="h1" variant="h2" style={{marginBottom:"40px", fontFamily :"Poppins"}}>
              Add availability
            </Typography>

    
           
           <LocalizationProvider dateAdapter={AdapterDateFns}>
           <DateTimePicker
                renderInput={(props) => <TextField {...props} sx={{ width: 400, marginRight : "10px"}}/>}
                label="Start"
                value={start}
                minDate={currentDate}
                onChange={(newValue) => {
                    setStart(newValue);
                }}
            />
           <DateTimePicker
                renderInput={(props) => <TextField {...props} sx={{ width: 400, marginRight : "10px"}}/>}
                label="End"
                value={end}
                minDate={start}
                onChange={(newValue) => {
                    setEnd(newValue);
                }}
            />
        
            <Button 
                variant='contained' 
                sx={{height : "56px", width : "100px"}}
                onClick={handleSubmitAvailability}
                disabled={isLoading}
            >
                Save
            </Button>
          
           </LocalizationProvider>
           
           
            
          </Box>
          
     
        </Container>
      </React.Fragment>
    );
 }


 export default CreateAvailability;

