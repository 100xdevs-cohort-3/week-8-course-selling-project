'use client'

import {  useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Github, Linkedin, Twitter, User } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
interface User {
  id: string;
  username: string;
  email: string;

}

export function HomePageComponent() {
  const [courses] = useState([
    { id: 1, title: 'Introduction to React', description: 'Learn the basics of React', price: '$49.99' },
    { id: 2, title: 'Advanced JavaScript', description: 'Master JavaScript concepts', price: '$69.99' },
    { id: 3, title: 'UI/UX Design Fundamentals', description: 'Create beautiful user interfaces', price: '$59.99' },
  ])

  const [userDetails, setUserDetails] = useState<User>();

  const token = localStorage.getItem("token") 
  const adminToken = localStorage.getItem("AdminToken")
  useEffect(() => {
    if (token) { 
      axios.get('http://localhost:8000/user/getUserDetails', {
        headers: {
          Authorization: `Bearer ${token || adminToken}`
        }
      })
      .then(res => {
        setUserDetails(res.data.user);
      })
      .catch(err => {
        console.error("Error fetching user details:", err);
      });
    }
  }, [token, adminToken]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    window.location.href = '/signin';
  }


  return (
    <div className="min-h-screen bg-gradient-to-t from-zinc-700 via-zinc-900 to-black text-zinc-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">LearnHub</h1>

      { adminToken? <Link href='/admin/dashboard'><Button className="bg-white text-zinc-900 font-semibold hover:bg-zinc-100">Admin</Button></Link> :
          userDetails ? <div className="space-x-4">
           
           <Link href={`/profile`}><Button className="bg-white text-zinc-900 font-semibold hover:bg-zinc-100">{userDetails?.username}</Button></Link>
           <Button onClick={handleSignout} className="bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700">Sign Out</Button>
          </div> : <div className="space-x-4">
            <Link href='/signin'><Button variant="outline" className="text-zinc-200 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900">Sign In</Button></Link> 
            <Link href='/signup'> <Button className="bg-white text-zinc-900 hover:bg-zinc-100">Sign Up</Button></Link> 
          </div>
        }
       
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Unlock Your Potential
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-zinc-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover courses that will take your skills to the next level
          </motion.p>
          <Link href='/allCourses'><Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">Explore Courses</Button></Link>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold mb-8 text-white">Featured Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-zinc-400">
                    <BookOpen size={16} />
                    <span>12 lessons</span>
                    <User size={16} className="ml-4" />
                    <span>156 students</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">{course.price}</span>
                  
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-zinc-400">
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
  )
}