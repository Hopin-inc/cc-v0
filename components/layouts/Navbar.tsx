import React from "react";
import { Button } from "@/components/ui";

interface NavbarProps {
  items: { name: string; href: string }[];
}

export function Navbar({ items }: NavbarProps) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* ロゴなどがあればここに追加 */}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="ml-4">
              コメントを表示
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
