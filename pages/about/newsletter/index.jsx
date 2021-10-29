import {
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
// components
import LayoutNewsletter from 'layout/app/newsletter';

export default function NewsletterPage() {
  const {
    query,
  } = useRouter();

  const isOceanWatch = useMemo(() => query.origin === 'ocean-watch', [query]);

  return (<LayoutNewsletter isOceanWatch={isOceanWatch} />);
}
