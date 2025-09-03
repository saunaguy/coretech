"use client"

import { useState } from "react"
import { Search, MessageSquare, Eye, ThumbsUp, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

export default function NetworkBoardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const categories = ["전체", "라우팅", "방화벽", "VPN", "DNS", "보안", "모니터링", "트러블슈팅"]

  const posts = [
    {
      id: 1,
      title: "iptables 방화벽 규칙 설정 완벽 가이드",
      author: "네트워크보안전문가",
      date: "2024-01-15",
      views: 412,
      likes: 38,
      comments: 22,
      category: "방화벽",
      excerpt:
        "iptables를 사용한 리눅스 방화벽 설정부터 NAT, 포트 포워딩, DDoS 방어까지 실무 중심의 완벽 가이드입니다.",
    },
    {
      id: 2,
      title: "OpenVPN 서버 구축 및 다중 클라이언트 관리",
      author: "VPN관리자",
      date: "2024-01-14",
      views: 367,
      likes: 32,
      comments: 18,
      category: "VPN",
      excerpt:
        "OpenVPN 서버 설치부터 인증서 관리, 클라이언트별 접근 제어, 로그 모니터링까지 종합적인 VPN 솔루션 구축법입니다.",
    },
    {
      id: 3,
      title: "BIND9 DNS 서버와 도메인 위임 설정",
      author: "DNS아키텍트",
      date: "2024-01-13",
      views: 298,
      likes: 29,
      comments: 15,
      category: "DNS",
      excerpt:
        "BIND9 마스터/슬레이브 구성, 도메인 위임, DNSSEC 설정, 캐시 최적화까지 엔터프라이즈급 DNS 서버 구축 가이드입니다.",
    },
    {
      id: 4,
      title: "Wireshark로 네트워크 패킷 분석 마스터하기",
      author: "패킷분석전문가",
      date: "2024-01-12",
      views: 334,
      likes: 26,
      comments: 19,
      category: "모니터링",
      excerpt:
        "Wireshark 고급 필터링, 프로토콜 분석, 성능 병목 지점 찾기, 보안 위협 탐지까지 실무 패킷 분석 기법을 다룹니다.",
    },
    {
      id: 5,
      title: "Linux 라우팅 테이블과 정책 기반 라우팅",
      author: "네트워크엔지니어",
      date: "2024-01-11",
      views: 276,
      likes: 24,
      comments: 12,
      category: "라우팅",
      excerpt:
        "ip route 명령어 활용, 다중 라우팅 테이블 설정, 정책 기반 라우팅(PBR) 구현으로 복잡한 네트워크 토폴로지를 관리하는 방법입니다.",
    },
    {
      id: 6,
      title: "pfSense 방화벽 설정과 고급 기능 활용",
      author: "방화벽관리자",
      date: "2024-01-10",
      views: 245,
      likes: 21,
      comments: 14,
      category: "방화벽",
      excerpt:
        "pfSense를 이용한 기업용 방화벽 구축, 트래픽 셰이핑, IDS/IPS 설정, VPN 게이트웨이 구성까지 종합 가이드입니다.",
    },
    {
      id: 7,
      title: "네트워크 장애 진단과 트러블슈팅 체크리스트",
      author: "네트워크운영팀",
      date: "2024-01-09",
      views: 389,
      likes: 35,
      comments: 25,
      category: "트러블슈팅",
      excerpt:
        "ping, traceroute, netstat, ss 등 기본 도구부터 고급 진단 기법까지 체계적인 네트워크 장애 해결 방법론입니다.",
    },
    {
      id: 8,
      title: "WireGuard VPN 설정과 성능 최적화",
      author: "모던VPN전문가",
      date: "2024-01-08",
      views: 267,
      likes: 28,
      comments: 11,
      category: "VPN",
      excerpt: "차세대 VPN 프로토콜 WireGuard 설치, 키 관리, 멀티 피어 설정, 성능 튜닝까지 완벽 가이드입니다.",
    },
    {
      id: 9,
      title: "네트워크 보안 스캐닝과 취약점 점검",
      author: "보안감사관",
      date: "2024-01-07",
      views: 312,
      likes: 31,
      comments: 17,
      category: "보안",
      excerpt:
        "nmap, nessus, OpenVAS를 활용한 네트워크 보안 점검과 취약점 분석, 보안 강화 방안을 실무 중심으로 설명합니다.",
    },
    {
      id: 10,
      title: "VLAN 설정과 네트워크 세그멘테이션",
      author: "네트워크설계자",
      date: "2024-01-06",
      views: 198,
      likes: 19,
      comments: 9,
      category: "라우팅",
      excerpt:
        "스위치 VLAN 구성, 트렁크 포트 설정, Inter-VLAN 라우팅으로 효율적인 네트워크 세그멘테이션을 구현하는 방법입니다.",
    },
    {
      id: 11,
      title: "Nagios로 네트워크 인프라 모니터링 구축",
      author: "모니터링엔지니어",
      date: "2024-01-05",
      views: 234,
      likes: 22,
      comments: 13,
      category: "모니터링",
      excerpt:
        "Nagios Core 설치부터 호스트/서비스 모니터링, 알림 설정, 성능 그래프까지 종합적인 네트워크 모니터링 시스템 구축법입니다.",
    },
    {
      id: 12,
      title: "SSH 터널링과 포트 포워딩 활용법",
      author: "시스템관리자",
      date: "2024-01-04",
      views: 289,
      likes: 26,
      comments: 16,
      category: "보안",
      excerpt:
        "SSH 로컬/리모트 포트 포워딩, 동적 터널링, ProxyJump 설정으로 안전한 원격 접속 환경을 구축하는 실무 가이드입니다.",
    },
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Linux & Server Lab</h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    홈
                  </Link>
                  <Link
                    href="/linux"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Linux 기초
                  </Link>
                  <Link
                    href="/board"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    게시판
                  </Link>
                  <Link
                    href="/qna"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Q&A
                  </Link>
                  <Link
                    href="/about"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    소개
                  </Link>
                </div>
              </nav>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">네트워크 게시판</h1>
            <p className="text-muted-foreground">네트워크 구성, 보안, 트러블슈팅 관련 정보를 공유하세요</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="게시글 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm">{post.excerpt}</p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    <AuthGuard requiredRole="admin">
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </AuthGuard>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Write Post Button */}
          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              새 글 작성
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
