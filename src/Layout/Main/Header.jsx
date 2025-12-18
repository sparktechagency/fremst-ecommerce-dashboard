import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge } from "antd";
import logo from "../../assets/randomProfile2.jpg";
import { useFetchUserProfileQuery } from "../../redux/apiSlices/authSlice";
import { io } from "socket.io-client";
import { imageUrl } from "../../redux/api/baseApi";

const Header = () => {
  const { data: profileData, isLoading, refetch } = useFetchUserProfileQuery();

  const profile = profileData?.data;

  // console.log(profile);

  useEffect(() => {
    refetch();
  }, []);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = io("http://164.90.205.5:5001", {
      query: {
        token:
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken"),
      },
    });
    socket.on("notification::asd98234!3454@", (notification) => {
      console.log(notification);
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex items-center justify-end gap-7 h-full">
      {profile?.role === "admin" || profile?.role === "super-admin" ? (
        <div>
          <Link to="/notification">
            <Badge count={notificationCount} color="red">
              <FaRegBell size={25} />
            </Badge>
          </Link>
        </div>
      ) : null}

      {/* Profile Section */}
      <div
        style={{
          height: "55px",

          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          margin: "10px",
        }}
      >
        <img
          src={
            profile?.profile
              ? profile?.profile?.startsWith("https")
                ? profile?.profile
                : `${imageUrl}${profile?.profile}`
              : profile?.user?.profile
              ? profile?.user?.profile?.startsWith("https")
                ? profile?.user?.profile
                : `${imageUrl}${profile?.user?.profile}`
              : logo
          }
          alt={name || "User Profile"}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <h2
            style={{
              color: "black",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {profile?.user?.name || profile?.name || "Guest"}
          </h2>
          <p className="text-sm">{profile?.user?.role || profile?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
