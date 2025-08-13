"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
// This is how our user context looks
interface UserContextType {
  user: User | null;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

// Default context
export const UserContext = createContext<UserContextType>({
  user: null,
  accessToken: "",
  setAccessToken: () => {},
});

// Routes where context should not redirect
const FORBIDDENPATHS = ["/auth/login", "/auth/register"];

/**
 * UserContextProvider
 * - Provides user, accessToken, and setAccessToken
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const router = useRouter();
  const path = usePathname();
  const { toast } = useToast();

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");
  }, []);

  // Validate token and set user on token or path change
  useEffect(() => {
    if (accessToken === "") {
      if (
        !localStorage.getItem("accessToken") &&
        !FORBIDDENPATHS.includes(path)
      ) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        router.push("/auth/login");
      }
      return;
    }
    localStorage.setItem("accessToken", accessToken);

    axios
      .get("/api/auth/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((res) => {
        setUser(JSON.parse(res.data));
        if (FORBIDDENPATHS.includes(path)) {
          router.push("/chat");
        }
      })
      .catch((err) => {
        setAccessToken("");
        setUser(null);
        toast({
          title: "Session Error",
          description:
            err?.response?.data?.message ||
            err.message ||
            "Your session has expired or is invalid.",
            variant: "destructive",
        });
        if (!FORBIDDENPATHS.includes(path)) {
          router.push("/auth/login");
        }
      });
  }, [accessToken, path, router, toast]);

  return (
    <UserContext.Provider
      value={{ user, accessToken, setAccessToken }}
    >
      {children}
    </UserContext.Provider>
  );
};