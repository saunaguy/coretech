import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">CoreTech</Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/linux" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Linux 기초</Link>
              <Link href="/board" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">게시판</Link>
              <Link href="/qna" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Q&A</Link>
              <Link href="/about" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">소개</Link>
              <Link href="/login" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">로그인</Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
