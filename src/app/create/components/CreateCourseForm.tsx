"use client"

import React from 'react'
import { createChaptersSchema } from '@/validators/course'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast  } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"
import { Plus , Trash } from "lucide-react"

type Props = {}
type Input = z.infer<typeof createChaptersSchema>

// title, units input form || units dynamically add/minus
const CreateCourseForm = (props: Props) => {
    const router = useRouter();
    const { toast } = useToast();
    const { mutate: createChapters, isLoading } = useMutation({
        mutationFn: async ({ title, units }: Input) => {
        const response = await axios.post("/api/course/createChapters", {
            title,
            units,
        });
        return response.data;
        },
    });
    const form = useForm<Input>({
        resolver: zodResolver(createChaptersSchema),
        defaultValues: {
        title: "",
        units: ["", "", ""],
        },
    });
      
    function onSubmit(data: Input) {
        if (data.units.some((unit) => unit === "")) {
        toast({
            title: "Error",
            description: "Please fill all the units",
            variant: "destructive",
        });
        return;
        }
        createChapters(data, {
        onSuccess: ({ course_id }) => {
            toast(
            {
                title: "Success",
                description: "Course created successfully",
            });
            router.push(`/create/${course_id}`);
        },
        onError: (error) => {
            console.error(error);
            toast(
            {
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        },
        });
    }
      
    
      
    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter the main topic of the course" {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                {form.watch("units").map((_, index) => {
                    return (
                        <FormField
                        key={index}
                        control={form.control}
                        name="Unit" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unit  {index + 1} </FormLabel>
                                <FormControl>
                                <Input placeholder="Enter subtopic of the course" {...field} />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    )
                })}
                <div className = "flex items-center justify-center mt-4">
                    <Separator className="flex-[1]" />
                    <div className='mx-4'>
                        <Button
                            type="button"
                            variant="secondary"
                            className="font-semibold"
                            onClick={() => {
                            form.setValue("units", [...form.watch("units"), ""]);
                            }}
                        >
                            <Plus className="w-4 h-4 ml-2 text-green-500" />
                            Add Unit
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="font-semibold ml-2"
                            onClick={() => {
                            form.setValue("units", form.watch("units").slice(0, -1));
                            }}
                        >
                            <Trash className="w-4 h-4 ml-2 text-red-500" />
                            Remove Unit
                        </Button>
                    </div>
                    <Separator className="flex-[1]" />
                </div>
                <Button 
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}
                    size="lg">
                        Submit
                </Button>
                </form>
            </Form>
        </div>
    )
}


export default CreateCourseForm