import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { Solution } from '@/types';

interface SolutionCardProps {
  solution: Solution;
  reverse?: boolean;
}

export default function SolutionCard({ solution, reverse = false }: SolutionCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className={`relative aspect-[16/10] rounded-xl overflow-hidden ${reverse ? 'lg:order-2' : ''}`}>
        <Image
          src={solution.image}
          alt={solution.title}
          fill
          className="object-cover"
        />
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        <p className="text-primary font-semibold text-sm uppercase tracking-wider">
          {solution.subtitle}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">{solution.title}</h3>
        <p className="mt-4 text-gray-600 leading-relaxed">{solution.description}</p>
        <ul className="mt-6 space-y-3">
          {solution.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
