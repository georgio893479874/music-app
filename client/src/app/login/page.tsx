"use client";

import axios from "axios";
import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/types";
import { API_URL } from "@/constants";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      document.cookie = `authToken=${response.data.accessToken}; path=/`;
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("token", response.data.accessToken);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthForm
      title="Login"
      buttonText="Log In"
      type="login"
      onSubmit={handleLoginSubmit}
    />
  );
}
