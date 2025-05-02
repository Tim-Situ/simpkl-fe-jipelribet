import { useContext, useEffect, useState } from "react";

import Alert from "../../../components/Elements/Alert/index.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import Button from "../../../components/Elements/Button/index.jsx";
import Drawer from "../../../components/Elements/Drawer/index.jsx";
import FileInput from "../../../components/Elements/FileInput/index.jsx";
import Input from "../../../components/Elements/Input/index.jsx";
import Logout from "../../../components/Elements/Logout/index.js";
import PropTypes from "prop-types";
import SelectInput from "../../../components/Elements/SelectInput/index.jsx";
import SuccessBadge from "../../../components/Elements/SuccessBadge/index.jsx";
import TextArea from "../../../components/Elements/TextArea/index.jsx";
import { addJurnalHarian } from "../../../services/student/daily-journal.service.js";
import { refreshToken } from "../../../services/auth/auth.service.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function StudentDailyJournalAddDrawerView(props) {
  const { handleDataHarian, id, setConfetti } = props;
  const { setProgress } = useContext(AuthContext);
  const navigate = useNavigate();

  // handle loading
  const [loading, setLoading] = useState(false);

  // handle input
  const [hari, setHari] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenisPekerjaan, setJenisPekerjaan] = useState("");
  const [deskripsiPekerjaan, setDeskripsiPekerjaan] = useState("");
  const [bentuKegiatan, setBentuKegiatan] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [staff, setStaff] = useState("");
  const [foto, setFoto] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");

  // handle message
  const [message, setMessage] = useState("");

  const opsiHari = [
    { value: "Senin", label: "Senin" },
    { value: "Selasa", label: "Selasa" },
    { value: "Rabu", label: "Rabu" },
    { value: "Kamis", label: "Kamis" },
    { value: "Jumat", label: "Jumat" },
    { value: "Sabtu", label: "Sabtu" },
    { value: "Minggu", label: "Minggu" },
  ];

  const opsiJenisPekerjaan = [
    {
      value: "Pekerjaan Sesuai Kompetensi Keahlian",
      label: "Pekerjaan Sesuai Kompetensi Keahlian",
    },
    { value: "Pekerjaan Lain", label: "Pekerjaan Lain" },
  ];

  const opsiBentukKegiatan = [
    { value: "Mandiri", label: "Mandiri" },
    { value: "Bimbingan", label: "Bimbingan" },
    { value: "Ditugaskan", label: "Ditugaskan" },
    { value: "Inisiatif", label: "Inisiatif" },
  ];

  const handleTambahJurnal = (e) => {
    e.preventDefault();
    setProgress(30);
    setLoading(true);
    setMessage("");
    const data = {
      hari: hari,
      tanggal: tanggal,
      jenis_pekerjaan: jenisPekerjaan,
      deskripsi_pekerjaan: deskripsiPekerjaan,
      bentuk_kegiatan: bentuKegiatan,
      jam_mulai: `${jamMulai}:00`,
      jam_selesai: `${jamSelesai}:00`,
      staf: staff,
      foto: foto,
    };
    refreshToken((status, token) => {
      if (status) {
        setProgress(60);
        addJurnalHarian(data, token, (status, message) => {
          if (status) {
            toast.success(`Sukses! Jurnal harian ditambahakan.`, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            handleDataHarian();
            setMessage("success");
            setHari("");
            setTanggal("");
            setJenisPekerjaan("");
            setDeskripsiPekerjaan("");
            setBentuKegiatan("");
            setJamMulai("");
            setJamSelesai("");
            setStaff("");
            setFoto("");
            setPreviewFoto("");
            setConfetti(true);
          } else {
            setMessage(message);
            toast.error("Gagal menambahkan jurnal harian!", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
        setProgress(100);
        setLoading(false);
      } else {
        Logout((status) => {
          if (status) {
            navigate("/login");
          }
        });
      }
    });
  };

  useEffect(() => {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const dateString = yyyy + "-" + mm + "-" + dd;
    setHari(date.toLocaleDateString("id-ID", { weekday: "long" }));
    setTanggal(dateString);
  }, []);

  const initDrawer = () => {
    setMessage("");
    document.getElementById("init-drawer" + id).click();
  };

  const selectFile = (e) => {
    setFoto(e.target.files[0]);
    setPreviewFoto(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <Button onClick={() => initDrawer()}>
        <i className="fa-solid fa-plus mr-2"></i>Tambah Jurnal
      </Button>
      <div className="text-left">
        <Drawer title="Buat Jurnal Hari Ini" id={id}>
          {message != "success" ? (
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => handleTambahJurnal(e)}
            >
              {hari != "" && (
                <SelectInput
                  options={opsiHari}
                  label="Hari"
                  id="hari"
                  onChange={(e) => setHari(e.value)}
                  defaultValue={opsiHari.find(({ value }) => value === hari)}
                  isDisabled={false}
                />
              )}
              <Input
                type="date"
                label="Tanggal"
                name="tanggal"
                id="tanggal"
                placeholder="Masukan tanggal jurnal"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required={true}
                isDisabled={false}
              />
              <SelectInput
                options={opsiJenisPekerjaan}
                label="Jenis Pekerjaan"
                id="jenis_pekerjaan"
                onChange={(e) => setJenisPekerjaan(e.value)}
              />
              <TextArea
                label="Deskripsi Pekerjaan"
                name="deskripsi_pekerjaan"
                id="deskripsi_pekerjaan"
                placeholder="Masukan dekripsi pekerjaan"
                value={deskripsiPekerjaan}
                onChange={(e) => setDeskripsiPekerjaan(e.target.value)}
                required={true}
              />
              <SelectInput
                options={opsiBentukKegiatan}
                label="Bentuk Kegiatan"
                id="bentuk_kegiatan"
                onChange={(e) => setBentuKegiatan(e.value)}
              />
              <Input
                type="time"
                label="Jam Mulai"
                name="jam_mulai"
                id="jam_mulai"
                placeholder="Masukan jam mulai"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                required={true}
              />
              <Input
                type="time"
                label="Jam Selesai"
                name="jam_selesai"
                id="jam_selesai"
                placeholder="Masukan jam selesai"
                value={jamSelesai}
                onChange={(e) => {
                  setJamSelesai(e.target.value);
                }}
                required={true}
              />
              <Input
                type="text"
                label="Staff yang Menugaskan"
                name="staff"
                id="staff"
                placeholder="Masukan nama staff"
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                required={true}
              />
              {previewFoto == "" ? (
                <FileInput
                  id="foto"
                  name="foto"
                  label="Unggah Foto"
                  onChange={(e) => selectFile(e)}
                  required={true}
                />
              ) : (
                <>
                  <img src={previewFoto} alt="Foto Kegiatan" />
                  <Button
                    variant="red"
                    width="full"
                    outline={true}
                    onClick={() => {
                      setPreviewFoto("");
                      setFoto("");
                    }}
                  >
                    Reset Gambar
                  </Button>
                </>
              )}
              <Alert>{message}</Alert>
              <Button type="submit" width="full" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Tambahkan"
                )}
              </Button>
            </form>
          ) : (
            <SuccessBadge id={id}>Berhasil menambahkan data!</SuccessBadge>
          )}
        </Drawer>
      </div>
    </>
  );
}

StudentDailyJournalAddDrawerView.propTypes = {
  handleDataHarian: PropTypes.func,
  selected: PropTypes.string,
  setSelected: PropTypes.func,
  id: PropTypes.string,
  setConfetti: PropTypes.any,
};
