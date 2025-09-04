import Link from "next/link"
import { Terminal, Server, Globe, Users } from "lucide-react"

export default function CategoryGrid() {
  const items = [
    { href: "/linux", title: "Linux 기초", desc: "입문부터 차근차근", icon: Terminal, bg: "bg-blue-100", hover: "group-hover:bg-blue-200", color: "text-blue-600" },
    { href: "/server", title: "서버 관리", desc: "서비스/관리 시작하기", icon: Server, bg: "bg-emerald-100", hover: "group-hover:bg-emerald-200", color: "text-emerald-600" },
    { href: "/network", title: "네트워크", desc: "진단/포트/프로토콜", icon: Globe, bg: "bg-purple-100", hover: "group-hover:bg-purple-200", color: "text-purple-600" },
    { href: "/practice", title: "실습", desc: "문제 풀며 익히기", icon: Users, bg: "bg-orange-100", hover: "group-hover:bg-orange-200", color: "text-orange-600" },
  ]
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map(({ href, title, desc, icon: Icon, bg, hover, color }) => (
        <Link key={href} href={href} className="block" title={title}>
          <div className="hover:shadow-lg transition-shadow cursor-pointer group rounded-xl border bg-card text-card-foreground">
            <div className="p-6 text-center space-y-4">
              <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mx-auto ${hover} transition-colors`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  )
}

