import { UserContext } from "@/app/context/user-context";
import { useContext, useEffect, useState } from "react";
import { Chat } from "./Chat";
import { PFP } from "./PFP";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Inbox } from "lucide-react";
import { User } from "@prisma/client";
import axios from "axios";
import { Button } from "@/components/ui/button";

type Props_ChatMain = {
  channel?: string;
};

export const ChatMain = (props: Props_ChatMain) => {
  const { user, accessToken } = useContext(UserContext);
  const [recievedRequests, setRecievedRequests] = useState<User[]>([]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("/api/friend/request", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => setRecievedRequests(res.data))
        .catch((err) => {
          console.error(err);
        });
    }
  }, [accessToken]);

  if (!user) return <></>;
  return (
    <main className="flex-1 flex flex-col h-screen bg-neutral-900">
      {/* Header */}
      <header className="bg-neutral-900 text-white p-3 flex items-center justify-between border-b border-neutral-700 h-[5%]">
        <Popover>
          <PopoverTrigger className="w-8 h-8 flex items-center justify-center">
            <Inbox size={24} />
          </PopoverTrigger>
          <PopoverContent className="bg-neutral-700 border border-neutral-600">
            <ul className="flex flex-col gap-2">
              {recievedRequests.map((e) => (
                <li
                  key={e.id}
                  className="bg-neutral-600 px-2 py-2 rounded-sm flex justify-between items-center text-white"
                >
                  <div className="flex gap-2 items-center">
                    <PFP size={16} displayName={e.displayName}></PFP>
                    <span className="text-white">{e.displayName}</span>
                    <div className="h-full flex items-center">
                      <span className="text-white opacity-75 text-sm">
                        {e.username}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-neutral-500"
                    onClick={() => {
                      axios
                        .post(
                          `/api/friend/${e.username}/accept`,
                          {},
                          {
                            headers: { Authorization: `Bearer ${accessToken}` },
                          }
                        )
                        .then(() => {
                          setRecievedRequests(
                            recievedRequests.filter(
                              (ele) => ele.username !== e.username
                            )
                          );
                          window.location.reload();
                        });
                    }}
                  >
                    Accept
                  </Button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center text-center text-sm">
            <span className="opacity-75 text-xs">{user.username}</span>
            <span>{user.displayName}</span>
          </div>
          <button className="flex items-center space-x-2">
            <PFP displayName={user.displayName} size={32} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {props.channel ? (
          <Chat channel={props.channel}></Chat>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </main>
  );
};