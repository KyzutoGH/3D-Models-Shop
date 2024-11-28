import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div>
      <h1>Welcome to Our Application</h1>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <a href="/api/auth">Login with Google</a>
      )}
    </div>
  );
};

export default Home;
