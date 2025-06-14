"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "@/constants";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
  bannerUrl?: string;
  role?: string;
  isOnline?: boolean;
};

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<"profile" | "settings" | "activity">(
    "profile"
  );
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API_URL}/user/${userId}`)
      .then((res) => {
        const data = res.data;
        setUser(data);
        setForm({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
        });
        setLoading(false);
      })
  }, [userId]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  };

  const handleEdit = () => setEditMode(true);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await fetch(`${API_URL}/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setUser({ ...user!, ...form });
    setEditMode(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 bg-[#181A20] text-white">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="text-center text-red-500 bg-[#181A20]">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#181A20] text-white flex flex-col rounded-3xl lg:mt-16">
      <div className="relative h-56 w-full bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-3xl">
        {user.bannerUrl || bannerPreview ? (
          <Image
            src={bannerPreview || user.bannerUrl || ""}
            alt="Banner"
            width={1920}
            height={224}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" />
        )}
        <button
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
          onClick={() => bannerInputRef.current?.click()}
          title="Change banner"
        >
          <PhotoCamera />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={bannerInputRef}
          onChange={handleBannerChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-8 px-8 -mt-20">
        <div className="relative group">
          <Avatar
            sx={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              border: "6px solid #60a5fa",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              backgroundColor: "#23272F",
              objectFit: "cover",
              fontSize: 50,
            }}
            src={avatarPreview || user?.avatarUrl}
          >
            {user.firstname?.charAt(0)}
          </Avatar>
          <button
            className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            onClick={() => fileInputRef.current?.click()}
            title="Change avatar"
          >
            <PhotoCamera/>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
        <div className="flex-1 flex flex-col items-center sm:items-start z-50">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            {user.firstname} {user.lastname}
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition z-50"
        >
          Logout
        </button>
      </div>
      <div className="mt-8 border-b border-[#23272F] flex gap-8 px-8">
        <button
          className={`pb-2 font-semibold transition-colors duration-200 ${
            tab === "profile"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
        <button
          className={`pb-2 font-semibold transition-colors duration-200 ${
            tab === "settings"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setTab("settings")}
        >
          Settings
        </button>
        <button
          className={`pb-2 font-semibold transition-colors duration-200 ${
            tab === "activity"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setTab("activity")}
        >
          Activity
        </button>
      </div>
      <div className="mt-6 px-8 pb-8 flex-1">
        {tab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">First Name:</span>{" "}
                {user.firstname}
              </li>
              <li>
                <span className="font-medium">Last Name:</span> {user.lastname}
              </li>
              <li>
                <span className="font-medium">Email:</span> {user.email}
              </li>
              <li>
                <span className="font-medium">Role:</span> {user.role || "User"}
              </li>
              <li>
                <span className="font-medium">ID:</span> {user.id}
              </li>
            </ul>
          </div>
        )}
        {tab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {!editMode ? (
              <div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
                  onClick={handleEdit}
                >
                  Edit profile
                </button>
                <div className="text-gray-400">
                  You can change your data, avatar or banner here.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleFormChange}
                    className="w-full border border-[#23272F] bg-[#23272F] text-white rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleFormChange}
                    className="w-full border border-[#23272F] bg-[#23272F] text-white rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="w-full border border-[#23272F] bg-[#23272F] text-white rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}