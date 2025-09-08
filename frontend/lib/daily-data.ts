export const MOCK_DAILY_TESTS = {
  "1": {
    id: "1",
    title: "리눅스 기본 명령어",
    category: "Linux",
    difficulty: "초급",
    createdAt: "2024-09-08T10:00:00Z",
    question: "현재 디렉토리의 파일 및 폴더 목록을 확인하는 명령어는 무엇인가요?",
    options: ["ls", "cd", "pwd", "mkdir"],
    answer: "ls",
    explanation: "`ls` 명령어는 List Segments의 약자로, 현재 위치의 파일 및 디렉토리 목록을 보여줍니다."
  },
  "2": {
    id: "2",
    title: "네트워크 OSI 7계층",
    category: "Network",
    difficulty: "중급",
    createdAt: "2024-09-07T11:30:00Z",
    question: "OSI 7계층 중 데이터의 암호화, 압축, 인코딩을 담당하는 계층은 어디인가요?",
    options: ["애플리케이션 계층", "프레젠테이션 계층", "세션 계층", "전송 계층"],
    answer: "프레젠테이션 계층",
    explanation: "프레젠테이션 계층(Presentation Layer)은 데이터의 형식을 변환하고, 암호화 및 압축을 수행하여 애플리케이션이 데이터를 올바르게 해석할 수 있도록 합니다."
  },
  "3": {
    id: "3",
    title: "데이터베이스 JOIN",
    category: "Database",
    difficulty: "중급",
    createdAt: "2024-09-06T09:00:00Z",
    question: "두 테이블에서 일치하는 레코드를 결합하는 가장 기본적인 JOIN 유형은 무엇인가요?",
    options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
    answer: "INNER JOIN",
    explanation: "INNER JOIN은 두 테이블 간에 지정된 조건이 일치하는 행들만 반환하는 가장 일반적인 조인 방식입니다."
  },
  "4": {
    id: "4",
    title: "Docker 기본 개념",
    category: "Server",
    difficulty: "초급",
    createdAt: "2024-09-09T08:00:00Z",
    question: "Docker에서 이미지(Image)와 컨테이너(Container)의 관계에 대한 설명으로 가장 올바른 것은?",
    options: [
      "이미지는 컨테이너를 실행하기 위한 설계도이며, 컨테이너는 이미지의 인스턴스이다.",
      "컨테이너는 이미지를 만들기 위한 템플릿이다.",
      "이미지와 컨테이너는 동일한 개념이다.",
      "이미지는 실행 중인 상태의 컨테이너를 의미한다."
    ],
    answer: "이미지는 컨테이너를 실행하기 위한 설계도이며, 컨테이너는 이미지의 인스턴스이다.",
    explanation: "Docker 이미지는 특정 환경을 실행하는 데 필요한 모든 파일과 설정을 포함하는 읽기 전용 템플릿입니다. 이 이미지를 기반으로 실행된 상태가 컨테이너이며, 하나의 이미지로 여러 개의 독립된 컨테이너를 생성할 수 있습니다."
  },
  "5": {
    id: "5",
    title: "리눅스 파일 권한",
    category: "Linux",
    difficulty: "중급",
    createdAt: "2024-09-09T11:00:00Z",
    question: "파일의 권한을 `rwxr-xr--`로 변경하는 `chmod` 명령어로 올바른 것은?",
    options: ["chmod 754 file.txt", "chmod 644 file.txt", "chmod 777 file.txt", "chmod 751 file.txt"],
    answer: "chmod 754 file.txt",
    explanation: "파일 권한은 소유자(rwx=4+2+1=7), 그룹(r-x=4+0+1=5), 그 외 사용자(r--=4+0+0=4)의 권한을 숫자로 표현하여 `chmod 754`로 설정할 수 있습니다."
  },
  "6": {
    id: "6",
    title: "네트워크 - 주요 포트",
    category: "Network",
    difficulty: "초급",
    createdAt: "2024-09-09T14:00:00Z",
    question: "웹 서버(HTTP)가 사용하는 기본 포트 번호는 무엇인가요?",
    options: ["21", "22", "80", "443"],
    answer: "80",
    explanation: "HTTP(Hypertext Transfer Protocol)는 웹 브라우저와 웹 서버 간의 통신에 사용되는 프로토콜이며, 기본적으로 80번 포트를 사용합니다. HTTPS는 443번 포트를 사용합니다."
  },
  "7": {
    id: "7",
    title: "리눅스 - 프로세스 확인",
    category: "Linux",
    difficulty: "초급",
    createdAt: "2024-09-09T15:00:00Z",
    question: "현재 시스템에서 실행 중인 모든 프로세스를 확인하는 명령어는 무엇인가요?",
    options: ["ls", "cd", "ps", "top"],
    answer: "ps",
    explanation: "`ps` 명령어는 현재 실행 중인 프로세스들의 스냅샷을 보여줍니다. `top` 명령어는 실시간으로 프로세스 사용량을 보여줍니다."
  },
  "8": {
    id: "8",
    title: "데이터베이스 - SQL 기본",
    category: "Database",
    difficulty: "초급",
    createdAt: "2024-09-09T16:00:00Z",
    question: "데이터베이스에서 새로운 테이블을 생성하는 SQL 명령어는 무엇인가요?",
    options: ["SELECT", "INSERT", "CREATE TABLE", "UPDATE"],
    answer: "CREATE TABLE",
    explanation: "`CREATE TABLE` 문은 데이터베이스 내에 새로운 테이블을 정의하고 생성할 때 사용됩니다."
  },
  "9": {
    id: "9",
    title: "systemd 서비스 심화",
    category: "Server",
    difficulty: "고급",
    createdAt: "2024-09-09T17:00:00Z",
    question: "systemd 서비스 파일에서 `ExecStartPre` 지시어의 역할로 가장 적절한 것은?",
    options: ["서비스 시작 전 실행할 명령 지정", "서비스가 실패했을 때 재시작 설정", "서비스가 종료될 때 실행할 명령 지정", "서비스의 메인 실행 파일 지정"],
    answer: "서비스 시작 전 실행할 명령 지정",
    explanation: "`ExecStartPre`는 `ExecStart` 명령이 실행되기 전에 수행될 명령을 지정합니다. 주로 서비스 시작 전 필요한 환경 설정이나 검증 작업을 수행할 때 사용됩니다."
  },
  "10": {
    id: "10",
    title: "네트워크 - 서브넷 마스크",
    category: "Network",
    difficulty: "중급",
    createdAt: "2024-09-09T18:00:00Z",
    question: "IP 주소 `192.168.1.10`과 서브넷 마스크 `255.255.255.0`이 주어졌을 때, 네트워크 주소는 무엇인가요?",
    options: ["192.168.1.0", "192.168.1.10", "192.168.1.255", "255.255.255.0"],
    answer: "192.168.1.0",
    explanation: "네트워크 주소는 IP 주소와 서브넷 마스크를 비트 단위로 AND 연산하여 얻습니다. `255.255.255.0`은 마지막 옥텟이 호스트 주소임을 의미하므로, `192.168.1.10`의 호스트 부분인 `10`이 `0`으로 변경되어 `192.168.1.0`이 됩니다."
  }
};