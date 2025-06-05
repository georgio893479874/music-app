'use client'

import AvatarMenu from "@/components/ProfileAvatar";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";

export default function DashboardPage() {
  return (
    <>
       <Head>
        <title>Notent - Web Player</title>
      </Head>
      <Sidebar/>
      <AvatarMenu/>
    </>
  );
}
