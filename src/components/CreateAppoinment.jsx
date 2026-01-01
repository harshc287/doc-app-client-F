import React, {useState, useEffect} from 'react'
import { getDoctorList } from '../api/userAPI'
import { saveAppointment } from '../api/appoinmentAPI'


const CreateAppoinment = () => {

    const [doctors,setDoctors] = useState([])
    const [dateTimeInput, setDateTimeInput] = useState("")
    const [doctorID, setDoctorId] = useState("")
  

    async function fetchData(){
        const res = await getDoctorList()
        if(res.data.success){
            setDoctors(res.data.doctors)
        }
    }
    useEffect(()=>{
      fetchData()
    },[])
    

function handleSubmit(e) {
    e.preventDefault()

    if (!dateTimeInput || !doctorID) {
      alert("Please select date & doctor")
      return
    }

    saveAppointment({
      dateTime: dateTimeInput,
      doctorId: doctorID
      
    })
    alert("Appointment created");
  }

  return (
  <div className="card p-4">
      <h4>Create Appointment</h4>

      <form onSubmit={handleSubmit}>

        {/* Date & Time */}
        <div className="mb-3">
          <label className="form-label">Select Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
        </div>

        {/* Doctor List */}
        <div className="mb-3">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-select"
            value={doctorID}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Appointment
        </button>
      </form>
    </div>
  )
}

export default CreateAppoinment
