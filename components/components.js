import Link from "next/link";

const Content = () => {
  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Discover Our Creations</h1>
        <p className="text-lg mb-12">Exploring a World of 3D Models and Designs</p>
        <div className="grid grid-cols-3 gap-8">
          {/* Add product cards here */}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ children }) => {
  return (
    <nav className="bg-purple-700 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold">Punya Bapak</a>
        </Link>
        <div>
          <Link href="/home">
             <a className="mx-4 hover:text-gray-300">Home</a>
          </Link>
          <Link href="/book-online">
            <a className="mx-4 hover:text-gray-300">Book Online</a>
          </Link>
          <Link href="/shop">
            <a className="mx-4 hover:text-gray-300">Shop</a>
          </Link>
          <Link href="/cart">
            <a className="mx-4 hover:text-gray-300">Cart (0)</a>
          </Link>
        </div>
      </div>
      <div>{children}</div> {/* Render children here */}
    </nav>
  );
};

// Define the Layout component
const Layout = () => {
  return (
    <Navbar>
      <Content />
    </Navbar>
  );
};

export default Layout;
