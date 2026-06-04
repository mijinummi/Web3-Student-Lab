
import dynamic from 'next/dynamic';
const AdminContentClient = dynamic(() => import('./AdminContentClient'), { ssr: false });
export default function Page() { return <AdminContentClient />; }
