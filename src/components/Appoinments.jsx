import React, { useEffect, useState } from "react";
import {
  getAppointmentsByUser,
  updateAppointmentStatus,
} from "../api/appoinmentAPI";
import { getLoggedUser } from "../api/userAPI";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // modal + action state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await getLoggedUser();
      setUser(userRes.data.user);

      const res = await getAppointmentsByUser();
      setAppointments(res.data.appointments);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      STATUS UPDATE
  =======================*/
  const confirmAction = async () => {
    try {
      setActionLoading(true);
      await updateAppointmentStatus(
        selectedAppointment.id,
        selectedStatus
      );
      showToastMessage("Appointment status updated successfully");
      setSelectedAppointment(null);
      fetchData();
    } catch (err) {
      showToastMessage(
        err.response?.data?.msg || "Status update failed",
        true
      );
    } finally {
      setActionLoading(false);
    }
  };

  const showToastMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning text-dark";
      case "Accepted":
        return "badge bg-success";
      case "Completed":
        return "badge bg-primary";
      case "Reject":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (appointments.length === 0)
    return <div className="alert alert-info">No appointments yet</div>;

  return (
    <div className="container">
      <h3 className="mb-4">📅 My Appointments</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>{user?.role === "Doctor" ? "Patient ID" : "Doctor ID"}</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {user?.role === "Doctor" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {appointments.map((a, i) => {
              const date = new Date(a.dateTime);

              return (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>
                    {user?.role === "Doctor" ? a.createdBy : a.doctorId}
                  </td>
                  <td>{date.toLocaleDateString()}</td>
                  <td>{date.toLocaleTimeString()}</td>
                  <td>
                    <span className={getStatusBadge(a.status)}>
                      {a.status}
                    </span>
                  </td>

                  {user?.role === "Doctor" && (
                    <td>
                      {a.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            disabled={actionLoading}
                            onClick={() => {
                              setSelectedAppointment(a);
                              setSelectedStatus("Accepted");
                            }}
                          >
                            Accept
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            disabled={actionLoading}
                            onClick={() => {
                              setSelectedAppointment(a);
                              setSelectedStatus("Reject");
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {a.status === "Accepted" && (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={actionLoading}
                          onClick={() => {
                            setSelectedAppointment(a);
                            setSelectedStatus("Completed");
                          }}
                        >
                          Complete
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

      {/* ======================
           CONFIRM MODAL
      ======================= */}
      {selectedAppointment && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to{" "}
                <strong>{selectedStatus}</strong> this appointment?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedAppointment(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================
           TOAST
      ======================= */}
      {showToast && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast-body bg-success text-white">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
