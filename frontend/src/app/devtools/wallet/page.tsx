
import dynamic from 'next/dynamic';
const WalletClient = dynamic(() => import('./WalletClient'), { ssr: false });
export default function Page() { return <WalletClient />; }
