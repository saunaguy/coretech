import { useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home.jsx";
import Linux from "./Linux.jsx";
// import Quiz from "./Quiz.jsx";
// import QnA from "./QnA.jsx";

function App() {
  const [tab, setTab] = useState("home");
  return (
    <main style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 24, lineHeight: 1.5 }}>
      <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>CoreTech 학습 사이트</h1>
          <p style={{ margin: "4px 0 0", color: "#555" }}>MVP — 홈 → Linux 정보</p>
        </div>
        {/* 최소화: Linux 외 기능은 주석 처리 */}
      </header>

      <section style={{ marginTop: 16 }}>
        {tab === "home" && <Home onStartLinux={() => setTab("linux")} />}
        {tab === "linux" && (
          <div>
            <button
              onClick={() => setTab("home")}
              style={{ marginBottom: 12, padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}
            >
              ← 홈으로
            </button>
            <Linux />
          </div>
        )}
        {/* 향후 확장용 */}
        {/* {tab === "quiz" && <Quiz />} */}
        {/* {tab === "qna" && <QnA />} */}
      </section>
    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
