
import dynamic from 'next/dynamic';
const AirdropClient = dynamic(() => import('./AirdropClient'), { ssr: false });
export default function Page() { return <AirdropClient />; }
