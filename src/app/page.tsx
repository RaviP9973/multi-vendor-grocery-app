import { auth } from "@/auth";
import sql from "./lib/db";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";

export default async function Home() {

  const session = await auth();
  const res = await sql`
    SELECT id, name, email, role, phone FROM users WHERE id = ${session?.user?.id} LIMIT 1
  `
  const user = res[0];
  if(!user || user.length === 0) {
    redirect('/login');
  }

  const incomplete = !user.role || !user.phone || (!user.phone && user.role === 'user');

  if(incomplete){
    return <EditRoleAndPhone />
  }
  return (
    <div>
      hlo
    </div>
  );
}
