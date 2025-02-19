import { useState, useEffect } from "react";
import Layout from "../components/layout";
import { Pencil, Trash2, Eye } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion"; // import framer-motion for animation

export default function SiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState({
    nama_siswa: "",
    tanggal_lahir: "",
    gender: "",
    alamat: "",
    no_tlp: "",
    id_kelas: "",
  });
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/getsiswa");
      const data = await res.json();
      setSiswa(data);
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      nama_siswa: "",
      tanggal_lahir: "",
      gender: "",
      alamat: "",
      no_tlp: "",
      id_kelas: "",
    });
    setEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://localhost:8000/api/updatesiswa/${editId}`
      : "http://localhost:8000/api/createsiswa";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      setMessage(result.message);
      if (result.status) {
        resetForm();
        fetchSiswa();
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Terjadi error pada server");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/deletesiswa/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setMessage(result.message);
      if (result.status) fetchSiswa();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditId(item.id_siswa);
    setForm(item);
  };

  const handleDetail = async (id_siswa) => {
    try {
      const res = await fetch(`http://localhost:8000/api/getsiswaid/${id_siswa}`);
      const data = await res.json();
      setDetail(data);
      setShowDetail(true);
    } catch (error) {
      console.error("Error fetching detail siswa:", error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <motion.h1
          className="mt-4 text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          CRUD Siswa
        </motion.h1>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit} className="mb-4">
          <motion.input
            type="text"
            name="nama_siswa"
            value={form.nama_siswa}
            onChange={handleInputChange}
            placeholder="Nama Siswa"
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.input
            type="date"
            name="tanggal_lahir"
            value={form.tanggal_lahir}
            onChange={handleInputChange}
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.select
            name="gender"
            value={form.gender}
            onChange={handleInputChange}
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <option value="">Pilih Gender</option>
            <option value="L">Laki-Laki</option>
            <option value="P">Perempuan</option>
          </motion.select>
          <motion.input
            type="text"
            name="alamat"
            value={form.alamat}
            onChange={handleInputChange}
            placeholder="Alamat"
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.input
            type="text"
            name="no_tlp"
            value={form.no_tlp}
            onChange={handleInputChange}
            placeholder="No Telepon"
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.input
            type="number"
            name="id_kelas"
            value={form.id_kelas}
            onChange={handleInputChange}
            placeholder="ID Kelas"
            required
            className="form-control mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.button
            type="submit"
            className="btn btn-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {editing ? "Update" : "Tambah"}
          </motion.button>
        </form>

        <motion.table
          className="table table-bordered"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Gender</th>
              <th>Alamat</th>
              <th>No Telepon</th>
              <th>ID Kelas</th>
              <th>Nama Kelas</th>
              <th>Kelompok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((item) => (
              <motion.tr
                key={item.id_siswa}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <td>{item.id_siswa}</td>
                <td>{item.nama_siswa}</td>
                <td>{item.tanggal_lahir}</td>
                <td>{item.gender}</td>
                <td>{item.alamat}</td>
                <td>{item.no_tlp}</td>
                <td>{item.id_kelas}</td>
                <td>{item.nama_kelas}</td>
                <td>{item.kelompok}</td>
                <td>
                  <button className="btn btn-info btn-sm me-1" onClick={() => handleDetail(item.id_siswa)}>
                    <Eye size={16} />
                  </button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(item)}>
                    <Pencil size={16} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id_siswa)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>

        <Modal show={showDetail} onHide={() => setShowDetail(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detail Siswa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detail && (
              <div>
                <p><strong>Nama:</strong> {detail.nama_siswa}</p>
                <p><strong>Tanggal Lahir:</strong> {detail.tanggal_lahir}</p>
                <p><strong>Gender:</strong> {detail.gender}</p>
                <p><strong>Alamat:</strong> {detail.alamat}</p>
                <p><strong>No Telepon:</strong> {detail.no_tlp}</p>
                <p><strong>ID Kelas:</strong> {detail.id_kelas}</p>
                <p><strong>Nama Kelas:</strong> {detail.nama_kelas}</p>
                <p><strong>Kelompok:</strong> {detail.kelompok}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>Tutup</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}
