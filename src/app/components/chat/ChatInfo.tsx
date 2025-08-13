"use client";

import { UserContext } from "@/app/context/user-context";
import { User } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";

type Props_ChatInfo = {
  channel?: string;
};

type FriendInfo = {
  displayName: string;
  username: string;
  createdAt: Date;
};

export const ChatInfo = (props: Props_ChatInfo) => {
  const { user, accessToken } = useContext(UserContext);
  const { channel } = props;

  const [friendInfo, setFriendInfo] = useState<FriendInfo | null>(null);

  useEffect(() => {
    if (user && channel) {
      const friendId = channel.split("~").find((e) => e !== user.id);
      if (friendId) {
        axios
          .get("/api/friend", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((res) => {
            const friend: User = res.data.find((e: User) => e.id === friendId);
            setFriendInfo({
              displayName: friend.displayName,
              username: friend.username,
              createdAt: friend.createdAt,
            });
          });
      }
    }
  }, [accessToken, channel, user]);

  if (!user) return <></>;
  return (
    <aside className="w-64 bg-neutral-800 border-l border-neutral-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold">
          {channel
            ? friendInfo?.displayName
            : "What am I supposed to put here too"}
        </h3>
      </div>
      <div className="text-sm text-neutral-400 mb-4">
        <p>
          {channel
            ? friendInfo?.username
            : "We'll just be"}
        </p>
      </div>
      <div className="text-sm text-neutral-400">
        <p>
          {channel ? dayjs(friendInfo?.createdAt).format("YYYY-MM-DD") : "Is this how deadline feel like?"}
        </p>
      </div>
    </aside>
  );
};