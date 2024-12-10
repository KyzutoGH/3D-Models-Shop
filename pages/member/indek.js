import React from 'react';
import Head from 'next/head';
import Image from "next/image";

const HomePageMember = () => {
  return (
    <>
      <Head>
        <title>Home | PunyaBapak</title>
        <meta name="description" content="Welcome to PunyaBapak Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={styles.container}>
        {/* Header / Navigation */}
        <header style={styles.header}>
          <nav style={styles.nav}>
            {/* Logo */}
            <div style={styles.logo}>
              <div style={styles.logoBox}><Image
              src="/Logo3DShopBL.png"
              width={580}
              height={430}
              alt="Picture of the author"
            /></div>
              <span style={styles.logoText}>PunyaBapak</span>
            </div>

            {/* Pencarian */}
            <input type="text" placeholder="Pencarian" style={styles.searchInput} />

            {/* Masuk Button */}
            <button style={styles.loginButton}>Masuk</button>
          </nav>
        </header>

        {/* Main Content - Grid Produk */}
        <main style={styles.main}>
          <h1 style={styles.title}>Welcome to PunyaBapak Store</h1>
          <p style={styles.description}>Explore our amazing products!</p>

          {/* Grid Produk */}
          <div style={styles.productGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} style={styles.product}>
                Barang {index + 1}
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2024 PunyaBapak. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

// CSS-in-JS Styling
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    color: '#333',
    margin: 0,
    padding: 0,
  },
  header: {
    background: '#0070f3',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoBox: {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    color: '#0070f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  logoText: {
    marginLeft: '10px',
    fontSize: '20px',
    color: 'white',
  },
  searchInput: {
    width: '60%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    margin: '0 20px',
  },
  loginButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#0070f3',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  main: {
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    margin: '20px 0',
  },
  description: {
    fontSize: '1.2rem',
    color: '#555',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  product: {
    backgroundColor: '#0070f3',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
    fontWeight: 'bold',
    borderRadius: '5px',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    padding: '10px 0',
    backgroundColor: '#f1f1f1',
    marginTop: '20px',
  },
};

export default HomePageMember;
