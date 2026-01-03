import React, { useEffect, useState } from "react";
import { getDoctorList } from "../api/userAPI";
import { saveAppointment } from "../api/appoinmentAPI";

const CreateAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctorList();
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch {
      setError("Failed to load doctors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!doctorId || !dateTime) {
      setError("Please select doctor & date");
      return;
    }

    try {
      setLoading(true);
      await saveAppointment({ doctorId, dateTime });
      alert("✅ Appointment created successfully");
      setDoctorId("");
      setDateTime("");
    } catch (err) {
      setError(err.response?.data?.msg || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container col-md-6">
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">📅 Create Appointment</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Doctor</label>
            <select
              className="form-select"
              value={doctorId}
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

          <div className="mb-3">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
