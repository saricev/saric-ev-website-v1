import { Car, MessageSquare, Users, FileText } from 'lucide-react';
import { getProducts, getInquiries, getDealerApplications, getBlogPosts } from '@/lib/data';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [products, inquiries, dealers, blogPosts] = await Promise.all([
    getProducts(),
    getInquiries(),
    getDealerApplications(),
    getBlogPosts(),
  ]);

  const stats = [
    { label: 'Products', value: products.length, icon: Car, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'Inquiries', value: inquiries.length, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-green-500' },
    { label: 'Dealer Apps', value: dealers.length, icon: Users, href: '/admin/dealers', color: 'bg-purple-500' },
    { label: 'Blog Posts', value: blogPosts.length, icon: FileText, href: '/admin/blog', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h2>
        {inquiries.length === 0 ? (
          <p className="text-gray-500">No inquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.slice(-5).reverse().map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                  <p className="text-sm text-gray-500">{inquiry.company} - {inquiry.country}</p>
                </div>
                <span className="text-xs text-gray-400">{inquiry.timestamp ? new Date(inquiry.timestamp).toLocaleDateString() : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
