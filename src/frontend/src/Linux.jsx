export default function Linux() {
  const Card = ({ title, children }) => (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div>{children}</div>
    </div>
  );

  const Code = ({ children }) => (
    <pre style={{ background: '#0b1021', color: '#e6edf3', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
      <code>{children}</code>
    </pre>
  );

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <Card title="개요">
        <ul>
          <li>유닉스 계열 OS, 배포판: Ubuntu, Debian, Fedora, Arch 등</li>
          <li>철학: "모든 것은 파일", 조합 가능한 작은 툴</li>
          <li>패키지: apt, yum/dnf, pacman으로 설치/업데이트</li>
        </ul>
      </Card>

      <Card title="파일시스템 & 경로">
        <ul>
          <li>루트: <code>/</code> · 홈: <code>/home/&lt;user&gt;</code></li>
          <li>주요 디렉터리: <code>/etc</code> 설정, <code>/var/log</code> 로그, <code>/usr/bin</code> 실행파일</li>
          <li>상대/절대 경로와 와일드카드(<code>*</code>, <code>?</code>)</li>
        </ul>
        <Code>{`pwd
ls -la /etc
cd ~/projects && ls *.md`}</Code>
      </Card>

      <Card title="권한 & 소유권">
        <ul>
          <li>형식: 사용자(u)/그룹(g)/기타(o) · rwx(읽기/쓰기/실행)</li>
          <li><code>chmod</code> 퍼미션, <code>chown</code> 소유자 변경</li>
        </ul>
        <Code>{`ls -l script.sh
chmod +x script.sh
sudo chown user:group app.log`}</Code>
      </Card>

      <Card title="프로세스 & 서비스">
        <ul>
          <li><code>ps</code>, <code>top</code>, <code>htop</code>으로 프로세스 모니터링</li>
          <li>systemd: <code>systemctl status nginx</code></li>
        </ul>
        <Code>{`ps aux | grep python
top
sudo systemctl restart nginx`}</Code>
      </Card>

      <Card title="네트워킹">
        <ul>
          <li>포트/연결: <code>ss -tulpen</code>, <code>curl</code> 요청</li>
          <li>호스트/라우팅: <code>ip addr</code>, <code>ip route</code></li>
        </ul>
        <Code>{`ss -tulpen | head
curl -I https://example.com
ip addr show dev eth0`}</Code>
      </Card>

      <Card title="패키지 & 업데이트">
        <ul>
          <li>Deb 계열: <code>apt update && apt upgrade</code></li>
          <li>RPM 계열: <code>dnf update</code> 또는 <code>yum update</code></li>
        </ul>
        <Code>{`sudo apt update && sudo apt install git
sudo dnf search nodejs`}</Code>
      </Card>

      <Card title="파일 검색 & 편집">
        <ul>
          <li>검색: <code>find</code>, <code>grep</code></li>
          <li>편집: <code>nano</code>, <code>vim</code></li>
        </ul>
        <Code>{`find . -type f -name "*.log"
grep -R "ERROR" /var/log
vim ~/.bashrc`}</Code>
      </Card>

      <Card title="환경 변수 & 쉘">
        <ul>
          <li>쉘: bash, zsh · 프로파일: <code>~/.bashrc</code>, <code>~/.zshrc</code></li>
          <li>일시 설정 vs 영구 설정 구분</li>
        </ul>
        <Code>{`export PATH=$HOME/bin:$PATH
echo $SHELL
source ~/.bashrc`}</Code>
      </Card>
    </div>
  );
}

