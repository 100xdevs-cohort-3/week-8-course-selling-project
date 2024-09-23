"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const apiUrl = process.env.URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    const email = document.getElementById("email-address") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    try {
      const response = await axios.post(
        `${apiUrl}/admin/signin` || "http://localhost:8000/admin/signin",

        {
          email: email.value,
          password: password.value,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        if (typeof window !== "undefined") {
          localStorage.setItem("AdminToken", response.data.token);
        }
        toast({
          title: "Admin Sign in successful",
          description: "You have successfully signed in as admin",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      const errorMessage = "An unexpected error occurred";

      // Type assertion
      const responseError = err as { response?: { data?: string } };

      setError(responseError.response?.data || errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-zinc-900'>
      <p className='text-red-500 pb-3'>{error}</p>
      <div className='w-full max-w-md space-y-8 p-8 bg-zinc-800 rounded-xl shadow-lg'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-zinc-100'>
            Admin Sign in
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4 rounded-md shadow-sm'>
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
                autoComplete='current-password'
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
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-zinc-900 bg-zinc-300 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500'
              >
                Sign in
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
