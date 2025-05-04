'use client'

import axios from 'axios';
import AuthForm from '@/components/AuthForm/page';
import { SignUpFormValues } from '@/types';

export default function SignUpPage() {
  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      firstname: values.fullName.split(' ')[0],
      lastname: values.fullName.split(' ')[1],
      email: values.email,
      password: values.password,
    });
  };

  return (
    <AuthForm
      title="Sign Up"
      buttonText="Register"
      type="signup"
      onSubmit={handleSignUpSubmit}
    />
  )
}