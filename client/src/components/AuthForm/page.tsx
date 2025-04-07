'use client'

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";

interface AuthFormProps {
  title: string;
  buttonText: string;
  type: "signup" | "login";
  onSubmit: (values: AuthFormValues) => void;
}

interface AuthFormValues {
  fullName: string;
  email: string;
  password: string;
  rememberMe: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  buttonText,
  type,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    fullName:
      type === "signup"
        ? Yup.string().required("Full name is required")
        : Yup.string(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        onSubmit(values);
      } 
      catch (error: unknown) {
        if (error instanceof Error) {
          setError(`An error occurred: ${error.message}`);
        } 

        else {
          setError('An unknown error occurred.');
        }
      }
    },
  });

  return (
    <div className="flex items-center flex-col lg:flex-row justify-center min-h-screen bg-gray-800">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl lg:rounded-lg lg:shadow-lg overflow-hidden lg:h-1/2">
        <div
          className="background-image hidden lg:block w-full lg:w-11/12 lg:h-auto bg-cover bg-center"
          style={{
            backgroundImage: 'url("/party-woman.jpg")',
          }}
        />
        <div className="border-none flex items-center justify-center lg:hidden w-full lg:w-1/2 bg-gray-900 text-white">
          <Image
            src="/login-icon.png"
            alt="Login Icon"
            width={384}
            height={384}
          />
        </div>
        <div className="lg:w-full flex items-center justify-center px-6 bg-gray-900 text-white lg:px-8 pb-8">
          <div className="w-full max-w-md">
            <h2 className="text-4xl lg:text-3xl font-bold text-gray-100 mb-4 lg:mb-6 lg:mt-6">
              Notent
            </h2>
            <p className="text-gray-300 mb-4 lg:mb-6">{title}</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={formik.handleSubmit}>
              {type === "signup" && (
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                  />
                  {formik.errors.fullName && formik.touched.fullName && (
                    <div className="text-red-500">{formik.errors.fullName}</div>
                  )}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm text-gray-300">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white pr-12"
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 mt-8"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 lg:mb-6 relative">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    className="hidden-checkbox"
                  />
                  <label htmlFor="rememberMe" className="checkbox-label">
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-300"
              >
                {buttonText}
              </button>
            </form>
            <p className="mt-4 lg:mt-6 text-center text-gray-300">
              {type === "signup"
                ? "Do You Have An Account?"
                : "Don't Have An Account?"}{" "}
              <a
                href={type === "signup" ? "/login" : "/signup"}
                className="text-indigo-400"
              >
                {type === "signup" ? "Sign In" : "Register Here"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
