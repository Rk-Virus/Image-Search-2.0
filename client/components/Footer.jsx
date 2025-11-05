import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-gray-50 py-4 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div>© {year} Image Search 2.0</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </div>
    </footer>
  );
}