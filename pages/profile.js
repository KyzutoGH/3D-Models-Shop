import React from 'react';

// Header component
const Header = () => {
  return (
    <header>
      <div className="logo">PunyaBapak</div>
      <h1>Pencarian</h1>
    </header>
  );
};

// Product component
const Product = () => {
  return (
    <div className="product">
      <p>Barang</p>
    </div>
  );
};

// Main component
const Main = () => {
  return (
    <main>
      <div className="products-grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <Product key={index} />
        ))}
      </div>
    </main>
  );
};

// App component
const App = () => {
  return (
    <div className="app">
      <Header />
      <Main />
      <div className="pp">Selamat Pagi, Kaji Betul</div>
    </div>
  );
};

export default App;