export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'OutdoorGearRental'],
    name: 'Wild Trail Gear',
    description:
      'Rent quality camping and hiking gear in Sri Lanka. Tents, cooking equipment, trekking accessories and outdoor essentials for your next adventure.',
    url: 'https://www.wildtrailgear.lk',
    telephone: '+94 77 686 4908',
    email: 'Wild.trail.gears@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No 27/A, Bodhirukkarama Road, Nalluruwa',
      addressLocality: 'Panadura',
      addressCountry: 'LK',
    },
    areaServed: 'Sri Lanka',
    serviceType: ['Camping Gear Rental', 'Hiking Gear Rental', 'Outdoor Equipment Rental'],
    image: 'https://www.wildtrailgear.lk/images/brand-poster.jpeg',
    priceRange: 'LKR 200 – LKR 900/day',
    openingHours: 'Mo-Su 00:00-24:00',
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
