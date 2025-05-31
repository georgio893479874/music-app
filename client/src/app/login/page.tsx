"use client";

import axios from "axios";
import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/types";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      document.cookie = `authToken=${response.data.accessToken}; path=/`;
      localStorage.setItem("userId", response.data.user.id);
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
