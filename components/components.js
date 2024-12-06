import Link from "next/link";
import Image from "next/image";

const Content = () => {
  return (
    <div className="py-20 bg-emerald-500">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center justify-center">Discover Our Creations</h1>
        <p className="text-lg mb-12 flex items-center justify-center">Exploring a World of 3D Models and Designs</p>
        <div className="grid grid-cols-3 gap-8">
          {/* Add product cards here */}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ children }) => {
  return (
    <nav className="bg-emerald-700 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <div className="flex items-center">
            <Image
              src="/Logo3DShop.png"
              width={50}
              height={43}
              alt="Picture of the author"/>
            Punya Bapak
          </div>
        </Link>
        <div className="flex">
          <Link href="/home" className="mx-2 hover:text-gray-300">
            Home
          </Link>
          <Link href="/book-online" className="mx-2 hover:text-gray-300">
            Book Online
          </Link>
          <Link href="/shop" className="mx-2 hover:text-gray-300">
            Shop
          </Link>
          <Link href="/cart" className="mx-2 hover:text-gray-300">
            Cart (0)
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
