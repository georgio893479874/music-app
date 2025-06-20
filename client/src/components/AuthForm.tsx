"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthFormProps } from "@/types";
import { AxiosError } from "axios";
import Image from "next/image";

const sliderImages = [
  {
    src: "/slider1.jpg",
    alt: "Slider 1",
    caption: "Capturing Moments,\nCreating Memories",
  },
  {
    src: "/slider2.jpg",
    alt: "Slider 2",
    caption: "Share your best moments",
  },
  {
    src: "/slider3.jpg",
    alt: "Slider 3",
    caption: "Stay connected with friends",
  },
];

const AuthForm: React.FC<AuthFormProps> = ({
  buttonText,
  type,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    ...(type === "signup"
      ? {
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          terms: Yup.bool().oneOf([true], "You must accept the terms & conditions"),
        }
      : {
          rememberMe: Yup.boolean(),
        }),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        await onSubmit(values);
      } catch (error) {
        const err = error as AxiosError<{ message?: string | string[] }>;
        if (err.response && err.response.data && err.response.data.message) {
          setError(
            Array.isArray(err.response.data.message)
              ? err.response.data.message.join(", ")
              : err.response.data.message
          );
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#242134]">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative hidden md:flex flex-col justify-between w-1/2 bg-[#2c283c] py-8 px-6">
          <div>
            <div className="flex justify-between items-center">
              <Image src="/logo.png" alt="Logo" width={80} height={32} className="w-28 h-auto object-contain filter invert"/>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <Image
                src={sliderImages[sliderIndex].src}
                alt={sliderImages[sliderIndex].alt}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 text-white text-xl font-medium bg-gradient-to-t from-[#242134]/90 via-[#242134]/50 to-transparent">
                {sliderImages[sliderIndex].caption.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              {sliderImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`block w-3 h-1 rounded-full ${
                    sliderIndex === idx
                      ? "bg-white"
                      : "bg-[#4d4662]"
                  } transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#242134] py-12 px-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {type === "signup" ? "Create an account" : "Sign in to your account"}
            </h2>
            <p className="text-[#a3a3c2] mb-6">
              {type === "signup" ? (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="text-[#a084ef] underline hover:text-[#b69bf7] transition">Log in</a>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="text-[#a084ef] underline hover:text-[#b69bf7] transition">Register here</a>
                </>
              )}
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {type === "signup" && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 rounded-lg bg-[#2c283c] text-white border ${
                        formik.errors.firstName && formik.touched.firstName
                          ? "border-red-500"
                          : "border-[#38324e]"
                      } focus:outline-none focus:border-[#a084ef]`}
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 rounded-lg bg-[#2c283c] text-white border ${
                        formik.errors.lastName && formik.touched.lastName
                          ? "border-red-500"
                          : "border-[#38324e]"
                      } focus:outline-none focus:border-[#a084ef]`}
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                    )}
                  </div>
                </div>
              )}
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-[#2c283c] text-white border ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : "border-[#38324e]"
                } focus:outline-none focus:border-[#a084ef]`}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-[#2c283c] text-white border pr-12 ${
                    formik.errors.password && formik.touched.password
                      ? "border-red-500"
                      : "border-[#38324e]"
                  } focus:outline-none focus:border-[#a084ef]`}
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3c2]"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                )}
              </div>
              {type === "signup" ? (
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formik.values.terms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="accent-[#a084ef] w-4 h-4"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-[#a3a3c2]"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        className="text-[#a084ef] underline hover:text-[#b69bf7] transition"
                      >
                        Terms &amp; Conditions
                      </a>
                    </label>
                  </div>
                  {formik.errors.terms && formik.touched.terms && (
                    <div className="text-red-500 text-xs mb-2">{formik.errors.terms}</div>
                  )}
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    className="accent-[#a084ef] w-4 h-4"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-[#a3a3c2]"
                  >
                    Remember me
                  </label>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#a084ef] text-white py-3 px-4 rounded-lg font-semibold text-lg mt-2 hover:bg-[#b69bf7] transition"
              >
                {buttonText || (type === "signup" ? "Create account" : "Sign in")}
              </button>
            </form>
            <div className="flex items-center my-6 gap-2">
              <div className="flex-1 h-px bg-[#38324e]" />
              <span className="text-[#a3a3c2] text-sm">
                Or {type === "signup" ? "register" : "sign in"} with
              </span>
              <div className="flex-1 h-px bg-[#38324e]" />
            </div>
            <div className="flex flex-row gap-2">
              <a
                href="http://localhost:4521/auth/google"
                className="flex-1 flex items-center justify-center gap-2 border border-[#38324e] text-white py-2 px-4 rounded-lg bg-[#242134] hover:bg-[#2c283c] transition"
              >
                <Image src="/google-icon.png" alt="Google" width={20} height={20} />
                Google
              </a>
              <a
                href="http://localhost:4521/auth/facebook"
                className="flex-1 flex items-center justify-center gap-2 border border-[#38324e] text-white py-2 px-4 rounded-lg bg-[#242134] hover:bg-[#2c283c] transition"
              >
                <Image src="/facebook-icon.png" alt="Facebook" width={20} height={20} />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;