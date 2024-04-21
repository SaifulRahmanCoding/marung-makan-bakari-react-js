import Sidebar from "@shared/components/Sidebar/Sidebar";
import Header from "@shared/components/Header/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";

function DashboardLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah yakin ingin logout??",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: 'Tidak',
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

  const showPopup = (text, condition) => {
    let icon = "success";
    let title = `Berhasil ${text} Data`;
    if (condition === 200 || condition === 201) {
      icon = "success";
      title = `Berhasil ${text} Data`;
    } else {
      icon = "error";
      title = `Gagal ${text} Data`;
    }
    Swal.fire({
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar isVisible={isSidebarVisible} setVisible={setSidebarVisible} handleLogout={handleLogout} />
        <main className="w-100 flex-grow-1">
          <Header toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} handleLogout={handleLogout} />
          <MyContext.Provider value={{ showPopup }}>
            <Outlet />
          </MyContext.Provider>
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
