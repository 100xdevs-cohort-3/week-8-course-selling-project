/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";

interface CourseCardProps {
  title: string;
  description: string;
  creator: string;
  price: number;
  image: string;
  id: string;
}

export default function CourseCard({
  title,
  description,
  creator,
  price,
  image,
  id,
}: CourseCardProps) {
  const [isPurchased, setIsPurchased] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const data = useMemo(() => {
    return {
      courseId: id,
    };
  }, [id]);
  const adminToken = localStorage.getItem("AdminToken");

  useEffect(() => {
    const checkIfAlreadyPurchased = async () =>
      await axios
        .post(`http://localhost:8000/user/checkIfAlreadyPurchased`, data, {
          withCredentials: true,
        })
        .then((res) => {
          setIsPurchased(res.data.status);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
        });
    if (token) {
      checkIfAlreadyPurchased();
    }
  }, [token, data]);

  const handlePurchase = () => {
    axios
      .post("http://localhost:8000/user/purchaseCourse", data, {
        withCredentials: true,
      })
      .then((res) => {
        setIsPurchased(true);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  };

  const deleteCourse = async (courseId: string) => {
    axios
      .get(`http://localhost:8000/details/deleteCourse/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsPurchased(false);
        toast({
          title: "Course deleted successfully",
          description: "You have successfully deleted the course",
        });
      })
      .catch((err) => {
        setIsPurchased(true);
        toast({
          title: "Error deleting course",
          description: "An unexpected error occurred",
        });
        console.error("Error fetching user details:", err);
      });
  };

  return (
    <Card className='overflow-hidden hover:scale-105 duration-500 flex flex-col bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-100 shadow-lg hover:shadow-xl'>
      <Image
        width={300}
        height={300}
        src={image}
        alt={title || "Course Image"}
        className='w-full h-48 object-cover'
      />
      <CardHeader className='bg-gradient-to-r from-zinc-800 to-zinc-700'>
        <CardTitle className='text-xl font-semibold text-zinc-100'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow bg-gradient-to-br from-zinc-800 to-zinc-900'>
        <p className='text-zinc-300 mb-4'>{description}</p>
        <p className='text-zinc-400'>Created by: {creator}</p>
      </CardContent>
      <CardFooter className='flex justify-between items-center border-t border-zinc-700 pt-4 bg-gradient-to-r from-zinc-900 to-zinc-800'>
        <span className='text-2xl font-bold text-zinc-200'>
          ${price.toFixed(2)}
        </span>

        {adminToken ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-black'>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your course
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className='bg-red-500 hover:bg-red-400 duration-300'
                  onClick={() => deleteCourse(id)}
                >
                  Deleted
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : !token ? (
          <Link href='/signin'>
            <Button
              variant='secondary'
              className='bg-zinc-600 hover:bg-zinc-500 text-white'
            >
              {" "}
              Sign In
            </Button>
          </Link>
        ) : isPurchased ? (
          <Button
            variant='secondary'
            disabled
            className='bg-green-400 hover:bg-green-500 duration-300 text-white'
          >
            Enrolled
          </Button>
        ) : (
          <Button
            variant='secondary'
            className='bg-zinc-600 hover:bg-zinc-500 text-white'
            onClick={handlePurchase}
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
