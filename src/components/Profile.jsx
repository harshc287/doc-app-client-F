import React, { useEffect, useState } from "react";
import { getLoggedUser, uploadProfileImage } from "../api/userAPI";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getLoggedUser();
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Select an image first");

    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      setUploading(true);
      await uploadProfileImage(formData);
      alert("Profile image updated");
      setImage(null);
      setPreview(null);
      fetchUser();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
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
    return <div className="alert alert-danger">Profile not found</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow-lg border-0">
            <div className="card-body text-center">

              {/* PROFILE IMAGE */}
              <div className="position-relative d-inline-block mb-3">
                <img
                  src={
                    preview ||
                    (user.profileImage
                      ? `http://localhost:7005${user.profileImage}`
                      : `https://ui-avatars.com/api/?name=${user.name}&background=0D6EFD&color=fff`)
                  }
                  alt="Profile"
                  className="rounded-circle border"
                  style={{ width: 130, height: 130, objectFit: "cover" }}
                />
              </div>

              <h4 className="mb-0">{user.name}</h4>
              <span className="badge bg-primary mt-1">{user.role}</span>

              <hr />

              {/* PROFILE INFO */}
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Contact" value={user.contactNumber || "—"} />
              <ProfileRow label="Address" value={user.address || "—"} />

              <hr />

              {/* UPLOAD */}
              <div className="text-start">
                <label className="form-label fw-bold">
                  Update Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handleFileChange}
                />

                <button
                  className="btn btn-primary w-100"
                  disabled={uploading}
                  onClick={handleUpload}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ===== Reusable Row ===== */
const ProfileRow = ({ label, value }) => (
  <div className="d-flex justify-content-between mb-2">
    <span className="fw-semibold">{label}</span>
    <span className="text-muted">{value}</span>
  </div>
);

export default Profile;
