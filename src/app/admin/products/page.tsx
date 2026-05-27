import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getProducts } from '@/lib/data';
import DeleteButton from './DeleteButton';
import PermissionGate from '@/components/admin/PermissionGate';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <PermissionGate permission="products:write">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </PermissionGate>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.model}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.seats}</td>
                <td className="px-6 py-4 text-sm">
                  {product.featured ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Yes</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <PermissionGate permission="products:write">
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </PermissionGate>
                    <PermissionGate permission="products:delete">
                      <DeleteButton slug={product.slug} />
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
