'use client'

import CourseCard from "@/components/courseCard"
import axios from "axios";
import { useEffect, useState } from "react";

interface Course {
  _id: string;
  title: string;
  description: string;
  creator: string;
  price: number;
  imageUrl: string;
}


export default function CoursesPageComponent() {

  const [allCourses, setAllCourses] = useState<[Course]>();  
  useEffect(() => {
    axios.get('http://localhost:8000/details/getAllCourses', {
    })
    .then(res => {
      setAllCourses(res.data.courses);
    })
    .catch(err => {
      console.error("Error fetching user details:", err);
    });
  },[]);
  return (
    <div className="min-h-screen bg-gradient-to-t from-zinc-700 via-zinc-900 to-black">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Available Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses?.map((course) => (
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
      </div>
    </div>
  )
}