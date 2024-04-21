import Sidebar from "@shared/components/Sidebar/Sidebar";
import Header from "@shared/components/Header/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function DashboardLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah yakin ingin logout??",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Ya",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Logout",
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  }

  return (
    <>
      <div className="d-flex">
        <Sidebar isVisible={isSidebarVisible} setVisible={setSidebarVisible} handleLogout={handleLogout} />
        <main className="w-100 flex-grow-1">
          <Header toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} handleLogout={handleLogout} />
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
