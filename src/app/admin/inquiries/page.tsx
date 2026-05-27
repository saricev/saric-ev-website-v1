import { getInquiries } from '@/lib/data';
import { Download } from 'lucide-react';
import InquiryActions from './InquiryActions';
import PermissionGate from '@/components/admin/PermissionGate';

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <PermissionGate permission="inquiries:read">
          <a
            href="/api/inquiries/export"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
        </PermissionGate>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No inquiries yet.</td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className={`hover:bg-gray-50 ${!inquiry.read ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inquiry.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inquiry.timestamp ? new Date(inquiry.timestamp).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4">
                    {inquiry.read ? (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">Read</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">New</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <InquiryActions id={inquiry.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
