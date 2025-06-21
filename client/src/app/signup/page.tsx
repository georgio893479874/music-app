'use client'

import AuthForm from '@/components/AuthForm';
import { SignUpFormValues } from '@/types';
import { signup } from '@/api';

export default function SignUpPage() {
  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    try {
      await signup(values.firstName, values.lastName, values.email, values.password);
    } catch (error) {
      throw error;
    }
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