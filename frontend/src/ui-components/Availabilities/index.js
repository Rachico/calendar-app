import {
    Button,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography,
  } from "@mui/material";
import React, { useState, useEffect, useSyncExternalStore } from "react";

import { Calendar, momentLocalizer  } from 'react-big-calendar' 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

import { useToasts } from 'react-toast-notifications';
import { getAll } from "../../services/availabilityService";
import { saveReservation } from "../../services/reservationService";


const localizer = momentLocalizer(moment)
  
const Availabilities = () => {

    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    let [slots, setSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [takenTimeSlots, setTakenTimeSlots] = useState([]);

    const [resFrom, setResFrom] = useState(null);
    const [resTo, setResTo] = useState(null);

  const handleSelectedTimeSlotChange = (event) => {
    let newTimeSlot = moment(event.target.value);
    // console.log(newTimeSlot._i);
    setSelectedTimeSlot(newTimeSlot._i);
    let selectedDate = selectedSlot.start;
    let reservationStartDateString = `${month_list[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()} ${newTimeSlot._i}`;
    console.log(reservationStartDateString);
    let  reservationStartDate = moment(reservationStartDateString);
    setResFrom(reservationStartDate);
  
    let  reservationEndDate = moment(reservationStartDateString);
    reservationEndDate.add(30, "minutes");  
    setResTo(reservationEndDate);
    
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

    const { addToast } = useToasts();
    

    const handleCloseBookingModal = () => {
        setOpenBookingModal(false);
    }

    const createTimeSlots = (start, end) => {
        let startTime = moment(start, "hh:mm A");
        let endTime = moment(end, "hh:mm A");
        let arr = [];
        while (startTime <= endTime) {
            arr.push(new moment(startTime).format("hh:mm A"));
            // The meeting duration is 30 minutes
            startTime.add(30, "minutes");
        }
        return arr;
    }  

    const getTakenTimeSlots = async (slot) => {
      let reservations = slot.reservations;

      let takenSlots = [];
      console.log("reservations" ,reservations);
      reservations.forEach((item, index) => {
        takenSlots.push(item.slot);   
      });
      return takenSlots;
      
    }
   
   const month_list = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
   const handleCreateReservation = async () => {
     try {
       await saveReservation({
         start : resFrom,
         end :  resTo,
         slot : selectedTimeSlot,
         availability_id : selectedSlot._id,
         email : email,
         title : title
       });
       setOpenBookingModal(false);
      addToast("Reservation created successfully. Please check your email for the meeting link.", { appearance: 'success' })
      } catch (error) {
        addToast(error.response.data, { appearance: 'error' })
       console.log(error);
     }
   }

    const fetchAvailabilities = async () => {
      try {
        const response = await getAll();
        let data = response.data;
        data.forEach(element => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
          
        });
        setSlots(data);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=> {
      fetchAvailabilities();
    }, []);

   
  
    
    
    return (
      <React.Fragment>
      {/******************* Booking Modal *********************************/}
      <Dialog open={openBookingModal} onClose={handleCloseBookingModal}>
        <DialogTitle>Book a Meeting for {selectedSlot ? `${month_list[selectedSlot.start.getMonth()]} ${selectedSlot.start.getDate()}, ${selectedSlot.start.getFullYear()}` : ""}</DialogTitle>
        <DialogContent>
      
          <TextField
            autoFocus
            value={email}
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            autoComplete="email"
            variant="outlined"
            onChange={handleEmailChange}
          />
          <TextField
            autoFocus
            value={title}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleTitleChange}
          />
        
        <FormControl>
        <FormLabel id="demo-radio-buttons-group-label" style={{marginTop:"10px"}}>Choose a Time Slot</FormLabel>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
        >
        {timeSlots.map((item, index) => {
            let endValue = timeSlots[index + 1] ? " - " + timeSlots[index + 1] : "";
            if (timeSlots[index + 1]) {
                return  <FormControlLabel value={item} control={<Radio />} label={item + endValue} onChange={handleSelectedTimeSlotChange} disabled={takenTimeSlots.includes(item)}/>  
            }
        })}
        </RadioGroup>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingModal}>Cancel</Button>
          <Button 
            onClick={handleCreateReservation}
            variant="contained"
          >
              Book
          </Button>
        </DialogActions>
      </Dialog>
      {/******************* Main Calendar Container **************************/}
      <Container>
        <Typography component="h1" variant="h2" style={{marginBottom:"40px", marginTop:"20px", fontFamily :"Poppins"}}>
              Book a meeting with me
        </Typography>
        <Calendar 
            localizer={localizer} 
            events={slots}
            view={"week"}
            views={false}
            
            onSelectEvent={event => {
                setSelectedSlot(event);
                setTimeSlots(createTimeSlots(event.start, event.end));
                setOpenBookingModal(true);
                getTakenTimeSlots(event).then((result)=>{
                  setTakenTimeSlots(result);
                  console.log(result);
                });
            }}
        />
      </Container>
    
     
    </React.Fragment>
      
    );
  
  }
  
  export default Availabilities;
  