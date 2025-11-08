import { Checkbox, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import FormButton from "../../components/common/FormButton";
import api from "../../api";
import { useFormik } from "formik";
import * as Yup from "yup";
import loginImage from '../../assets/images/admin/login/login-img.png'

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  // ✅ Yup Validation
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Login ID is required")
      .email("Invalid email"),
    password: Yup.string().required("Password is required"),
    checked: Yup.boolean(),
  });

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      checked: false,

      // showPassword: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resp = await api.post("api/v1/admin/AssetLogin", {
          Email: values.email,
          Password: values.password,
        });

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: resp.data.message || "Welcome!",
          showConfirmButton: true,
        });

        localStorage.setItem("token", resp.data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...resp.data.data.user, role: resp.data.data.user.IsAdmin ? "Super Admin" : resp.data?.data?.user?.Entity?.AssetCategoryLevel1?.lookup_value } || {})
        );
        localStorage.setItem("main_user", JSON.stringify(resp.data.data.user));

        const user = resp.data.data.user;
        const isAdmin = user.IsAdmin;

        if (isAdmin) {
          navigate("/admindashboard");
        } else {
          const assetCategory = user.Entity?.AssetCategoryLevel1?.lookup_value;
          if (assetCategory === "Hospital") {
            navigate("/hospitaldashboard");
          } else if (assetCategory === "Doctor") {
            navigate("/doctordashboard");
          } else {
            navigate("/doctordashboard");
          }
        }

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error?.response?.data?.message || "Something went wrong!",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="h-screen overflow-auto grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
      <div className="flex items-center justify-center xs:px-2 sm:px-4 py-4">
        <img
          src={loginImage}
          alt="Signupbg"
          className="w-full max-h-[600px] h-full object-cover rounded-lg"
        />
      </div>

      {/* ==== Login Form ===== */}
      <div className="flex w-full justify-center flex-col py-8 md:py-14 xs:px-4 sm:px-6 md:px-20">
        <div className="flex items-center justify-center mb-8"></div>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Need an account?{" "}
          <Link to="/signup" className="text-primary underline">
            Sign Up
          </Link>
        </Typography>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 mt-8 rounded-md"
        >
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="Login ID"
              name="email"
              placeholder="Enter mobile number / email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Checkbox
                id="remember"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-checked": { color: "var(--primary)" },
                }}
                checked={formik.values.checked}
                onChange={(e) =>
                  formik.setFieldValue("checked", e.target.checked)
                }
              />
              <label htmlFor="remember" className="text-primary cursor-pointer">
                Remember me
              </label>
            </div>

            <Link to="/forgot-password" className="text-primary underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-2">
            <FormButton className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </FormButton>
          </div>
        </form>
      </div>
      {/* ===== End Login Form ===== */}
    </div>
  );
};

export default Login;
