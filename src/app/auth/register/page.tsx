"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const FormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Not a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be shorter than 100 characters")
    .regex(/\d/, "Password must contain at least 1 number"),
  agree: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to the terms and privacy policy" 
    }),
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { username: "", email: "", password: "", agree: false },
  });

  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (creating) return;
    setCreating(true);

    try {
      const res = await axios.post("/api/auth/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      toast({
        title: "Account created",
        description: res.data.message || "You have registered successfully.",
        variant: "default",
      });

      form.reset();
    } catch (error: unknown) {
      let error_message = "An unexpected error occurred";

      if (axios.isAxiosError(error)) {
        error_message = error.response?.data?.message || error.message || error_message;
      } else if (error instanceof Error) {
        error_message = error.message;
      } else if (typeof error === "string") {
        error_message = error;
      }

      toast({
        title: "Registration failed",
        description: error_message,
        variant: "destructive",
      });
    }

    setCreating(false);
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-cover bg-center p-4 sm:p-8 md:p-16 lg:p-32 text-black bg-[url('/background.login.jpg')]">
      <div className="w-full max-w-md h-auto bg-black bg-opacity-50 text-white border border-neutral-800 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="w-full p-6 sm:p-8 flex flex-col items-center justify-center">
          <p className="text-4xl mb-2">Create an Account</p>
          <div className="w-full flex items-center justify-center mb-2">
            <p className="text-sm text-neutral-500 mr-1">Already have an account?</p>
            <Link href="/auth/login" className="text-neutral-300 text-sm">
              Login
            </Link>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="text-neutral-400 rounded-xl"
                        placeholder="Enter Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="text-neutral-400 rounded-xl"
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="text-neutral-400 rounded-xl"
                        placeholder="Enter Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              {/* Agree Checkbox */}
              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 mt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="agree" />
                    </FormControl>
                    <FormLabel htmlFor="agree" className="text-sm font-normal text-neutral-500 cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-white underline" rel="noopener noreferrer">Terms</Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="text-white underline" rel="noopener noreferrer">Privacy Policy</Link>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="cursor-pointer bg-blue-600 text-white w-full mt-4 rounded-xl flex items-center justify-center h-9 hover:bg-neutral-700 transition-colors"
                disabled={creating}
              >
                {creating ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
