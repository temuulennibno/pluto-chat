"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/app/context/user-context";
import Link from "next/link";

const FormSchema = z.object({
  logininfo: z.string(),
  password: z.string(),
  agree: z.boolean().default(false),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logininfo: "",
      password: "",
      agree: false,
    },
  });

  const { setAccessToken } = useContext(UserContext);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Load saved logininfo on mount
  useEffect(() => {
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    const savedLogin = localStorage.getItem("savedLoginInfo") || "";
    if (savedRemember) {
      form.setValue("agree", true);
      form.setValue("logininfo", savedLogin);
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (loading) return;
    setLoading(true);

    // Save or clear localStorage depending on checkbox
    if (values.agree) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("savedLoginInfo", values.logininfo);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedLoginInfo");
    }

    await axios
      .post("/api/auth/login", {
        logininfo: values.logininfo,
        password: values.password,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        toast({
          title: "Login Successful",
          description: res.data.message,
          variant: "default",
        });
      })
      .catch((err) => {
        toast({
          title: "Login failed",
          description:
            err?.response?.data?.message ||
            err.message ||
            "An error occurred",
          variant: "destructive",
        });
      });

    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-cover bg-center p-4 sm:p-8 md:p-16 lg:p-32 text-black bg-[url('/background.login.jpg')]">
      <div className="w-full max-w-md h-auto bg-black bg-opacity-50 text-white border border-neutral-800 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="w-full p-6 sm:p-8 flex flex-col items-center justify-center">
          <p className="text-4xl mb-2">Welcome Back</p>
          <div className="w-full flex items-center justify-center mb-2">
            <p className="text-sm text-neutral-500 mr-1">Doesn&apos;t have an account?</p>
            <Link href="/auth/register" className="text-neutral-300 text-sm">
              Sign up
            </Link>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col"
            >
              <FormField
                control={form.control}
                name="logininfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="text-neutral-400 rounded-xl"
                        placeholder="Enter Email or Username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between mt-2">
                    {/* Left: Checkbox + label */}
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="agree"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="agree"
                        className="text-sm font-normal text-neutral-500 cursor-pointer"
                      >
                        Remember Me
                      </FormLabel>
                    </div>

                    {/* Right: Forgot password */}
                    <a
                      href="#"
                      className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      Forgot password
                    </a>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="cursor-pointer bg-blue-600 text-white w-full mt-4 rounded-xl flex items-center justify-center h-9 hover:bg-neutral-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "Login"
                )}
              </Button>

              {/* OR separator */}
              <div className="flex items-center my-2">
                <div className="flex-grow h-px bg-neutral-700" />
                <span className="mx-3 text-neutral-400 text-sm">or</span>
                <div className="flex-grow h-px bg-neutral-700" />
              </div>

              {/* Social buttons */}
              <div className="flex flex-row gap-2 h-9 md:flex-row">
                <Link
                  href={"#"}
                  type="button"
                  className="flex-1 bg-blue-600 text-white flex items-center justify-center gap-2 rounded-xl border border-neutral-700 hover:bg-neutral-700"
                  onClick={() => {/* handle Google OAuth here */}}
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.4 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.2 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-.7.1-1.3.1-2S44.5 20 44.5 20z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.2 5.1 29.4 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"/><path fill="#FBBC05" d="M24 45c5.4 0 10.2-1.8 14-4.9l-6.5-5.3C29.7 36.1 27 37 24 37c-5.7 0-10.5-3.6-12.3-8.5l-7 5.4C6.2 41.6 14.4 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.5 43.9 19.4 45 24 45c10.5 0 19.5-7.6 21-17.5 0-.7.1-1.3.1-2S44.5 20 44.5 20z"/></g></svg>
                  Google
                </Link>
                <Link
                  href={"#"}
                  type="button"
                  className="flex-1 bg-blue-600 text-white flex items-center justify-center gap-2 rounded-xl border border-neutral-700 hover:bg-neutral-700"
                  onClick={() => {/* handle GitHub OAuth here */}}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 2.7 1.2.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2.9-.2 1.8-.3 2.7-.3.9 0 1.8.1 2.7.3 2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.7.9 1.2 1.9 1.2 3.2 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.3-5.2-11.5-12-11.5z"/></svg>
                  GitHub
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
