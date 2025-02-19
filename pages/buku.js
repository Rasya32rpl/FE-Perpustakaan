// pages/buku.js

import { useState, useEffect } from 'react';
import Layout from '../components/layout';

export default function BukuPage() {
  const [buku, setBuku] = useState([]);
  const [form, setForm] = useState({
    judul_buku: '',
    penulis: '',
    penerbit: '',
    kategori: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  // State untuk mode editing
  const [editing, setEditing] = useState(false);
  // Menyimpan id buku yang sedang diedit
  const [editId, setEditId] = useState(null);
  // State untuk menyimpan data detail buku
  const [detail, setDetail] = useState(null);

  // Ambil data buku dari API Laravel
  useEffect(() => {
    fetchBuku();
  }, []);

  const fetchBuku = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/getbuku');
      const data = await res.json();
      setBuku(data);
    } catch (error) {
      console.error('Error fetching buku:', error);
    }
  };

  // Tangani perubahan input teks pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Tangani perubahan input file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Reset form dan mode editing
  const resetForm = () => {
    setForm({
      judul_buku: '',
      penulis: '',
      penerbit: '',
      kategori: '',
    });
    setFile(null);
    setEditing(false);
    setEditId(null);
  };

  // Submit form untuk tambah atau update buku dengan unggahan file
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gunakan FormData untuk mengirim data teks dan file
    const formData = new FormData();
    formData.append('judul_buku', form.judul_buku);
    formData.append('penulis', form.penulis);
    formData.append('penerbit', form.penerbit);
    formData.append('kategori', form.kategori);
    if (file) {
      formData.append('gambar_buku', file);
    }

    if (editing) {
      // Update buku (gunakan method POST atau PUT; pada file upload, seringkali POST lebih mudah di-handle)
      formData.append('_method', 'PUT');
      try {
        const res = await fetch(`http://localhost:8000/api/updatebuku/${editId}`, {
          method: 'POST', // atau 'PUT' jika backend mendukungnya
          body: formData, // jangan set header Content-Type agar browser mengatur multipart/form-data
        });
        const result = await res.json();
        if (result.status) {
          setMessage(result.message);
          resetForm();
          fetchBuku();
        } else {
          setMessage(result.message || 'Gagal update buku');
        }
      } catch (error) {
        console.error('Error saat update buku:', error);
        setMessage('Terjadi error pada server');
      }
    } else {
      // Create buku
      try {
        const res = await fetch('http://localhost:8000/api/createbuku', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.status) {
          setMessage(result.message);
          resetForm();
          fetchBuku();
        } else {
          setMessage(result.message || 'Gagal menambah buku');
        }
      } catch (error) {
        console.error('Error saat menambah buku:', error);
        setMessage('Terjadi error pada server');
      }
    }
  };

  // Hapus buku
  const handleDelete = async (id_buku) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/deletebuku/${id_buku}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.status) {
        setMessage(result.message);
        fetchBuku();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error saat menghapus buku:', error);
      setMessage('Terjadi error pada server');
    }
  };

  // Aktifkan mode edit dan isi form dengan data buku yang dipilih
  const handleEdit = (item) => {
    setEditing(true);
    setEditId(item.id_buku); // Pastikan struktur sesuai, misalnya id_buku
    setForm({
      judul_buku: item.judul_buku,
      penulis: item.penulis,
      penerbit: item.penerbit,
      kategori: item.kategori,
    });
    // Untuk file, karena tidak bisa memuat file dari URL, biarkan file null
    setFile(null);
    setMessage('');
  };

  // Ambil detail buku menggunakan endpoint getbukuid
  const handleDetail = async (id_buku) => {
    try {
      const res = await fetch(`http://localhost:8000/api/getbukuid/${id_buku}`);
      const data = await res.json();
      setDetail(data);
    } catch (error) {
      console.error('Error fetching detail buku:', error);
      setMessage('Terjadi error pada server saat mengambil detail');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">CRUD Buku</h1>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form Tambah / Update Buku */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="judul_buku" className="form-label">Judul Buku</label>
            <input 
              type="text"
              className="form-control"
              id="judul_buku"
              name="judul_buku"
              value={form.judul_buku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="penulis" className="form-label">Penulis</label>
            <input 
              type="text"
              className="form-control"
              id="penulis"
              name="penulis"
              value={form.penulis}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="penerbit" className="form-label">Penerbit</label>
            <input 
              type="text"
              className="form-control"
              id="penerbit"
              name="penerbit"
              value={form.penerbit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="kategori" className="form-label">Kategori</label>
            <select 
                className="form-select"
                id="kategori"
                name="kategori"
                value={form.kategori}
                onChange={handleInputChange}
                required
            >
                <option value="">Pilih Kategori</option>
                <option value="Pemrograman">Pemrograman</option>
                <option value="Sosial">Sosial</option>
                <option value="Politik">Politik</option>
            </select>
            </div>

          <div className="mb-3">
            <label htmlFor="gambar_buku" className="form-label">Gambar Buku</label>
            <input 
              type="file"
              className="form-control"
              id="gambar_buku"
              name="gambar_buku"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Buku' : 'Tambah Buku'}
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

        {/* Tabel Data Buku */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Buku</th>
              <th>Penulis</th>
              <th>Penerbit</th>
              <th>Kategori</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {buku.length > 0 ? (
              buku.map((item) => (
                <tr key={item.id_buku}>
                  <td>{item.id_buku}</td>
                  <td>{item.judul_buku}</td>
                  <td>{item.penulis}</td>
                  <td>{item.penerbit}</td>
                  <td>{item.kategori}</td>
                  <td>
                    {item.gambar_buku ? (
                      <img 
                        src={item.gambar_buku} 
                        alt={item.judul_buku} 
                        style={{ width: '80px', height: 'auto' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm me-1"
                      onClick={() => handleDetail(item.id_buku)}
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
                      onClick={() => handleDelete(item.id_buku)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Tidak ada data buku</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tampilan detail buku jika ada */}
        {detail && (
          <div className="card mt-4">
            <div className="card-header">
              Detail Buku (ID: {detail.id_buku})
            </div>
            <div className="card-body">
              <p><strong>Judul:</strong> {detail.judul_buku}</p>
              <p><strong>Penulis:</strong> {detail.penulis}</p>
              <p><strong>Penerbit:</strong> {detail.penerbit}</p>
              <p><strong>Kategori:</strong> {detail.kategori}</p>
              {detail.gambar_buku && (
                <img 
                  src={detail.gambar_buku} 
                  alt={detail.judul_buku} 
                  style={{ width: '150px', height: 'auto' }}
                />
              )}
              <button 
                className="btn btn-secondary mt-2" 
                onClick={() => setDetail(null)}
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
