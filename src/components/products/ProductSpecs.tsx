interface ProductSpecsProps {
  specs: Record<string, string>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <tbody>
          {Object.entries(specs).map(([key, value], index) => (
            <tr
              key={key}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-5 py-3 text-sm font-medium text-gray-700 w-1/2 border-r border-gray-200">
                {key}
              </td>
              <td className="px-5 py-3 text-sm text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
