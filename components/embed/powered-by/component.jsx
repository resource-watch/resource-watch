import Link from 'next/link';

export default function PoweredBy() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 15,
      }}
    >
      Powered by
      <Link href="/">
        <a
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/static/images/logo-embed.png"
            alt="Resource Watch logo"
            style={{
              display: 'block',
              height: 21,
              margin: '0 0 0 10px',
            }}
          />
        </a>
      </Link>
    </div>
  );
}
