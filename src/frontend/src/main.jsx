import { useState } from "react";
import { createRoot } from "react-dom/client";
import Quiz from "./Quiz.jsx";
import QnA from "./QnA.jsx";

function App() {
  const [tab, setTab] = useState("home");
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>CoreTech Frontend</h1>
      <p>협업 로그 기반 학습 프로젝트 (GPT × Gemini)</p>
      <nav style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <button onClick={() => setTab("home")}>홈</button>
        <button onClick={() => setTab("quiz")}>퀴즈</button>
        <button onClick={() => setTab("qna")}>Q&A</button>
      </nav>
      {tab === "home" && <p>Linux/Network/Docker 학습 사이트 MVP</p>}
      {tab === "quiz" && <Quiz />}
      {tab === "qna" && <QnA />}
    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
