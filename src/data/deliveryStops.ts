import heroImg from '../assets/hero.webp';
import logoImg from '../assets/wangoz-logo.webp';
import restaurantImg from '../assets/restaurant.webp';
import groceryImg from '../assets/grocery.webp';
import medicalImg from '../assets/medical.webp';
import riderImg from '../assets/rider.webp';
import houseImg from '../assets/house.webp';

export type CardPlacement = 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';

export interface DeliveryStop {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  cardPlacement: CardPlacement;
  accentColor: string;
  highlightIcon: string;
}

export const deliveryStops: DeliveryStop[] = [
  {
    id: 'restaurant',
    badge: '01 • Food Delivery',
    title: 'Hot & Fresh\nFrom Local Favorites',
    description:
      'Craving burgers, biryani, or gourmet desserts? Our riders pick up piping-hot orders directly from top local kitchens with zero surge fees.',
    highlights: [
      'Live Kitchen-to-Door Tracking',
      'No Minimum Order Value',
      '30-Minute Hot Guarantee',
    ],
    imageSrc: restaurantImg,
    cardPlacement: 'top-right',
    accentColor: '#FF6B35',
    highlightIcon: 'flame',
  },
  {
    id: 'grocery',
    badge: '02 • Instant Grocery Mart',
    title: 'Daily Essentials &\nFarm Produce in 15 Mins',
    description:
      'Forgot milk, bread, or fresh veggies? Skip the supermarket queue. Handpicked produce and pantry staples delivered straight to your kitchen.',
    highlights: [
      'Farm-Fresh Quality Check',
      '5,000+ Daily Essentials',
      'Instant Morning & Late-Night Slots',
    ],
    imageSrc: groceryImg,
    cardPlacement: 'top-left',
    accentColor: '#2ECC71',
    highlightIcon: 'leaf',
  },
  {
    id: 'medical',
    badge: '03 • 24/7 Pharmacy & Care',
    title: 'Medicines & Wellness\non Standby',
    description:
      'Emergency prescriptions, OTC essentials, and wellness products dispatched immediately from verified neighborhood pharmacies.',
    highlights: [
      '24/7 Priority Dispatch',
      'Verified Licensed Pharmacies',
      'Easy Prescription Upload',
    ],
    imageSrc: medicalImg,
    cardPlacement: 'top-left',
    accentColor: '#14B8A6',
    highlightIcon: 'shield-check',
  },
];

export { heroImg, logoImg, riderImg, houseImg };
