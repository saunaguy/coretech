import React, { useEffect, useState } from 'react';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 샘플 문제 로드(백엔드 준비되면 경로 사용)
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/quiz/sample`)
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => setQuestions([]));
  }, []);

  const submit = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    setResult(await res.json());
  };

  return (
    <section>
      <h2>퀴즈</h2>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: 16 }}>
          <div>{q.prompt}</div>
          {q.options.map((opt, idx) => (
            <label key={idx} style={{ display: 'block' }}>
              <input
                type="radio"
                name={q.id}
                onChange={() => setAnswers({ ...answers, [q.id]: idx })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>제출</button>
      {result && (
        <pre style={{ background: '#f7f7f7', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}

