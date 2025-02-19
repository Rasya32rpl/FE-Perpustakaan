// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronDown, Search, Users, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [siswaDropdownOpen, setSiswaDropdownOpen] = useState(false);
  const [bukuDropdownOpen, setBukuDropdownOpen] = useState(false);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" href="/">
            📚 Perpustakaan
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" href="/">
                  HOME
                </Link>
              </li>

              {/* Dropdown SISWA */}
              <li className="nav-item dropdown position-relative">
                <button
                  type="button"
                  onClick={() => {
                    setSiswaDropdownOpen(!siswaDropdownOpen);
                    setBukuDropdownOpen(false); // Tutup dropdown lain
                  }}
                  className="nav-link btn btn-primary border-0 d-flex align-items-center"
                >
                  <Users size={18} className="me-1" />
                  SISWA
                  <ChevronDown size={16} className={`ms-1 ${siswaDropdownOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence>
                  {siswaDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="dropdown-menu show position-absolute start-0 mt-2 bg-white shadow rounded"
                    >
                      <Link href="/siswa" legacyBehavior>
                        <a className="dropdown-item px-3 py-2">CRUD Siswa</a>
                      </Link>
                      <Link href="/datasiswa" legacyBehavior>
                        <a className="dropdown-item px-3 py-2">Data Siswa</a>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Dropdown BUKU */}
              <li className="nav-item dropdown position-relative">
                <button
                  type="button"
                  onClick={() => {
                    setBukuDropdownOpen(!bukuDropdownOpen);
                    setSiswaDropdownOpen(false); // Tutup dropdown lain
                  }}
                  className="nav-link btn btn-primary border-0 d-flex align-items-center"
                >
                  <Book size={18} className="me-1" />
                  BUKU
                  <ChevronDown size={16} className={`ms-1 ${bukuDropdownOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence>
                  {bukuDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="dropdown-menu show position-absolute start-0 mt-2 bg-white shadow rounded"
                    >
                      <Link href="/buku" legacyBehavior>
                        <a className="dropdown-item px-3 py-2">CRUD Buku</a>
                      </Link>
                      <Link href="/peminjaman" legacyBehavior>
                        <a className="dropdown-item px-3 py-2">Peminjaman Buku</a>
                      </Link>
                      <Link href="/pengembalian" legacyBehavior>
                        <a className="dropdown-item px-3 py-2">Pengembalian Buku</a>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>

            {/* Search Bar */}
            <form className="d-flex">
              <div className="input-group">
                <input
                  className="form-control border-0 shadow-sm"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-light" type="submit">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>
      <div style={{ marginTop: "70px" }}></div>
    </header>
  );
}
