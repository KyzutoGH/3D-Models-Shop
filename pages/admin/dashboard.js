import { useSession, signOut } from 'next-auth/react';
import { useEffect } from "react";
import { useRouter } from "next/router";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Tunggu sampai session selesai dimuat
    if (!session || session.user.role !== "admin") {
      router.push("/error401"); // Arahkan pengguna ke halaman profil jika bukan admin
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
    const onLogout = async (e) => {
        // Prevent default form submission
        e.preventDefault();

        try {
            // First try to call our API endpoint
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // If API call successful, use NextAuth's signOut
                await signOut({
                    callbackUrl: '/login',
                    redirect: true
                });
            } else {
                console.error('Logout failed on server side');
                // Optionally show error message to user
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Optionally show error message to user
        }
    };
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button
                onClick={onLogout}
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
            >
                Log out
            </button>
        </div>
    );
};

export default AdminPage; // Pastikan ada default export