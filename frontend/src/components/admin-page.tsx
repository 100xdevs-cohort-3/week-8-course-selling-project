"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export function AdminPageComponent() {
  return (
    <div className='min-h-screen bg-zinc-900 text-zinc-100'>
      <div className='max-w-4xl mx-auto flex flex-col space-y-16 px-4 py-16 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight mb-2'>
            Course Admin Dashboard
          </h1>
          <p className='text-xl text-zinc-400 mb-8'>
            Empower your online education business
          </p>
        </div>

        <div className='mt-12 text-center'>
          <p className='text-2xl font-semibold mb-4'>
            Welcome to your all-in-one course management solution
          </p>
          <p className='text-zinc-300 mb-8'>
            Streamline your online course business with our powerful admin
            tools. Whether you&apos;re a seasoned educator or just starting out,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className='mt-12'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Key Features</h2>
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              "Course creation and management",
              "Student enrollment tracking",
              "Revenue analytics",
              "Automated certificates",
              "Integrated payment processing",
              "Customizable learning paths",
            ].map((feature, index) => (
              <li
                key={index}
                className='flex items-center space-x-3 text-zinc-300'
              >
                <CheckCircle className='h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-16 text-center'>
          <h2 className='text-2xl font-bold mb-4'>Ready to take control?</h2>
          <p className='text-zinc-300 mb-8'>
            Join thousands of successful course creators. Start managing your
            online education empire today.
          </p>
          <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'>
            <Link href='/admin/signin'>
              <Button
                variant='default'
                className='bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
              >
                Sign In
              </Button>
            </Link>
            <Link href='/admin/signup'>
              <Button
                variant='outline'
                className='bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
