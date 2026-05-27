import { getDealerApplications } from '@/lib/data';
import DealerActions from './DealerActions';

export default async function AdminDealersPage() {
  const dealers = await getDealerApplications();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dealer Applications</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dealers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No dealer applications yet.</td>
              </tr>
            ) : (
              dealers.map((dealer) => (
                <tr key={dealer.id} className={`hover:bg-gray-50 ${!dealer.read ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{dealer.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dealer.contactPerson}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dealer.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dealer.annualVolume}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dealer.timestamp ? new Date(dealer.timestamp).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4">
                    {dealer.read ? (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">Read</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">New</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DealerActions id={dealer.id} />
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
