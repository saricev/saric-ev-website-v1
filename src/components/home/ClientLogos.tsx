import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import { Client } from '@/types';

export default function ClientLogos({ clients }: { clients: Client[] }) {
  return (
    <section className="py-16 bg-white">
      <Container>
        <SectionTitle
          title="Trusted by Industry Leaders"
          subtitle="Our vehicles are used by leading organizations worldwide."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            >
              <span className="text-lg font-semibold text-gray-400">{client.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
