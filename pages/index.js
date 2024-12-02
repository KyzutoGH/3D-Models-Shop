// pages/index.js
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <Link href="/login" >Login </Link>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <Image src={session.user.image} alt="User Image" />
      <p>Email: {session.user.email}</p>
    </div>
  );
};

export default HomePage;