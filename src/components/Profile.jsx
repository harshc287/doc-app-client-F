import React, { useEffect, useState } from "react";
import { getLoggedUser } from "../api/userAPI";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getLoggedUser();
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading profile...</p>
      </div>
    );

  if (!user)
    return <div className="alert alert-danger">Failed to load profile</div>;

  return (
    <div className="container">
      <h3 className="mb-4">👤 My Profile</h3>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">

              <div className="text-center mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: 80, height: 80, fontSize: 30 }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h5 className="mt-2">{user.name}</h5>
                <span className="badge bg-secondary">{user.role}</span>
              </div>

              <hr />

              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Role" value={user.role} />
              <ProfileRow label="User ID" value={user.id} />

              {user.role === "Doctor" && (
                <>
                  <hr />
                  <p className="text-muted text-center mb-0">
                    🩺 Doctor Account
                  </p>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ======================
   REUSABLE ROW
====================== */
const ProfileRow = ({ label, value }) => (
  <div className="d-flex justify-content-between mb-2">
    <strong>{label}</strong>
    <span>{value}</span>
  </div>
);

export default Profile;
