'use client'

import axios from 'axios';
import AuthForm from '@/components/AuthForm';
import { SignUpFormValues } from '@/types';
import { API_URL } from '@/constants';

export default function SignUpPage() {
  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        firstname: values.fullName.split(' ')[0],
        lastname: values.fullName.split(' ')[1],
        email: values.email,
        password: values.password,
      });
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