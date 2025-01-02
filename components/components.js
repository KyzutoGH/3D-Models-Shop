import Link from "next/link";
import Image from "next/image";

const Content = () => {
  return (
    <div className="py-20 bg-slate-800">
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
    <nav className="bg-slate-900 text-yellow-700 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center pb-3">
          <div className="flex items-center mx-2">
            <Image
              src="/IconShopBlk.png"
              width={50}
              height={43}
              alt="Picture of the author"/>
              <h5 className="ml-2">Punya Bapak</h5>
          </div>
        </Link>
        <div className="flex items-center text-lg">
          <button 
          className="p-1 box-content h-auto w-auto mx-2 border-1 rounded-lg bg-orange-300 text-black hover:bg-orange-400 active:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300">
            <Link href="login">Login</Link>
          </button>
        </div>
      </div>
      <div>{children}</div> {/* Render children here */}
    </nav>
  );
};

// Define the Layout component
const Layout = ({children}) => {
    return (
  <div>
    <Navbar>
      <Content />
    </Navbar>
    <main>{children}</main>
  </div>
  );
};

export default Layout;