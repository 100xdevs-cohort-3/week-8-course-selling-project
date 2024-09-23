"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Carousal from "./Carousal";
import CourseCard from "./courseCard";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  creator: string;
  price: number;
  imageUrl: string;
}

export function HomePageComponent() {
  const [userDetails, setUserDetails] = useState<User>();
  const [courses, setCourses] = useState<[Course]>();
  const [token, setToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const apiUrl = process.env.URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token");
      const adminTokenFromStorage = localStorage.getItem("AdminToken");

      setToken(tokenFromStorage);
      setAdminToken(adminTokenFromStorage);
    }
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      const res = await axios.get(
        `${apiUrl}/details/getAllCourses` ||
          "http://localhost:8000/details/getAllCourses"
      );
      setCourses(res.data.courses);
    };

    getCourses();
  }, [apiUrl]);

  useEffect(() => {
    const getUserDetails = async () => {
      await axios
        .get(
          `${apiUrl}/user/getUserDetails` ||
            "http://localhost:8000/user/getUserDetails",
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setUserDetails(res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
        });
    };
    if (token) {
      getUserDetails();
    }
  }, [token, adminToken, apiUrl]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };
  const handleAdminSignout = () => {
    localStorage.removeItem("AdminToken");
    window.location.href = "/admin/signin";
  };

  return (
    <div className='min-h-screen bg-gradient-to-t from-zinc-700 via-zinc-900 to-black text-zinc-100'>
      <header className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-white'>LearnHub</h1>

        {adminToken ? (
          <div className='space-x-4'>
            <Link href='/admin/dashboard'>
              <Button className='bg-white text-zinc-900 font-semibold hover:bg-zinc-100'>
                Admin
              </Button>
            </Link>
            <Button
              onClick={handleAdminSignout}
              className='bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700'
            >
              Sign Out
            </Button>
          </div>
        ) : userDetails ? (
          <div className='space-x-4 flex items-center'>
            <Link href={`/profile`}>
              <Button className='bg-white text-zinc-900 font-semibold hover:bg-zinc-100'>
                <User /> {userDetails?.username}
              </Button>
            </Link>
            <Button
              onClick={handleSignout}
              className='bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700'
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className='space-x-4'>
            <Link href='/signin'>
              <Button
                variant='outline'
                className='text-zinc-200 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900'
              >
                Sign In
              </Button>
            </Link>
            <Link href='/signup'>
              {" "}
              <Button className='bg-white text-zinc-900 hover:bg-zinc-100'>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main>
        <section className='container mx-auto px-4 py-20 text-center'>
          <motion.h2
            className='text-4xl md:text-6xl font-bold mb-6 text-white'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Unlock Your Potential
          </motion.h2>
          <motion.p
            className='text-xl md:text-2xl text-zinc-300 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover courses that will take your skills to the next level
          </motion.p>
          <Link href='/allCourses'>
            <Button
              size='lg'
              className='bg-white font-semibold h-12 shadow-white shadow-lg text-zinc-900 hover:bg-zinc-400 duration-500'
            >
              Explore Courses
            </Button>
          </Link>
          {adminToken ? (
            <Link href='/admin/dashboard'>
              <Button
                size='lg'
                className='bg-white mx-4 font-semibold h-12 shadow-white shadow-lg text-zinc-900 hover:bg-zinc-400 duration-500'
              >
                Admin Dashboard
              </Button>
            </Link>
          ) : (
            <Link href='/admin'>
              <Button
                size='lg'
                className='bg-white mx-4 h-12 shadow-white shadow-lg font-semibold text-zinc-900 hover:bg-zinc-400 duration-500'
              >
                Become a Course Creator
              </Button>
            </Link>
          )}
        </section>

        <section className='container mx-auto px-4 py-16'>
          <h3 className='text-3xl font-bold mb-8 text-white'>
            Featured Courses
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {courses &&
              courses.length > 0 &&
              courses
                .slice(0, 6)
                .map((course) => (
                  <CourseCard
                    key={course._id}
                    id={course._id}
                    title={course.title}
                    description={course.description}
                    creator={course.creator}
                    price={course.price}
                    image={course.imageUrl}
                  />
                ))}
          </div>
        </section>
      </main>

      <div className=' flex flex-col  space-y-12 py-16 '>
        <h2 className='text-4xl text-center font-bold text-white'>
          Companies that use LearnHub
        </h2>
        <Carousal />
      </div>

      <footer className='container mx-auto px-4 py-8 text-center text-zinc-400'>
        <p className='mb-4'>&copy; 2024 LearnHub. All rights reserved.</p>

        <a
          href='mailTo:anujchhikara07@gmail.com'
          className=' p-2 rounded-lg shadow-inner hover:opacity-80  duration-500 shadow-white font-semibold bg-gradient-to-r from-stone-500 via-stone-600 to-stone-900 '
        >
          Contact Me
        </a>
        <div className='mt-4 w-auto flex flex-row justify-center'>
          <div>
            <hr className='my-3' />
            <div className='flex h-5 items-center md:space-x-4   text-sm'>
              <a
                className='flex items-center space-x-1 hover:text-gray-300 duration-500 hover:underline-offset-2 hover:underline'
                href='https://twitter.com/AnujChhikara07'
              >
                <Twitter />
                <p>Twitter</p>
              </a>
              <hr className='rotate-90 w-5 bg-white' />
              <a
                className='flex items-center space-x-1 hover:text-gray-300 duration-500 hover:underline-offset-2 hover:underline'
                href='https://github.com/AnujChhikara'
              >
                {" "}
                <Github />
                <p>Github</p>{" "}
              </a>
              <hr className='rotate-90 w-5 bg-white' />
              <a
                className='flex items-end space-x-1 hover:text-gray-300 duration-500 hover:underline-offset-2 hover:underline'
                href='https://in.linkedin.com/in/anuj-chhikara-webdeveloper'
              >
                <Linkedin />
                <p>LinkedIn</p>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
