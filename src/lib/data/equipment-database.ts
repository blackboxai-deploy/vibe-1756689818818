// Equipment database for ergonomic recommendations

import type { EquipmentItem } from '@/types/ergonomics';

export const equipmentDatabase: EquipmentItem[] = [
  // Ergonomic Chairs
  {
    id: 'chair_001',
    name: 'Premium Ergonomic Office Chair',
    category: 'chair',
    description: 'Full-featured ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back.',
    features: [
      'Adjustable lumbar support',
      'Height adjustable armrests',
      'Breathable mesh backrest',
      'Seat depth adjustment',
      'Tilt mechanism with lock',
      'Weight capacity: 300 lbs'
    ],
    ergonomicBenefits: [
      'Proper spinal alignment',
      'Reduced lower back pressure',
      'Improved circulation',
      'Customizable support'
    ],
    priceRange: 'premium',
    rating: 4.5,
    imageUrl: 'https://placehold.co/400x300?text=Premium+Ergonomic+Office+Chair+with+lumbar+support+and+mesh+back',
    specifications: {
      'Seat Height': '16-20 inches',
      'Seat Width': '20 inches',
      'Seat Depth': '18-20 inches',
      'Backrest Height': '26 inches',
      'Weight': '45 lbs',
      'Material': 'Mesh and fabric'
    },
    suitableFor: ['Desk workers', 'Tall users', 'Back pain sufferers']
  },
  {
    id: 'chair_002',
    name: 'Budget Ergonomic Task Chair',
    category: 'chair',
    description: 'Affordable chair with essential ergonomic features for everyday use.',
    features: [
      'Basic lumbar support',
      'Height adjustment',
      'Tilt function',
      'Padded seat',
      'Swivel base'
    ],
    ergonomicBenefits: [
      'Basic back support',
      'Proper sitting height',
      'Movement flexibility'
    ],
    priceRange: 'budget',
    rating: 3.8,
    imageUrl: 'https://placehold.co/400x300?text=Budget+Ergonomic+Task+Chair+with+basic+lumbar+support',
    specifications: {
      'Seat Height': '17-21 inches',
      'Seat Width': '18 inches',
      'Weight Capacity': '250 lbs',
      'Material': 'Fabric and plastic'
    },
    suitableFor: ['Home office', 'Students', 'Light desk work']
  },

  // Standing Desks
  {
    id: 'desk_001',
    name: 'Electric Height Adjustable Standing Desk',
    category: 'desk',
    description: 'Motorized sit-stand desk with memory presets and stability features.',
    features: [
      'Electric height adjustment',
      '4 memory presets',
      'Anti-collision safety',
      'Cable management',
      'Sturdy steel frame',
      'Quiet motor operation'
    ],
    ergonomicBenefits: [
      'Alternating sitting/standing',
      'Reduced prolonged sitting',
      'Improved circulation',
      'Better posture variety'
    ],
    priceRange: 'premium',
    rating: 4.7,
    imageUrl: 'https://placehold.co/400x300?text=Electric+Height+Adjustable+Standing+Desk+with+memory+presets',
    specifications: {
      'Height Range': '28-48 inches',
      'Desktop Size': '48x30 inches',
      'Weight Capacity': '200 lbs',
      'Speed': '1 inch per second',
      'Motor Type': 'Dual motor'
    },
    suitableFor: ['All desk workers', 'Health-conscious users', 'Tall users']
  },
  {
    id: 'desk_002',
    name: 'Manual Standing Desk Converter',
    category: 'desk',
    description: 'Desktop riser that converts existing desk to standing workstation.',
    features: [
      'Manual height adjustment',
      'Separate keyboard tray',
      'Monitor platform',
      'Easy setup',
      'Compact design'
    ],
    ergonomicBenefits: [
      'Quick sitting/standing changes',
      'Uses existing desk',
      'Improves posture options'
    ],
    priceRange: 'mid-range',
    rating: 4.2,
    imageUrl: 'https://placehold.co/400x300?text=Manual+Standing+Desk+Converter+with+keyboard+tray',
    specifications: {
      'Height Adjustment': '6.5-16.5 inches',
      'Work Surface': '35x23 inches',
      'Keyboard Tray': '26x12 inches',
      'Weight': '35 lbs'
    },
    suitableFor: ['Budget-conscious', 'Renters', 'Temporary solutions']
  },

  // Monitor Accessories
  {
    id: 'monitor_001',
    name: 'Dual Monitor Arm Mount',
    category: 'monitor',
    description: 'Adjustable arm mount for two monitors with full articulation.',
    features: [
      'Supports two monitors up to 27 inches',
      'Full articulation (tilt, swivel, rotate)',
      'VESA compatible',
      'Cable management',
      'Clamp or grommet mounting'
    ],
    ergonomicBenefits: [
      'Optimal monitor positioning',
      'Reduced neck strain',
      'Increased desk space',
      'Improved viewing angles'
    ],
    priceRange: 'mid-range',
    rating: 4.4,
    imageUrl: 'https://placehold.co/400x300?text=Dual+Monitor+Arm+Mount+with+full+articulation',
    specifications: {
      'Monitor Size': 'Up to 27 inches each',
      'Weight Capacity': '17.6 lbs per arm',
      'VESA': '75x75, 100x100mm',
      'Adjustment Range': '360° rotation'
    },
    suitableFor: ['Multi-monitor setups', 'Programmers', 'Traders']
  },

  // Keyboards
  {
    id: 'keyboard_001',
    name: 'Ergonomic Split Keyboard',
    category: 'keyboard',
    description: 'Split design keyboard that promotes natural hand positioning.',
    features: [
      'Split key layout',
      'Adjustable tenting',
      'Palm rest included',
      'Low-profile keys',
      'USB connectivity'
    ],
    ergonomicBenefits: [
      'Natural hand alignment',
      'Reduced wrist deviation',
      'Lower strain on forearms',
      'Improved typing posture'
    ],
    priceRange: 'mid-range',
    rating: 4.1,
    imageUrl: 'https://placehold.co/400x300?text=Ergonomic+Split+Keyboard+with+palm+rest',
    specifications: {
      'Layout': 'QWERTY split',
      'Key Type': 'Low-profile membrane',
      'Dimensions': '18.9 x 9.3 x 1.2 inches',
      'Cable Length': '6 feet'
    },
    suitableFor: ['Heavy typists', 'Wrist pain sufferers', 'Programmers']
  },
  {
    id: 'keyboard_002',
    name: 'Compact Mechanical Keyboard',
    category: 'keyboard',
    description: 'Space-saving mechanical keyboard with ergonomic key switches.',
    features: [
      'Compact 87-key layout',
      'Mechanical switches',
      'Adjustable backlighting',
      'Detachable cable',
      'Multiple switch options'
    ],
    ergonomicBenefits: [
      'Reduced reach distance',
      'Tactile feedback',
      'More mouse space',
      'Better key response'
    ],
    priceRange: 'mid-range',
    rating: 4.6,
    imageUrl: 'https://placehold.co/400x300?text=Compact+Mechanical+Keyboard+with+backlighting',
    specifications: {
      'Layout': '87-key tenkeyless',
      'Switch Type': 'Cherry MX options',
      'Backlighting': 'RGB LED',
      'Connection': 'USB-C detachable'
    },
    suitableFor: ['Gamers', 'Compact workspace', 'Tactile preference']
  },

  // Mice
  {
    id: 'mouse_001',
    name: 'Vertical Ergonomic Mouse',
    category: 'mouse',
    description: 'Upright mouse design that reduces wrist pronation.',
    features: [
      'Vertical grip design',
      'Programmable buttons',
      'Adjustable DPI',
      'Wireless connectivity',
      'Rechargeable battery'
    ],
    ergonomicBenefits: [
      'Natural handshake position',
      'Reduced wrist twisting',
      'Less forearm strain',
      'Improved circulation'
    ],
    priceRange: 'mid-range',
    rating: 4.0,
    imageUrl: 'https://placehold.co/400x300?text=Vertical+Ergonomic+Mouse+with+natural+grip',
    specifications: {
      'DPI Range': '800-2400',
      'Battery Life': 'Up to 3 months',
      'Connectivity': '2.4GHz wireless',
      'Dimensions': '4.7 x 3.1 x 2.8 inches'
    },
    suitableFor: ['Mouse pain sufferers', 'Heavy mouse users', 'RSI prevention']
  },

  // Accessories
  {
    id: 'accessory_001',
    name: 'Memory Foam Lumbar Support Cushion',
    category: 'accessories',
    description: 'Portable lumbar support pillow for existing chairs.',
    features: [
      'Memory foam construction',
      'Breathable mesh cover',
      'Adjustable straps',
      'Washable cover',
      'Contoured design'
    ],
    ergonomicBenefits: [
      'Improved lumbar curve',
      'Reduced back pressure',
      'Better spinal alignment',
      'Enhanced comfort'
    ],
    priceRange: 'budget',
    rating: 4.3,
    imageUrl: 'https://placehold.co/400x300?text=Memory+Foam+Lumbar+Support+Cushion+with+straps',
    specifications: {
      'Material': 'Memory foam',
      'Dimensions': '14 x 13 x 4 inches',
      'Weight': '2 lbs',
      'Cover': 'Removable mesh'
    },
    suitableFor: ['Existing chair upgrade', 'Travel', 'Budget solution']
  },
  {
    id: 'accessory_002',
    name: 'Adjustable Footrest',
    category: 'accessories',
    description: 'Height and angle adjustable footrest for proper leg support.',
    features: [
      'Height adjustment (4-7 inches)',
      'Tilt adjustment (0-20 degrees)',
      'Massage surface texture',
      'Non-slip base',
      'Durable plastic construction'
    ],
    ergonomicBenefits: [
      'Proper leg positioning',
      'Improved circulation',
      'Reduced leg pressure',
      'Better posture support'
    ],
    priceRange: 'budget',
    rating: 4.1,
    imageUrl: 'https://placehold.co/400x300?text=Adjustable+Footrest+with+massage+surface',
    specifications: {
      'Platform Size': '17.7 x 11.8 inches',
      'Height Range': '4-7 inches',
      'Tilt Range': '0-20 degrees',
      'Weight Capacity': '50 lbs'
    },
    suitableFor: ['Short users', 'Circulation issues', 'Desk height mismatch']
  },
  {
    id: 'accessory_003',
    name: 'Document Holder with Light',
    category: 'accessories',
    description: 'Adjustable document stand with built-in LED lighting.',
    features: [
      'Adjustable height and angle',
      'Built-in LED light',
      'Paper clips included',
      'Foldable design',
      'USB powered light'
    ],
    ergonomicBenefits: [
      'Reduced neck bending',
      'Better document visibility',
      'Improved reading posture',
      'Less eye strain'
    ],
    priceRange: 'budget',
    rating: 4.0,
    imageUrl: 'https://placehold.co/400x300?text=Document+Holder+with+LED+Light+and+adjustable+stand',
    specifications: {
      'Adjustment Range': '7 positions',
      'Light': 'USB LED',
      'Material': 'Metal and plastic',
      'Folded Size': '12 x 9 x 1 inches'
    },
    suitableFor: ['Document work', 'Reading tasks', 'Data entry']
  }
];

