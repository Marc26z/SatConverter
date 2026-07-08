import { useSeoMeta } from '@unhead/react';
import { SatsConverter } from '@/components/SatsConverter';

const Index = () => {
  useSeoMeta({
    title: 'Sats Converter – USD to Satoshis',
    description: 'Instantly convert US dollars to Bitcoin satoshis using live prices from mempool.space.',
  });

  return <SatsConverter />;
};

export default Index;
