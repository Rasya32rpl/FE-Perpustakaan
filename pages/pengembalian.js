import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../components/layout";

const Pengembalian = ({ peminjaman, pengembalian }) => {
  const router = useRouter();
  const [selectedPeminjaman, setSelectedPeminjaman] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePengembalian = async (e) => {
    e.preventDefault();

    if (!selectedPeminjaman) {
      alert("Harap pilih peminjaman yang akan dikembalikan!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/kembalipeminjaman/${selectedPeminjaman}`
      );

      alert(response.data.message || "Pengembalian berhasil!");
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error saat mengembalikan buku:", error.response?.data || error);
      alert(error.response?.data?.message || "Gagal melakukan pengembalian");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Pengembalian Buku</h2>
        <form onSubmit={handlePengembalian} className="card p-4 shadow mb-4">
          <div className="mb-3">
            <label className="form-label">Pilih Peminjaman:</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedPeminjaman(e.target.value)}
            >
              <option value="">Pilih Peminjaman</option>
              {peminjaman
                .filter((p) => !p.sudah_dikembalikan) // Hanya yang belum dikembalikan
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_siswa} - {p.tanggal_pinjam}
                  </option>
                ))}
            </select>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Kembalikan Buku"}
          </button>
        </form>

        <h2 className="mt-5">Daftar Pengembalian</h2>
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Siswa</th>
              <th>Tanggal Pinjam</th>
              <th>Tanggal Kembali</th>
              <th>Buku yang Dikembalikan</th>
              <th>Denda</th>
            </tr>
          </thead>
          <tbody>
            {pengembalian.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nama_siswa}</td>
                <td>{p.tanggal_pinjam}</td>
                <td>{p.tanggal_pengembalian}</td>
                <td>
                  {p.buku_dikembalikan && p.buku_dikembalikan.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {p.buku_dikembalikan.map((b) => (
                        <li key={b.id_buku}>
                          {b.judul_buku} (Qty: {b.qty})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">Tidak ada data</span>
                  )}
                </td>
                <td>Rp {p.denda || 0}</td>
              </tr>
            ))} 
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const peminjamanRes = await axios.get("http://127.0.0.1:8000/api/getpeminjaman");
    const pengembalianRes = await axios.get("http://127.0.0.1:8000/api/getpengembalian");

    return {
      props: {
        peminjaman: peminjamanRes.data.data || [],
        pengembalian: pengembalianRes.data.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { peminjaman: [], pengembalian: [] } };
  }
}

export default Pengembalian;
