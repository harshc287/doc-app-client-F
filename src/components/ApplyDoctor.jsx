import React, { useState } from "react";
import { applyDoctor } from "../api/doctorAPI";

const ApplyDoctor = () => {
  const [Specialist, setSpecialist] = useState("");
  const [fees, setFees] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!Specialist || !fees) {
      setMsg("All fields required");
      return;
    }

    try {
      setLoading(true);
      const res = await applyDoctor({ Specialist, fees });
      if (res.data.success) {
        setMsg("✅ Doctor application submitted");
        setSpecialist("");
        setFees("");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container col-md-6">
      <div className="card p-4 shadow">
        <h4>🩺 Apply for Doctor</h4>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Specialist"
            value={Specialist}
            onChange={(e) => setSpecialist(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Fees"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Apply"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyDoctor;