/**
 * Filter equipment by category
 */
export function getEquipmentByCategory(category: string): EquipmentItem[] {
  return equipmentDatabase.filter(item => item.category === category);
}

/**
 * Filter equipment by price range
 */
export function getEquipmentByPriceRange(priceRange: string): EquipmentItem[] {
  return equipmentDatabase.filter(item => item.priceRange === priceRange);
}

/**
 * Search equipment by features or benefits
 */
export function searchEquipment(query: string): EquipmentItem[] {
  const lowerQuery = query.toLowerCase();
  return equipmentDatabase.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
    item.ergonomicBenefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get equipment recommendations based on assessment
 */
export function getRecommendedEquipment(
  riskFactors: string[],
  budget: 'budget' | 'mid-range' | 'premium' | 'any' = 'any'
): EquipmentItem[] {
  const recommendations: EquipmentItem[] = [];
  const riskString = riskFactors.join(' ').toLowerCase();

  // Chair recommendations
  if (riskString.includes('back') || riskString.includes('posture') || riskString.includes('lumbar')) {
    const chairs = budget === 'any' 
      ? getEquipmentByCategory('chair')
      : getEquipmentByCategory('chair').filter(item => item.priceRange === budget);
    recommendations.push(...chairs.slice(0, 2));
  }

  // Desk recommendations
  if (riskString.includes('standing') || riskString.includes('height') || riskString.includes('movement')) {
    const desks = budget === 'any' 
      ? getEquipmentByCategory('desk')
      : getEquipmentByCategory('desk').filter(item => item.priceRange === budget);
    recommendations.push(...desks.slice(0, 1));
  }

  // Monitor recommendations
  if (riskString.includes('neck') || riskString.includes('eye') || riskString.includes('monitor')) {
    const monitors = budget === 'any' 
      ? getEquipmentByCategory('monitor')
      : getEquipmentByCategory('monitor').filter(item => item.priceRange === budget);
    recommendations.push(...monitors.slice(0, 1));
  }

  // Input device recommendations
  if (riskString.includes('wrist') || riskString.includes('hand') || riskString.includes('repetitive')) {
    const keyboards = budget === 'any' 
      ? getEquipmentByCategory('keyboard')
      : getEquipmentByCategory('keyboard').filter(item => item.priceRange === budget);
    const mice = budget === 'any' 
      ? getEquipmentByCategory('mouse')
      : getEquipmentByCategory('mouse').filter(item => item.priceRange === budget);
    recommendations.push(...keyboards.slice(0, 1), ...mice.slice(0, 1));
  }

  // Accessory recommendations
  const accessories = budget === 'any' 
    ? getEquipmentByCategory('accessories')
    : getEquipmentByCategory('accessories').filter(item => item.priceRange === budget);
  recommendations.push(...accessories.slice(0, 2));

  return recommendations.slice(0, 6); // Limit to top 6 recommendations
}