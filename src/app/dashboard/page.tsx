'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: string;
  name: string;
  status: string;
  nextBillingDate: Date;
  amount: number;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    subscriptions: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userResponse, subscriptionsResponse] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/subscriptions'),
        ]);

        if (!userResponse.ok || !subscriptionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const subscriptionsData = await subscriptionsResponse.json();

        setUserDetails(userData);
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{userDetails?.name}</span>
                <span className="text-sm text-gray-500">{userDetails?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {userDetails?.name}!
          </h2>
          <p className="mt-1 text-gray-500">
            Member since {new Date(userDetails?.createdAt || '').toLocaleDateString()}
          </p>
          <p className="text-gray-500">
            Total Subscriptions: {userDetails?._count.subscriptions}
          </p>
        </div>

        {/* Subscriptions Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Active Subscriptions
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {subscription.name}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-500">
                      Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${subscription.amount}
                      <span className="text-sm text-gray-500">/mo</span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 