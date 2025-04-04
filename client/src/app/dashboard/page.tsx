import Sidebar from "@/components/Sidebar/page";
import { Helmet } from "react-helmet";

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Notent - Web Player</title>
      </Helmet>
      <Sidebar />
    </>
  );
}
