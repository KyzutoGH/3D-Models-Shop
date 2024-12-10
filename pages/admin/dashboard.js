import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeView, setActiveView] = useState('admin');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/error401");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `/api/admin/${activeView}`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setTableData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [activeView]);

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await signOut({
          callbackUrl: '/login',
          redirect: true
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">LOGO</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li 
              className={`p-2 rounded cursor-pointer ${activeView === 'admin' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveView('admin')}
            >
              DATA ADMIN
            </li>
            <li 
              className={`p-2 rounded cursor-pointer ${activeView === 'artist' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveView('artist')}
            >
              DATA ARTIST
            </li>
            <li 
              className={`p-2 rounded cursor-pointer ${activeView === 'member' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveView('member')}
            >
              DATA MEMBER
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            {activeView === 'admin' && 'Admin Dashboard'}
            {activeView === 'artist' && 'Artist Dashboard'}
            {activeView === 'member' && 'Member Dashboard'}
          </h1>
          <button
            onClick={onLogout}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Log out
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {activeView === 'admin' && 'Admin List'}
              {activeView === 'artist' && 'Artist List'}
              {activeView === 'member' && 'Member List'}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">Register Date</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((member) => (
                    <tr key={member.id} className="text-gray-700">
                      <td className="py-2 px-4 border">{member.id}</td>
                      <td className="py-2 px-4 border">{member.email}</td>
                      <td className="py-2 px-4 border">{member.name}</td>
                      <td className="py-2 px-4 border">{member.role}</td>
                      <td className="py-2 px-4 border">{new Date(member.tgl_register).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;