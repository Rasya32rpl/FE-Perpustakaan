// pages/siswa.js

import { useState, useEffect } from 'react';
import Layout from '../components/layout';

export default function SiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState({
    nama_siswa: '',
    tanggal_lahir: '',
    gender: '',
    alamat: '',
    no_tlp: '',
    id_kelas: ''
  });
  const [message, setMessage] = useState('');
  // State untuk mode editing
  const [editing, setEditing] = useState(false);
  // Menyimpan id siswa yang sedang diedit
  const [editId, setEditId] = useState(null);
  // State untuk menyimpan data detail siswa (getsiswaid)
  const [detail, setDetail] = useState(null);

  // Ambil data siswa dari API Laravel
  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/getsiswa');
      const data = await res.json();
      setSiswa(data);
    } catch (error) {
      console.error('Error fetching siswa:', error);
    }
  };

  // Tangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form dan mode editing
  const resetForm = () => {
    setForm({
      nama_siswa: '',
      tanggal_lahir: '',
      gender: '',
      alamat: '',
      no_tlp: '',
      id_kelas: ''
    });
    setEditing(false);
    setEditId(null);
  };

  // Submit form untuk tambah atau update siswa
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      // Update siswa (PUT)
      try {
        const res = await fetch(`http://localhost:8000/api/updatesiswa/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const result = await res.json();
        if (result.status) {
          setMessage(result.message);
          resetForm();
          fetchSiswa();
        } else {
          setMessage(result.message || 'Gagal update siswa');
        }
      } catch (error) {
        console.error('Error saat update siswa:', error);
        setMessage('Terjadi error pada server');
      }
    } else {
      // Create siswa (POST)
      try {
        const res = await fetch('http://localhost:8000/api/createsiswa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const result = await res.json();
        if (result.status) {
          setMessage(result.message);
          resetForm();
          fetchSiswa();
        } else {
          setMessage(result.message || 'Gagal menambah siswa');
        }
      } catch (error) {
        console.error('Error saat menambah siswa:', error);
        setMessage('Terjadi error pada server');
      }
    }
  };

  // Hapus siswa
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/deletesiswa/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.status) {
        setMessage(result.message);
        fetchSiswa();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error saat menghapus siswa:', error);
      setMessage('Terjadi error pada server');
    }
  };

  // Aktifkan mode edit dan isi form dengan data siswa yang dipilih
  const handleEdit = (item) => {
    setEditing(true);
    setEditId(item.id_siswa);
    setForm({
      nama_siswa: item.nama_siswa,
      tanggal_lahir: item.tanggal_lahir,
      gender: item.gender,
      alamat: item.alamat,
      no_tlp: item.no_tlp,
      id_kelas: item.id_kelas
    });
    setMessage('');
  };

  // Ambil detail siswa menggunakan endpoint getsiswaid
  const handleDetail = async (id_siswa) => {
    try {
      const res = await fetch(`http://localhost:8000/api/getsiswaid/${id_siswa}`);
      const data = await res.json();
      setDetail(data);
    } catch (error) {
      console.error('Error fetching detail siswa:', error);
      setMessage('Terjadi error pada server saat mengambil detail');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">CRUD Siswa</h1>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form Tambah / Update Siswa */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="nama_siswa" className="form-label">Nama Siswa</label>
            <input 
              type="text" 
              className="form-control" 
              id="nama_siswa" 
              name="nama_siswa" 
              value={form.nama_siswa} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tanggal_lahir" className="form-label">Tanggal Lahir</label>
            <input 
              type="date" 
              className="form-control" 
              id="tanggal_lahir" 
              name="tanggal_lahir" 
              value={form.tanggal_lahir} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select 
              className="form-select" 
              id="gender" 
              name="gender" 
              value={form.gender} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Pilih Gender</option>
              <option value="L">Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="alamat" className="form-label">Alamat</label>
            <input 
              type="text" 
              className="form-control" 
              id="alamat" 
              name="alamat" 
              value={form.alamat} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="no_tlp" className="form-label">No Telepon</label>
            <input 
              type="text" 
              className="form-control" 
              id="no_tlp" 
              name="no_tlp" 
              value={form.no_tlp} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="id_kelas" className="form-label">ID Kelas</label>
            <input 
              type="number" 
              className="form-control" 
              id="id_kelas" 
              name="id_kelas" 
              value={form.id_kelas} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Siswa' : 'Tambah Siswa'}
          </button>
          {editing && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2" 
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Tabel Data Siswa */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Siswa</th>
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
            {siswa.length > 0 ? (
              siswa.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nama_siswa}</td>
                  <td>{item.tanggal_lahir}</td>
                  <td>{item.gender}</td>
                  <td>{item.alamat}</td>
                  <td>{item.no_tlp}</td>
                  <td>{item.id_kelas}</td>
                  <td>{item.nama_kelas}</td>
                  <td>{item.kelompok}</td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm me-1"
                      onClick={() => handleDetail(item.id)}
                    >
                      Detail
                    </button>
                    <button 
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">Tidak ada data siswa</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tampilan detail siswa jika ada */}
        {detail && (
          <div className="card mt-4">
            <div className="card-header">
              Detail Siswa (ID: {detail.id})
            </div>
            <div className="card-body">
              <p><strong>Nama:</strong> {detail.nama_siswa}</p>
              <p><strong>Tanggal Lahir:</strong> {detail.tanggal_lahir}</p>
              <p><strong>Gender:</strong> {detail.gender}</p>
              <p><strong>Alamat:</strong> {detail.alamat}</p>
              <p><strong>No Telepon:</strong> {detail.no_tlp}</p>
              <p><strong>ID Kelas:</strong> {detail.id_kelas}</p>
              <p><strong>Nama Kelas:</strong> {detail.nama_kelas}</p>
              <p><strong>Kelompok:</strong> {detail.kelompok}</p>
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
