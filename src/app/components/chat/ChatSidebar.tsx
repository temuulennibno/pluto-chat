"use client";

import { UserContext } from "@/app/context/user-context";
import { DialogHeader } from "@/components/ui/dialog";
import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PFP } from "./PFP";
import { useRouter } from "next/navigation";

export const ChatSideBar = () => {
  const { user, accessToken, setAccessToken } = useContext(UserContext);

  const [friends, setFriends] = useState<User[] | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      axios
        .get("/api/friend", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(response => {
          setFriends(response.data.friends);
        });
    }
  }, [accessToken, user]);
  if (!user) {
    return <></>;
  }

  return (
    <aside className="w-64 bg-neutral-800 p-4 flex flex-col border-r border-neutral-700">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Chat</span>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
              +
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-neutral-700/100 text-white border-neutral-600 rounded-xl">
            <DialogHeader>
              <DialogTitle>Add friend</DialogTitle>
              <DialogDescription>
                Find new friends so we could actually have users and not go
                bankrupt(talking like this goin do stuff).
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const friend = (e.target as HTMLFormElement).friend.value;
                axios
                  .post(
                    `/api/friend/${friend}/request`,
                    {},
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                  )
                  .then((res) => {
                    toast({ title: res.data.message });
                  })
                  .catch((err) => {
                    toast({ title: err.response.data.message });
                  });
              }}
            >
              <Label>Your new future &apos;friend&apos;s username</Label>
              <div className="flex gap-2">
                <Input
                  name="friend"
                  id="friend"
                  placeholder="gauss, user12322346906 etc."
                  className="text-neutral-300 border-[1.5px]"
                />
                <Button type="submit" variant="outline">
                  Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Contact List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <ul className="flex flex-col gap-3">
          <li key={"oh hey its you"}>
            <Link
              href={`/chat`}
              className="flex items-center space-x-2 p-2 bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600"
            >
              <PFP size={40} displayName={user.displayName} />
            </Link>
          </li>
          {Array.isArray(friends) && friends.length > 0 &&
            friends.map((friend) => (
              <li key={friend.id}>
                <Link
                  href={`/chat/${friend.id}~${user.id}`}
                  className="flex items-center space-x-2 p-2 bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600"
                >
                  <PFP displayName={friend.displayName} size={40} />
                  <span>{friend.displayName}</span>
                </Link>
              </li>
            ))}
          {friends == null && <p>Loading...</p>}
          {Array.isArray(friends) && friends.length === 0 && (
            <p></p>
          )}
        </ul>
      </div>
      {/* Settings Button */}
<Dialog>
  <DialogTrigger asChild>
    <Button className="mt-4 p-2 bg-neutral-700 rounded hover:bg-neutral-600 w-full">
      Settings
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[400px] bg-neutral-800 text-white border-neutral-700 rounded-xl">
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>
        Account actions and preferences.
      </DialogDescription>
    </DialogHeader>
    <Button
      variant="destructive"
      className="w-full mt-4"
      onClick={() => {
        setAccessToken(""); // Clear token, triggers context redirect
        toast({
          title: "Logged out",
          description: "You have been logged out.",
        });
        // Optionally, force redirect (context should handle this)
        router.push("/auth/login");
      }}
    >
      Log out
    </Button>
  </DialogContent>
</Dialog>
    </aside>
  );
};