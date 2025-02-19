import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../components/layout";

const Peminjaman = ({ siswa, buku, peminjaman }) => {
  const router = useRouter();
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [selectedBuku, setSelectedBuku] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePeminjaman = async (e) => {
    e.preventDefault();

    if (!selectedSiswa) {
      alert("Harap pilih siswa!");
      return;
    }
    if (selectedBuku.length === 0) {
      alert("Harap pilih setidaknya satu buku!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/createpeminjaman", {
        id_siswa: selectedSiswa,
        buku: selectedBuku.map((b) => ({ id_buku: b.id_buku, qty: b.qty })),
      });

      alert("Peminjaman berhasil dibuat!");
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error creating peminjaman:", error.response?.data || error);
      alert("Gagal membuat peminjaman");
    }
    setLoading(false);
  };

  const handleBukuSelection = (id_buku, checked) => {
    if (checked) {
      setSelectedBuku([...selectedBuku, { id_buku, qty: 1 }]);
    } else {
      setSelectedBuku(selectedBuku.filter((b) => b.id_buku !== id_buku));
    }
  };

  const updateQty = (id_buku, qty) => {
    setSelectedBuku(
      selectedBuku.map((b) => (b.id_buku === id_buku ? { ...b, qty } : b))
    );
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Peminjaman Buku</h2>
        <form onSubmit={handlePeminjaman} className="card p-4 shadow mb-4">
          <div className="mb-3">
            <label className="form-label">Pilih Siswa:</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedSiswa(e.target.value)}
            >
              <option value="">Pilih Siswa</option>
              {siswa.map((s) => (
                <option key={s.id_siswa} value={s.id_siswa}>
                  {s.nama_siswa}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Pilih Buku:</label>
            {buku.map((b) => (
              <div className="form-check mb-2" key={b.id_buku}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={b.id_buku}
                  onChange={(e) =>
                    handleBukuSelection(b.id_buku, e.target.checked)
                  }
                />
                <label className="form-check-label ms-2 d-flex align-items-center">
                  <img
                    src={b.gambar_buku || "/default-book.png"}
                    alt={b.judul_buku}
                    width="50"
                    height="50"
                    className="me-2"
                  />
                  {b.judul_buku}
                </label>
                {selectedBuku.find((sb) => sb.id_buku === b.id_buku) && (
                  <input
                    type="number"
                    min="1"
                    className="form-control w-25 mt-2"
                    value={
                      selectedBuku.find((sb) => sb.id_buku === b.id_buku).qty
                    }
                    onChange={(e) =>
                      updateQty(b.id_buku, parseInt(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Pinjam Buku"}
          </button>
        </form>

        <h2 className="mt-5">Daftar Peminjaman</h2>
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Siswa</th>
              <th>Tanggal Pinjam</th>
              <th>Tanggal Kembali</th>
              <th>Buku yang Dipinjam</th>
            </tr>
          </thead>
          <tbody>
            {peminjaman.map((p) => {
              // Cari siswa berdasarkan id_siswa
              const siswaData = siswa.find((s) => s.id_siswa === p.id_siswa);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{siswaData ? siswaData.nama_siswa : "Tidak ditemukan"}</td>
                  <td>{p.tanggal_pinjam}</td>
                  <td>{p.tanggal_kembali}</td>
                  <td>
                    {p.detail_peminjaman && p.detail_peminjaman.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {p.detail_peminjaman.map((d) => {
                          const bukuData = buku.find(
                            (b) => b.id_buku === d.id_buku
                          );
                          return (
                            <li key={d.id}>
                              {bukuData
                                ? bukuData.judul_buku
                                : "Tidak ditemukan"}{" "}
                              (Qty: {d.qty})
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className="text-muted">Tidak ada buku</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const siswaRes = await axios.get("http://127.0.0.1:8000/api/getsiswa");
    const bukuRes = await axios.get("http://127.0.0.1:8000/api/getbuku");
    const peminjamanRes = await axios.get("http://127.0.0.1:8000/api/getpeminjaman");

    console.log("Data Siswa:", siswaRes.data);
    console.log("Data Buku:", bukuRes.data);
    console.log("Data Peminjaman:", peminjamanRes.data);

    return {
      props: {
        siswa: siswaRes.data || [],
        buku: bukuRes.data || [],
        peminjaman: peminjamanRes.data.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { siswa: [], buku: [], peminjaman: [] } };
  }
}

export default Peminjaman;
