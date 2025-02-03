// pages/index.js
import Layout from '../components/layout';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home({ data }) {
  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">Selamat Datang di Aplikasi CRUD Next.js & Laravel</h1>
        <p>Data dari Backend Laravel:</p>
        {data ? (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.nama}</li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada data.</p>
        )}
      </div>
    </Layout>
  );
}

// Misalnya, endpoint Laravel Anda berada di http://localhost:8000/api/items
export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:8000/api/');
    const data = await res.json();
    return {
      props: { data },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { data: [] },
    };
  }
}
