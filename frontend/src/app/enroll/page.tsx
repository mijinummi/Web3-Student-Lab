
import dynamic from 'next/dynamic';
const EnrollClient = dynamic(() => import('./EnrollClient'), { ssr: false });
export default function Page() { return <EnrollClient />; }
