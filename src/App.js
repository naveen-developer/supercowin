import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Style.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {

const [data, setData] = useState([]);

const [formData, setFormData] = useState({
  vtype : "Free",
  dtype : "dose1",
  location: "392"
});


const [startDate, setStartDate] = useState(new Date());
let dayNumber = startDate.getDate();
let dayMonth = startDate.getMonth() + 1;



const { vtype, dtype, location } = formData;

const handleChange = event => {
  const { name, value } = event.target;
  setFormData({...formData, [name]:value});
}

// console.log("This is vaccine type "+vtype);
// console.log("This is selected date "+startDate.getDate());
// console.log("This is selected Month "+startDate.getMonth());


useEffect(() => {
  Axios.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+location+"&date="+dayNumber+"-"+dayMonth+"-2021")
  .then( res => setData(res.data.centers));
}, [location, dayNumber, dayMonth])



  return (
    <div className="App">
      <h1>Supper Cowin App</h1>
      <div className="filtersDiv">

        <div className="vacinetypeDiv">
          <label className="container">Free
            <input type="radio" value="Free" name="vtype" onChange={handleChange} checked={vtype === "Free"}   />
            <span className="checkmark"></span>
          </label>
          <label className="container">Paid
            <input type="radio" value="Paid" name="vtype" onChange={handleChange} checked={vtype === "Paid"}  />
            <span className="checkmark"></span>
          </label>
        </div>

        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <div className="Dropdown-root">
          <div className="locationDiv">
          <label>Selected Location</label>
          <select className="customizeSelect" name="location" onChange={handleChange}>
            <option value="392"> Thane </option>
            <option value="395"> Mumbai </option>
            <option value="363"> Pune </option>
            <option value="389"> Nashik </option>
          </select>
          </div>
        </div>


        <div className="vacinetypeDiv">
        <label className="container">Dose 1
            <input type="radio" value="dose1" name="dtype" onChange={handleChange} checked={dtype === "dose1"}   />
            <span className="checkmark"></span>
          </label>
          <label className="container">Dose 2
            <input type="radio" value="dose2" name="dtype" onChange={handleChange} checked={dtype === "dose2"}  />
            <span className="checkmark"></span>
          </label>
        </div>


      </div>
      {
        data.map((values, index) => {

          //values.sessions = values.sessions.filter((elem) => elem.available_capacity_dose1 > 0)          

           values.sessions = (dtype === "dose1") ? values.sessions.filter((elem) => elem.available_capacity_dose1 > 0) :

           values.sessions.filter((elem) => elem.available_capacity_dose2 > 0)

          if(values.sessions.length > 0 && values.fee_type === vtype){
            
               return (
                 <div className="mainDiv" key={index}>
                   <p><b>Title:- </b>{values.name}</p>
                   <p><b>Address:- </b>{values.address}</p>
                   <p><b>District:- </b>{values.district_name}</p>
                   <p><b>State Name:- </b>{values.state_name}</p>
                   <p><b>Pincode:- </b>{values.pincode}</p>
                   <p><b>Vaccine Type:- </b>{values.fee_type}</p>
   
                   {values.sessions.map((val, index) => {
                     return (
                       <div className="mainDiv vacineAvailableDiv" key={index}>
                         <p><b>Date:- </b>{val.date}</p>
                         <p><b>Available Dose 1:- </b>{val.available_capacity_dose1}</p>
                         <p><b>Available Dose 2:- </b>{val.available_capacity_dose2}</p>
                         <p><b>Vaccine Type:-</b> {val.vaccine}</p>
                         <p><b>Age limit:-</b> {val.min_age_limit}</p>
                       </div>
                     )
   
                   })}
                 </div>
               )
             }


           




        })
      }
    </div>
  );
}

export default App;
