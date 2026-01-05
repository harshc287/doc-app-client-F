import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../api/doctorAPI";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctors();
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4 className="mb-3">👨‍⚕️ Doctors</h4>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialist</th>
            <th>Fees</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.user?.name}</td>
              <td>{doc.Specialist}</td>
              <td>₹{doc.fees}</td>
              <td>{doc.user?.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;
