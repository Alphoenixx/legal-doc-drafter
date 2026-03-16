import { Suspense, lazy } from 'react';
const LegalNetworkScene = lazy(() => import('./LegalNetworkScene'));

export default function HeroCanvas({ style, className }) {
  return (
    <Suspense fallback={null}>
      <LegalNetworkScene style={style} className={className} />
    </Suspense>
  );
}
