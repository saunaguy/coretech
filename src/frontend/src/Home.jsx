export default function Home({ onStartLinux }) {
  return (
    <section style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>학습 사이트 홈</h2>
      <p style={{ color: '#555' }}>
        CoreTech 학습 사이트 MVP입니다. 우선 Linux 기본 정보를 빠르게 확인할 수 있도록 구성했습니다.
      </p>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={onStartLinux}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #111', background: '#111', color: '#fff' }}
        >
          Linux 시작하기
        </button>
      </div>
    </section>
  );
}

