'use client'

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";

export default function DashboardPage() {
  return (
    <>
       <Head>
        <title>Notent - Web Player</title>
      </Head>
      <Sidebar/>
      <Header/>
    </>
  );
}
