/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CourseCard from "@/components/courseCard";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function Page() {
  const [userDetails, setUserDetails] = useState<User>();
  const [purchasedCourses, setPurchasedCourses] = useState<any>([]);
  const token = localStorage.getItem("token");
  const apiUrl = process.env.URL;

  useEffect(() => {
    if (token) {
      axios
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
    }
  }, [token, apiUrl]);

  useEffect(() => {
    if (userDetails?.username) {
      axios
        .get(
          `${apiUrl}/user/getAllPurchasedCourses` ||
            "http://localhost:8000/user/getAllPurchasedCourses",
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setPurchasedCourses(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
        });
    }
  }, [token, userDetails?.username, apiUrl]);

  return (
    <div className='min-h-screen bg-gradient-to-t from-zinc-700 via-zinc-900 to-black px-12 pt-4'>
      {userDetails ? (
        <div>
          <h2 className='text-4xl font-bold mb-8 text-white'>
            Hello {userDetails.username}
          </h2>
          {purchasedCourses?.length >= 1 ? (
            <div>
              <h2 className='text-4xl font-bold mb-8 text-white'>
                Purchased Courses
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {purchasedCourses.map((course: any) => (
                  <CourseCard
                    key={course._id}
                    id={course._id}
                    title={course.courseName}
                    description={course.description}
                    creator={course.creator}
                    price={course.price}
                    image={course.imageUrl}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>No purchased courses</div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
