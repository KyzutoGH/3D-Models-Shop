// pages/index.js
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <a href="/login">Login</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <img src={session.user.image} alt="User Image" />
      <p>Email: {session.user.email}</p>
    </div>
  );
};

export default HomePage;
