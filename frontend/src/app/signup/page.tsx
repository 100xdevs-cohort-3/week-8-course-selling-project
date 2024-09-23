"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface ErrorResponse {
  message?: string; // Optional, in case it's not always present
}

interface AxiosError {
  response?: {
    data?: ErrorResponse;
  };
}

export default function SignUpComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = process.env.URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    const username = document.getElementById("username") as HTMLInputElement;
    const email = document.getElementById("email-address") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    try {
      const response = await axios.post(
        `${apiUrl}/user/signup` || "http://localhost:8000/user/signup",
        {
          username: username.value,
          email: email.value,
          password: password.value,
        }
      );
      console.log(response.data.message);
      if (response.status === 201) {
        window.location.href = "/signin";
        setIsSubmitting(false);
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred";

      const axiosError = err as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        errorMessage = axiosError.response.data.message || errorMessage;
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-zinc-900'>
      <p className='text-red-500 pb-3'>{error}</p>
      <div className='w-full max-w-md space-y-8 p-8 bg-zinc-800 rounded-xl shadow-lg'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-zinc-100'>
            Create your account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <Label htmlFor='username' className='sr-only'>
                Username
              </Label>
              <Input
                id='username'
                name='username'
                type='text'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-zinc-600 placeholder-zinc-400 text-zinc-100 bg-zinc-700 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm'
                placeholder='Username'
              />
            </div>
            <div>
              <Label htmlFor='email-address' className='sr-only'>
                Email address
              </Label>
              <Input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-zinc-600 placeholder-zinc-400 text-zinc-100 bg-zinc-700 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
              />
            </div>
            <div>
              <Label htmlFor='password' className='sr-only'>
                Password
              </Label>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-zinc-600 placeholder-zinc-400 text-zinc-100 bg-zinc-700 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm'
                placeholder='Password'
              />
            </div>
          </div>

          <div>
            {isSubmitting ? (
              <Button
                type='submit'
                disabled
                className='group opacity-90 relative w-full flex justify-center font-semibold py-2 px-4 border border-transparent text-sm  rounded-md text-zinc-700 bg-zinc-300 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500'
              >
                <span className='mr-2 animate-spin'>
                  <LoaderCircle size={18} />{" "}
                </span>
                please wait
              </Button>
            ) : (
              <Button
                type='submit'
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-zinc-900 bg-zinc-300 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500'
              >
                Sign up
              </Button>
            )}
          </div>
        </form>
        <div className='text-sm text-center'>
          <Link
            href='/signin'
            className='font-medium text-zinc-300 hover:text-zinc-100'
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
