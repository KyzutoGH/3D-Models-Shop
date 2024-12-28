import React from "react";
const Footer = ({children}) =>{
    return(
        <footer className="bg-slate-900 text-yellow-700 w-full h-96 py-5 px-3">
            <div className="flex justify-between h-full max-h-80  bg-slate-800">
                <div className="flex flex-col justify-around">
                <h3 className="text-2xl w-96">
                    Ikuti Update Terbaru Kami dengan Berlangganan Newsletter
                </h3>
                <div className="flex gap-3">
                    <input type="mail" className="p-1 box-content h-9 w-56 outline-0 rounded-lg">
                    </input>
                    <button className="p-1 box-content h-9 w-18 border-1 rounded-lg bg-orange-300 text-black hover:bg-orange-400 active:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300">
                        Subscribe
                    </button>
                </div>
                </div>
                <div className="flex flex-row w-96">
                    <div className="flex flex-col justify-around w-36 border-2 border-slate-800 border-l-orange-300 pl-2">
                        <h5>Contents</h5>
                        <ul>
                            <li>Character</li>
                            <li>Vehicle</li>
                            <li>Environment</li>
                            <li>Particle</li>
                        </ul>
                    </div>
                    <div className="flex flex-col justify-around w-36 border-2 border-slate-800 border-l-orange-300 pl-2">
                        <h5>Media</h5>
                        <ul>
                            <li>Newsletter</li>
                            <li>Videos</li>
                            <li>Newsletter</li>
                            <li>Videos</li>
                        </ul>
                    </div>
                    <div className="flex flex-col justify-around w-36 border-2 border-slate-800 border-l-orange-300 pl-2">
                        <h5>Follow</h5>
                        <ul>
                            <li>X</li>
                            <li>Facebook</li>
                            <li>Linkedin</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <h5>
                    &copy; 2024 PunyaBapak
                </h5>
                <ul className="flex gap-4">
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Term</a></li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </footer>
    );
};
export default Footer;