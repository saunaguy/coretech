# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "CoreTech" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - navigation [ref=e8]:
          - link "Linux 기초" [ref=e9] [cursor=pointer]:
            - /url: /linux
          - link "게시판" [ref=e10] [cursor=pointer]:
            - /url: /board
          - link "Q&A" [ref=e11] [cursor=pointer]:
            - /url: /qna
          - link "소개" [ref=e12] [cursor=pointer]:
            - /url: /about
          - link "로그인" [ref=e13] [cursor=pointer]:
            - /url: /login
        - button "테마 전환" [ref=e14]:
          - img
          - img [ref=e15]
          - generic [ref=e17]: 테마 전환
  - alert [ref=e18]
  - main [ref=e19]:
    - generic [ref=e20]:
      - generic [ref=e22]: 새 글 작성
      - generic [ref=e23]:
        - textbox "제목" [ref=e24]
        - textbox "내용" [ref=e25]
        - generic [ref=e26]:
          - button "등록" [ref=e27]
          - button "취소" [ref=e28]:
            - link "취소" [ref=e29] [cursor=pointer]:
              - /url: /board
```