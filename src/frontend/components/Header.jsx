
import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Coretech</h1>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                AI Lab
              </a>
              <a
                href="/linux"
                className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Linux 기초
              </a>
              <a
                href="/board"
                className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                게시판
              </a>
              <a
                href="/qna"
                className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Q&A
              </a>
              <a
                href="/about"
                className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                소개
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
