/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import CourseCard from "@/components/courseCard"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  creator: string;
  price: number;
  imageUrl: string;
}


export default function AdminDashboard() {
    const [allCourses, setAllCourses] = useState<[Course]>();  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const {toast }= useToast() 

    const adminToken = localStorage.getItem("AdminToken");
    useEffect(() => { 
        if(!adminToken){
            window.location.href = '/admin/signin'
        }
    }
    ,[adminToken]);

    
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

  const submitForm = () => {
    setIsSubmitting(true);

    const title = document.querySelector('#title') as HTMLInputElement;
    const description = document.querySelector('#description') as HTMLInputElement;
    const price = document.querySelector('#price') as HTMLInputElement;
    const image = document.querySelector('#image') as HTMLInputElement;
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('price', price.value);
    if (image.files && image.files.length > 0) { // Check if files is not null
        formData.append('imageUrl', image.files[0]); 
        console.log(image.files[0]);
      }

    axios.post('http://localhost:8000/admin/createCourse',formData,{
        headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        }
        
      })
      .then(res => {
        setIsSubmitting(false);
        toast({
          title: "Course added successfully",
          description: "You have successfully added the course",
         
        })
        window.location.href = '/admin/dashboard'
      })
      .catch(err => {
          setIsSubmitting(false);
          setError(err.response?.data.message|| "An unexpected error occurred")
          toast({
            title: "Error adding course",
            description: "An unexpected error occurred",
           
          })
          console.error("Error adding course:", err);
      });   

  }
  
  return (
    <div className="min-h-screen bg-gradient-to-t from-zinc-700 via-zinc-900 to-black">
     <div className="container mx-auto py-12 px-4 text-center">

     <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Add New Course</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Your Course Details</AlertDialogTitle>
        
          <AlertDialogDescription>
            {error? <span className="text-red-500">{error}</span> : "Please fill in the details of your course"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form >
        <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          required
        />
      </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button  className="bg-zinc-600 hover:bg-zinc-500 text-white" onClick={submitForm}>Add Course</Button>
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
     </div>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Courses</h1>
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