import { useState, useEffect } from "react";
import Layout from "../components/layout";

export default function DataSiswa() {
  const [siswa, setSiswa] = useState([]);

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

  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">Data Siswa</h1>
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
            </tr>
          </thead>
          <tbody>
            {siswa.length > 0 ? (
              siswa.map((item) => (
                <tr key={item.id_siswa}>
                  <td>{item.id_siswa}</td>
                  <td>{item.nama_siswa}</td>
                  <td>{item.tanggal_lahir}</td>
                  <td>{item.gender}</td>
                  <td>{item.alamat}</td>
                  <td>{item.no_tlp}</td>
                  <td>{item.id_kelas}</td>
                  <td>{item.nama_kelas}</td>
                  <td>{item.kelompok}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">Tidak ada data siswa</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
