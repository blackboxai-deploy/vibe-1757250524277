import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/layout/Header';
import Feed from '@/components/feed/Feed';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Feed />
        </main>
      </div>
    </ProtectedRoute>
  );
}