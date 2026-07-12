"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { API_URL } from "@/constants";
import {
  User,
  Lock,
  Bell,
  Music,
  Eye,
  Save,
  LogOut,
  Loader,
} from "lucide-react";

type UserData = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string | null;
};

type Settings = {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  audioQuality: "low" | "medium" | "high" | "lossless";
  profilePublic: boolean;
  showEmail: boolean;
  theme: "dark" | "light";
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: true,
    emailNotifications: true,
    audioQuality: "high",
    profilePublic: true,
    showEmail: false,
    theme: "dark",
  });
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState<
    "account" | 
    "privacy" | 
    "notifications" | 
    "audio" | 
    "appearance"
  >("account");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<
  {
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/user/${userId}`)
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        setFormData({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch(() => {
        setMessage({ type: "error", text: "Failed to load user data" });
        router.push("/login");
      })
      .finally(() => setLoading(false));

    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (key: keyof Settings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("userSettings", JSON.stringify(newSettings));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setSaving(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const uploadRes = await axios.post(`${API_URL}/upload`, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userId = localStorage.getItem("userId");
      if (userId) {
        await axios.patch(`${API_URL}/user/${userId}`, {
          avatar: uploadRes.data.secure_url,
        });

        setUser((prev) =>
          prev ? { ...prev, avatar: uploadRes.data.secure_url } : null
        );
        setMessage({ type: "success", text: "Avatar updated successfully" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSaving(true);
    try {
      await axios.patch(`${API_URL}/user/${userId}`, {
        firstname: formData.firstname,
        lastname: formData.lastname,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              firstname: formData.firstname,
              lastname: formData.lastname,
            }
          : null
      );
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSaving(true);
    try {
      await axios.post(`${API_URL}/auth/change-password`, {
        userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setMessage({
        type: "success",
        text: "Password changed successfully",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to change password. Check your current password.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    document.cookie = "authToken=; Max-Age=0; path=/";
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const tabClass =
    "px-4 py-2 rounded-lg font-medium transition-all cursor-pointer";
  const activeTabClass =
    "bg-blue-600 text-white shadow-lg shadow-blue-600/50";
  const inactiveTabClass = "text-gray-400 hover:text-white bg-gray-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500 text-green-300"
                : "bg-red-900/30 border border-red-500 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 space-y-2 sticky top-6">
              {[
                {
                  id: "account" as const,
                  label: "Account",
                  icon: <User size={18} />,
                },
                {
                  id: "privacy" as const,
                  label: "Privacy",
                  icon: <Eye size={18} />,
                },
                {
                  id: "notifications" as const,
                  label: "Notifications",
                  icon: <Bell size={18} />,
                },
                {
                  id: "audio" as const,
                  label: "Audio Quality",
                  icon: <Music size={18} />,
                },
                {
                  id: "appearance" as const,
                  label: "Appearance",
                  icon: "🎨",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${tabClass} ${
                    activeTab === tab.id ? activeTabClass : inactiveTabClass
                  } w-full flex items-center gap-3`}
                >
                  {typeof tab.icon === "string" ? tab.icon : tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-8 border border-gray-700/50">
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Account Settings
                  </h2>
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-700">
                    <div className="relative">
                      <Image
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${user?.firstname}+${user?.lastname}&background=random`
                        }
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full border-2 border-blue-500"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={saving}
                        className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                      >
                        📷
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Profile Picture
                      </h3>
                      <p className="text-gray-400 text-sm">
                        JPG, PNG or GIF (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed opacity-50"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <div className="pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Lock size={18} />
                        {saving ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Privacy Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div>
                        <h3 className="text-white font-semibold">
                          Public Profile
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Allow others to view your profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.profilePublic}
                        onChange={(e) =>
                          handleSettingChange("profilePublic", e.target.checked)
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div>
                        <h3 className="text-white font-semibold">
                          Show Email
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Display your email on your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showEmail}
                        onChange={(e) =>
                          handleSettingChange("showEmail", e.target.checked)
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div>
                        <h3 className="text-white font-semibold">
                          Push Notifications
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Get notified about new music and updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) =>
                          handleSettingChange(
                            "notificationsEnabled",
                            e.target.checked
                          )
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div>
                        <h3 className="text-white font-semibold">
                          Email Notifications
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Receive email updates about your account
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "audio" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Audio Quality
                  </h2>
                  <div>
                    <label className="block text-gray-300 font-medium mb-4">
                      Streaming Quality
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          value: "low",
                          label: "Low",
                          desc: "Saves data (64 kbps)",
                        },
                        {
                          value: "medium",
                          label: "Medium",
                          desc: "Balanced (128 kbps)",
                        },
                        {
                          value: "high",
                          label: "High",
                          desc: "Best quality (320 kbps)",
                        },
                        {
                          value: "lossless",
                          label: "Lossless",
                          desc: "Uncompressed audio (FLAC)",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 cursor-pointer hover:bg-gray-700/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name="audioQuality"
                            value={option.value}
                            checked={
                              settings.audioQuality ===
                              (option.value as Settings["audioQuality"])
                            }
                            onChange={(e) =>
                              handleSettingChange(
                                "audioQuality",
                                e.target.value as Settings["audioQuality"]
                              )
                            }
                            className="w-4 h-4 cursor-pointer"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="text-white font-semibold">
                              {option.label}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Appearance
                  </h2>
                  <div>
                    <label className="block text-gray-300 font-medium mb-4">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          value: "dark",
                          label: "Dark",
                          icon: "🌙",
                          desc: "Dark mode for comfortable viewing",
                        },
                        {
                          value: "light",
                          label: "Light",
                          icon: "☀️",
                          desc: "Light mode for bright environments",
                        },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() =>
                            handleSettingChange(
                              "theme",
                              theme.value as Settings["theme"]
                            )
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === theme.value
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50"
                          }`}
                        >
                          <div className="text-3xl mb-2">{theme.icon}</div>
                          <h4 className="text-white font-semibold">
                            {theme.label}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {theme.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}