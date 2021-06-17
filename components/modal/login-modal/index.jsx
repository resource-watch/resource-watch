import { useRouter } from 'next/router';
// component
import LoginModal from './component';

export default function LoginModalContainer() {
  const {
    query: {
      callbackUrl,
    },
  } = useRouter();

  return (<LoginModal callbackUrl={callbackUrl} />);
}
