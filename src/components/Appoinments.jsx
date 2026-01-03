import React, { useEffect, useState } from "react";
import {
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment 
} from "../api/appoinmentAPI";


import { getLoggedUser } from "../api/userAPI";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Doctor status modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // User edit modal
  const [editAppointment, setEditAppointment] = useState(null);
  const [editDateTime, setEditDateTime] = useState("");
  const [editDoctorId, setEditDoctorId] = useState("");

  // Toast
  const [toast, setToast] = useState("");

  /* ======================
        FETCH DATA
  =======================*/
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const userRes = await getLoggedUser();
      const loggedUser = userRes.data.user;
      setUser(loggedUser);

      const res =
        loggedUser.role === "Doctor"
          ? await showAppointmentsOfDoctor()
          : await getAppointmentsByUser();

      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
        USER EDIT SUBMIT
  =======================*/
  const handleEditSubmit = async () => {
    try {
      await updateAppointment(editAppointment.id, {
        dateTime: editDateTime,
        doctorId: editDoctorId,
      });

      setEditAppointment(null);
      fetchData();
      setToast("Appointment updated successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };


  //delete appoinment
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this appointment?"))
    return;

  try {
    await deleteAppointment(id);
    setToast("Appointment deleted successfully");
    fetchData();
  } catch (err) {
    alert(err.response?.data?.msg || "Delete failed");
  }
};


  /* ======================
        DOCTOR STATUS UPDATE
  =======================*/
  const confirmAction = async () => {
    try {
      setActionLoading(true);
      await updateAppointmentStatus(
        selectedAppointment.id,
        selectedStatus
      );
      setToast("Appointment status updated");
      setSelectedAppointment(null);
      fetchData();
    } catch {
      setToast("Status update failed");
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  /* ======================
        STATUS BADGE
  =======================*/
  const badge = (status) => {
    const map = {
      Pending: "warning",
      Accepted: "success",
      Completed: "primary",
      Reject: "danger",
    };
    return `badge rounded-pill px-3 py-2 bg-${map[status] || "secondary"}`;
  };

  /* ======================
        LOADING / ERROR
  =======================*/
  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (!appointments.length)
    return (
      <div className="text-center mt-5 text-muted">
        <h4>📭 No Appointments</h4>
        <p>You don’t have any appointments yet.</p>
      </div>
    );

  /* ======================
        UI
  =======================*/
  return (
    <div className="container">
      <h3 className="mb-4">
        {user?.role === "Doctor" ? "🩺 My Appointments" : "📅 My Appointments"}
      </h3>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>{user?.role === "Doctor" ? "Patient ID" : "Doctor ID"}</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {user?.role === "Doctor" && <th>Action</th>}
                  {user?.role === "User" && <th>Edit</th>}
                </tr>
              </thead>

              <tbody>
                {appointments.map((a, i) => {
                  const d = new Date(a.dateTime);

                  return (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td>{user?.role === "Doctor" ? a.createdBy : a.doctorId}</td>
                      <td>{d.toLocaleDateString()}</td>
                      <td>{d.toLocaleTimeString()}</td>
                      <td>
                        <span className={badge(a.status)}>{a.status}</span>
                      </td>

                      {/* DOCTOR ACTIONS */}
                      {user?.role === "Doctor" && (
                        <td>
                          {a.status === "Pending" && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                  setSelectedAppointment(a);
                                  setSelectedStatus("Accepted");
                                }}
                              >
                                ✅ Accept
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  setSelectedAppointment(a);
                                  setSelectedStatus("Reject");
                                }}
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}

                          {a.status === "Accepted" && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedAppointment(a);
                                setSelectedStatus("Completed");
                              }}
                            >
                              ✔ Complete
                            </button>
                          )}
                        </td>
                      )}

                      {/* USER EDIT */}
{user?.role === "User" && (
  <td className="text-center">
    {a.status === "Pending" ? (
      <div className="d-flex gap-2 justify-content-center">
        {/* EDIT */}
        <button
          className="btn btn-warning btn-sm"
          onClick={() => {
            setEditAppointment(a);
            setEditDateTime(a.dateTime.slice(0, 16));
            setEditDoctorId(a.doctorId);
          }}
        >
          ✏️ Edit
        </button>

        {/* DELETE */}
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => handleDelete(a.id)}
        >
          🗑 Delete
        </button>
      </div>
    ) : (
      <button className="btn btn-secondary btn-sm" disabled>
        🔒 Locked
      </button>
    )}
  </td>
)}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================
            STATUS MODAL
      =======================*/}
      {selectedAppointment && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Confirm Action</h5>
                <p>
                  Mark appointment as
                  <b className="text-primary"> {selectedStatus}</b>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmAction}
                  disabled={actionLoading}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================
            EDIT MODAL
      =======================*/}
      {editAppointment && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>✏️ Edit Appointment</h5>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">📅 Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={editDateTime}
                    onChange={(e) => setEditDateTime(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">👨‍⚕️ Doctor ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editDoctorId}
                    onChange={(e) => setEditDoctorId(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditAppointment(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleEditSubmit}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast show position-fixed bottom-0 end-0 m-3">
          <div className="toast-body bg-dark text-white rounded shadow">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
