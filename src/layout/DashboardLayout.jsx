import Sidebar from "@shared/components/Sidebar/Sidebar";
import Header from "@shared/components/Header/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function DashboardLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <>
      <div className="d-flex">
        <Sidebar isVisible={isSidebarVisible} setVisible={setSidebarVisible} />
        <main className="w-100 flex-grow-1">
          <Header toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} />
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
