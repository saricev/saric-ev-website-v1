import { Solution } from '@/types';

export const solutions: Solution[] = [
  {
    slug: 'tourism-sightseeing',
    title: 'Tourism & Sightseeing',
    subtitle: 'Enhance Visitor Experience',
    description:
      'Our electric sightseeing vehicles provide comfortable, eco-friendly transportation for tourists in resorts, theme parks, scenic areas, and large campuses. Silent operation and zero emissions make them ideal for nature-friendly environments.',
    image: '/images/solutions/tourism.jpg',
    icon: 'map',
    features: [
      'Open-air design for scenic viewing',
      '8-11 passenger capacity options',
      '80 km range on single charge',
      'Custom branding & livery available',
      'Weather canopy options',
      'Audio guide system integration',
    ],
    relatedProducts: ['tour-cart-8p', 'tour-cart-11p'],
  },
  {
    slug: 'security-patrol',
    title: 'Security & Patrol',
    subtitle: 'Efficient Area Coverage',
    description:
      'Purpose-built patrol vehicles for security teams in gated communities, industrial parks, airports, and event venues. Quick acceleration and high visibility design ensure rapid response capability.',
    image: '/images/solutions/patrol.jpg',
    icon: 'shield',
    features: [
      'Emergency lights & siren included',
      'High-visibility livery options',
      '100 km extended range',
      '40 km/h top speed',
      'Police-grade suspension',
      'Communication equipment mounts',
    ],
    relatedProducts: ['patrol-vehicle-4p'],
  },
  {
    slug: 'logistics-delivery',
    title: 'Logistics & Delivery',
    subtitle: 'Last-Mile Solutions',
    description:
      'Electric logistics vehicles for efficient cargo transport within factories, warehouses, airports, and campuses. Reduce operating costs by up to 80% compared to fuel-powered alternatives.',
    image: '/images/solutions/logistics.jpg',
    icon: 'truck',
    features: [
      '1500 kg payload capacity',
      'Enclosed cargo compartment',
      'Low maintenance cost',
      'Customizable cargo configurations',
      'Easy loading/unloading design',
      'Fleet management compatible',
    ],
    relatedProducts: ['logistics-van'],
  },
  {
    slug: 'resort-shuttle',
    title: 'Resort & Campus Shuttle',
    subtitle: 'Seamless Guest Transport',
    description:
      'Reliable shuttle vehicles for resorts, hotels, universities, and large corporate campuses. Provide comfortable guest transportation while maintaining your property\'s green image.',
    image: '/images/solutions/shuttle.jpg',
    icon: 'bus',
    features: [
      'Comfortable padded seating',
      'Luggage rack available',
      'ADA-compliant options',
      'GPS tracking system',
      'Low noise operation',
      'All-weather canopy',
    ],
    relatedProducts: ['tour-cart-8p', 'tour-cart-11p'],
  },
];
