import {
  deleteAnnouncement,
  updateAnnouncement,
} from "../../../services/school-admin/announcement-data.service.js";

import { AuthContext } from "../../../context/AuthContext.jsx";
import Button from "../../../components/Elements/Button/index.jsx";
import ConfirmModal from "../../../components/Elements/ConfirmModal/index.jsx";
import Logout from "../../../components/Elements/Logout/index.js";
import NotFound from "../../../components/Elements/EmptyState/NotFound.jsx";
import PropTypes from "prop-types";
import { refreshToken } from "../../../services/auth/auth.service.js";
import { toast } from "react-toastify";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function AnnouncementDataTableView(props) {
  const { handleDataPengumuman, data, selected, setSelected } = props;
  const { setProgress } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStatusPengumuman = () => {
    setProgress(30);
    const data = {
      id: selected.id,
      status: !selected?.status,
    };
    refreshToken((status, token) => {
      if (status) {
        setProgress(60);
        updateAnnouncement(data, token, (status) => {
          if (status) {
            toast.success(
              `Sukses! Pengumuman Sudah  ${
                selected?.status ? "non-akitf" : "aktif"
              }`,
              {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
            handleDataPengumuman();
          } else {
            toast.error(
              `Gagal ${
                selected?.status ? "menon-aktifkan" : "mengaktifkan"
              } pengumuman!`,
              {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          }
        });
      } else {
        Logout((status) => {
          if (status) {
            navigate("/login");
          }
        });
      }
      setProgress(100);
    });
  };

  const handleDeletePengumuman = () => {
    setProgress(30);
    const data = {
      id: selected.id,
    };
    refreshToken((status, token) => {
      if (status) {
        setProgress(60);
        deleteAnnouncement(data, token, (status, message) => {
          if (status) {
            toast.success(message, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            handleDataPengumuman();
          } else {
            toast.error(message, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } else {
        Logout((status) => {
          if (status) {
            navigate("/login");
          }
        });
      }
      setProgress(100);
    });
  };

  const initModal = (item) => {
    setSelected(item);
    document.getElementById("init-modal").click();
  };

  const initModal1 = (item) => {
    setSelected(item);
    document.getElementById("init-modal1").click();
  };

  const updateDrawer = (item) => {
    setSelected(item);
    document.getElementById("update-drawer1").click();
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-16 px-3">
                No.
              </th>
              <th scope="col" className="px-6 py-3">
                Pengumuman
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="w-16 px-3">
                Aktif/ Non-aktifkan
              </th>
              <th scope="col" className="w-16 px-3">
                Edit
              </th>
              <th scope="col" className="w-16 px-3">
                Hapus
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length != 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="w-16 px-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item.pengumuman}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {item.status ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2 animate-pulse"></div>{" "}
                          Aktif
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
                          Nonaktif
                        </>
                      )}
                    </div>
                  </td>
                  <td className="w-16 px-3">
                    <div className="flex items-center justify-center">
                      <Button variant="default" onClick={() => initModal(item)}>
                        <i className="fa-solid fa-power-off"></i>
                      </Button>
                    </div>
                  </td>
                  <td className="w-16 px-3">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="yellow"
                        onClick={() => updateDrawer(item)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Button>
                    </div>
                  </td>
                  <td className="w-16 px-3">
                    <div className="flex items-center justify-center">
                      <Button variant="red" onClick={() => initModal1(item)}>
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>
                  <NotFound />
                  <h3 className="text-xl text-black font-bold mb-5 dark:text-white">
                    Opps! Belum ada data apapun!
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        desc={`Apakah anda yakin ingin ${
          selected?.status ? "menon-aktifkan" : "mengaktifkan"
        } pengumuman ini?`}
        labelOk="Ya"
        labelCancel="Tidak"
        onClick={() => handleStatusPengumuman()}
      />
      <ConfirmModal
        desc={`Apakah anda yakin ingin mengapus pengumuman ini?`}
        labelOk="Ya"
        labelCancel="Tidak"
        onClick={() => handleDeletePengumuman()}
        id="1"
      />
    </>
  );
}

AnnouncementDataTableView.propTypes = {
  data: PropTypes.any,
  handleDataPengumuman: PropTypes.func,
  selected: PropTypes.any,
  setSelected: PropTypes.any,
  id: PropTypes.string,
};
