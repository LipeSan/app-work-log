"use client"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="bg-gray-500">
      <div className="flex flex-col items-center gap-8">
        <img
          src="https://bahbq.com.au/wp-content/uploads/2016/01/BahBQ_Logo_150px3.png"
          alt="WorkLogger Logo"
          className="w-64 h-64 object-contain"
        />
        <a href="/api/auth/signin">
          <Button size="lg" className="w-40">
            Login
          </Button>
        </a>
      </div>
    </div>
  );
}
