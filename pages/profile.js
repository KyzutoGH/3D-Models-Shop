import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in. Please log in.</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      {/* Render other user info */}
    </div>
  );
};

export default Profile;
