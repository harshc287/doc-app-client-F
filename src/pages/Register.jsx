import { useState } from "react";
import { registerUser } from "../api/userAPI";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);

      if (res.data.success) {
        toast.success(res.data.msg);
        navigate("/");
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header text-center bg-success text-white rounded-top-4">
              <h4 className="mb-0">Create Account ✨</h4>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-success btn-lg w-100">
                  Register
                </button>
              </form>

              {/* 🔹 LOGIN LINK */}
              <div className="text-center mt-4">
                <span className="text-muted">Already have an account?</span>{" "}
                <Link to="/" className="fw-semibold text-success">
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
