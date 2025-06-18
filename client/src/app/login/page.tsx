"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/types";
import { login } from "@/api";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const data = await login(values.email, values.password);
      document.cookie = `authToken=${data.accessToken}; path=/`;
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("token", data.accessToken);
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
