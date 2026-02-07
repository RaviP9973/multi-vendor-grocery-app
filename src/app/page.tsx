import { auth } from "@/auth";
import sql from "./lib/db";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";
import Navbar from "@/components/Navbar";
import { IUser } from "@/script/migrate";

export default async function Home() {

  const session = await auth();
  const res = await sql`
    SELECT id, name, email, role, phone, image FROM users WHERE id = ${session?.user?.id} LIMIT 1
  `
  const user = res[0] as IUser;
  if(!user || res.length === 0) {
    redirect('/login');
  }

  const incomplete = !user.role || !user.phone || (!user.phone && user.role === 'user');

  if(incomplete){
    return <EditRoleAndPhone />
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col ">
      <Navbar user={user}/>
    </div>
  );
}
