import AddDataFirst from "../../../components/Elements/EmptyState/AddDataFirst.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import Button from "../../../components/Elements/Button/index.jsx";
import ConfirmModal from "../../../components/Elements/ConfirmModal/index.jsx";
import Input from "../../../components/Elements/Input/index.jsx";
import Logout from "../../../components/Elements/Logout/index.js";
import NotFound from "../../../components/Elements/EmptyState/NotFound.jsx";
import PropTypes from "prop-types";
import StudentDailyJournalAddDrawerView from "./AddDrawerView.jsx";
import { deleteJurnalHarian } from "../../../services/student/daily-journal.service.js";
import { refreshToken } from "../../../services/auth/auth.service.js";
import { toast } from "react-toastify";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDailyJournalTableView(props) {
  const {
    handleDataHarian,
    selected,
    data,
    setData,
    setSelected,
    tanggal,
    setTanggal,
    today,
    setConfetti,
  } = props;
  const { setProgress } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteJurnalHarian = () => {
    setProgress(30);
    const data = {
      id: selected.id,
    };
    refreshToken((status, token) => {
      if (status) {
        setProgress(60);
        deleteJurnalHarian(data, token, (status) => {
          if (status) {
            toast.success(`Sukses! Jurnah harian berhasil dihapus.`, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setData([]);
            handleDataHarian();
          } else {
            toast.error("Gagal menghapus jurnal harian!", {
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

  const initStaticModal = (item) => {
    setSelected(item);
    document.getElementById("init-static-modal").click();
  };

  const updateDrawer = (item) => {
    setSelected(item);
    document.getElementById("update-drawer1").click();
  };

  const initModal1 = (data) => {
    setSelected(data);

    document.getElementById("init-modal1").click();
  };

  return (
    <>
      {Object.keys(data).length == 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <AddDataFirst />
            <h3 className="text-xl text-black font-bold mb-5 dark:text-white">
              Opps! Kamu belum submit jurnal hari ini!
            </h3>
            <StudentDailyJournalAddDrawerView
              handleDataHarian={handleDataHarian}
              setConfetti={setConfetti}
              id="0"
            />
            <p className="mt-5">Ganti Tanggal:</p>
          </div>
          <div className="text-center">
            <NotFound />
            <h3 className="text-xl text-black font-bold mb-5 dark:text-white">
              Opps! Tidak ada jurnal yang kamu submit di tanggal ini.
            </h3>
            <p>Ganti Tanggal:</p>
          </div>
          )}
        </div>
      )}
      <div
        className={`md:flex ${
          Object.keys(data).length != 0 ? "justify-between" : "justify-center"
        }`}
      >
        <div className="space-x-2 flex items-center justify-center mb-5">
          {Object.keys(data).length != 0 && (
            <label className="text-black font-bold dark:text-white">
              Pilih Tanggal:
            </label>
          )}

          <Input
            type="date"
            name="tanggal"
            id="tanggal"
            placeholder="Masukan tanggal jurnal"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required={true}
          />
        </div>
        {Object.keys(data).length != 0 && tanggal == today && (
          <div className="space-x-2 mb-5">
            <StudentDailyJournalAddDrawerView
              handleDataHarian={handleDataHarian}
              setConfetti={setConfetti}
              id="0"
            />
          </div>
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {Object.keys(data).length != 0 && (
          <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-16 px-3">
                  No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Jenis Pekerjaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Deskripsi Pekerjaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="w-32 px-3">
                  Catatan Pembimbing
                </th>
                <th scope="col" className="w-32 px-3">
                  Lihat Jurnal
                </th>
                <th scope="col" className="w-32 px-3">
                  Aksi
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
                    <td className="w-100 px-6 py-4 text-center">
                      {item.jenis_pekerjaan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.deskripsi_pekerjaan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded border ${
                          item.status.toUpperCase() === "MENUNGGU"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-400"
                            : item.status === "DITOLAK"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-400"
                            : item.status === "DITERIMA"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400"
                            : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="w-100 px-3">
                      <div className="flex items-center justify-center">
                        {item.catatan_pembimbing
                          ? item.catatan_pembimbing
                          : "Tidak ada catatan"}
                      </div>
                    </td>
                    <td className="px-3">
                      <div className="flex items-center justify-center">
                        <Button
                          outline={true}
                          onClick={() => initStaticModal(item)}
                        >
                          <i className="fa-solid fa-eye mr-1"></i>Lihat
                        </Button>
                      </div>
                    </td>
                    <td className="px-3">
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          variant="yellow"
                          onClick={() => updateDrawer(item)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Button>

                        <Button variant="red" onClick={() => initModal1(item)}>
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <NotFound />
                    <h3 className="text-xl text-black font-bold mb-5 dark:text-white">
                      Opps! Tidak ada jurnal yang kamu submit di tanggal ini.
                    </h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmModal
        desc={`Apakah anda yakin ingin mengapus jurnal hari ini?`}
        labelOk="Ya"
        labelCancel="Tidak"
        onClick={() => handleDeleteJurnalHarian()}
        id="1"
      />
    </>
  );
}

StudentDailyJournalTableView.propTypes = {
  handleDataHarian: PropTypes.any,
  data: PropTypes.any,
  setSelected: PropTypes.any,
  setData: PropTypes.any,
  setTanggal: PropTypes.any,
  tanggal: PropTypes.any,
  today: PropTypes.any,
  selected: PropTypes.any,
  setConfetti: PropTypes.any,
};
