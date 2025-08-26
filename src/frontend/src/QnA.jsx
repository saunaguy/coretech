import React, { useEffect, useState } from 'react';

export default function QnA() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const load = async () => {
    const r = await fetch(`${base}/api/v1/qna/questions`);
    setList(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await fetch(`${base}/api/v1/qna/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, tags: [] }),
    });
    setTitle('');
    setBody('');
    load();
  };

  return (
    <section>
      <h2>Q&A</h2>
      <div style={{ marginBottom: 16 }}>
        <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <textarea placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} />
        <br />
        <button onClick={create}>등록</button>
      </div>
      <ul>
        {list.map((q) => (
          <li key={q.id}>
            <strong>#{q.id}</strong> {q.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

