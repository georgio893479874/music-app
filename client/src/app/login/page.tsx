"use client";

import axios from "axios";
import AuthForm from "@/components/AuthForm/page";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      router.push("/dashboard");
    } 
    
    catch (error) {
      console.error(error);
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
