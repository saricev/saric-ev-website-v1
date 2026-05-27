import Badge from '@/components/ui/Badge';

interface ProductConfigProps {
  battery: {
    type: string;
    capacity: string;
    options: string[];
  };
  certifications: string[];
  tags: string[];
}

export default function ProductConfig({ battery, certifications, tags }: ProductConfigProps) {
  return (
    <div className="space-y-6">
      {/* Battery Options */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Battery Options
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {battery.type}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Capacity:</span> {battery.capacity}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {battery.options.map((opt) => (
              <Badge key={opt} variant="success">{opt}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Certifications
        </h3>
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert) => (
            <Badge key={cert} variant="primary">{cert}</Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Applications
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
