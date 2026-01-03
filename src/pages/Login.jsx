import { useState } from "react";
import { loginUser } from "../api/userAPI";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      if (res.data.success) {
        toast.success(res.data.msg);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header text-center bg-primary text-white rounded-top-4">
              <h4 className="mb-0">Welcome Back 👋</h4>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Login
                </button>
              </form>

              {/* 🔹 REGISTER LINK */}
              <div className="text-center mt-4">
                <span className="text-muted">Don’t have an account?</span>{" "}
                <Link to="/register" className="fw-semibold text-primary">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
