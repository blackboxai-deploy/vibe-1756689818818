// Equipment database API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type { 
  EquipmentItem,
  ApiResponse,
  PaginatedResponse
} from '@/types/ergonomics';
import { 
  equipmentDatabase, 
  getEquipmentByCategory, 
  getEquipmentByPriceRange, 
  searchEquipment,
  getRecommendedEquipment
} from '@/lib/data/equipment-database';

/**
 * GET /api/equipment - Get equipment with filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const search = searchParams.get('search');
    const riskFactors = searchParams.get('riskFactors');
    const budget = searchParams.get('budget') as 'budget' | 'mid-range' | 'premium' | 'any' || 'any';
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, price, name
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredEquipment: EquipmentItem[] = [];

    // Apply different filtering strategies
    if (riskFactors) {
      // Get recommendations based on risk factors
      const riskArray = riskFactors.split(',').map(r => r.trim());
      filteredEquipment = getRecommendedEquipment(riskArray, budget);
    } else if (search) {
      // Search equipment
      filteredEquipment = searchEquipment(search);
    } else if (category) {
      // Filter by category
      filteredEquipment = getEquipmentByCategory(category);
    } else if (priceRange) {
      // Filter by price range
      filteredEquipment = getEquipmentByPriceRange(priceRange);
    } else {
      // Return all equipment
      filteredEquipment = [...equipmentDatabase];
    }

    // Additional filtering by price range if not used as primary filter
    if (priceRange && !getEquipmentByPriceRange(priceRange)) {
      filteredEquipment = filteredEquipment.filter(item => item.priceRange === priceRange);
    }

    // Sorting
    filteredEquipment.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'price':
          const priceOrder = { 'budget': 1, 'mid-range': 2, 'premium': 3, 'luxury': 4 };
          comparison = priceOrder[a.priceRange] - priceOrder[b.priceRange];
          break;
        default:
          comparison = b.rating - a.rating; // Default to rating desc
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEquipment = filteredEquipment.slice(startIndex, endIndex);

    const response: PaginatedResponse<EquipmentItem> = {
      success: true,
      data: paginatedEquipment,
      pagination: {
        page,
        limit,
        total: filteredEquipment.length,
        totalPages: Math.ceil(filteredEquipment.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/equipment/[id] - Get specific equipment item
 */
export async function GET_BY_ID(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    const equipment = equipmentDatabase.find(item => item.id === id);
    
    if (!equipment) {
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<EquipmentItem> = {
      success: true,
      data: equipment
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching equipment item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment item' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/equipment/categories - Get all equipment categories
 */
export async function GET_CATEGORIES() {
  try {
    const categories = Array.from(new Set(equipmentDatabase.map(item => item.category)));
    const categoryStats = categories.map(category => {
      const items = getEquipmentByCategory(category);
      return {
        name: category,
        count: items.length,
        averageRating: items.reduce((sum, item) => sum + item.rating, 0) / items.length,
        priceRanges: Array.from(new Set(items.map(item => item.priceRange)))
      };
    });

    const response: ApiResponse<typeof categoryStats> = {
      success: true,
      data: categoryStats
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching equipment categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment categories' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/equipment/recommendations - Get equipment recommendations
 */
export async function GET_RECOMMENDATIONS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const riskFactors = searchParams.get('riskFactors');
    const budget = searchParams.get('budget') as 'budget' | 'mid-range' | 'premium' | 'any' || 'any';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!riskFactors) {
      return NextResponse.json(
        { success: false, error: 'Risk factors are required for recommendations' },
        { status: 400 }
      );
    }

    const riskArray = riskFactors.split(',').map(r => r.trim());
    let recommendations = getRecommendedEquipment(riskArray, budget);

    // Filter by category if specified
    if (category) {
      recommendations = recommendations.filter(item => item.category === category);
    }

    // Limit results
    recommendations = recommendations.slice(0, limit);

    // Add recommendation reasoning
    const enhancedRecommendations = recommendations.map(item => ({
      ...item,
      recommendationReasons: getRecommendationReasons(item, riskArray)
    }));

    const response: ApiResponse<typeof enhancedRecommendations> = {
      success: true,
      data: enhancedRecommendations,
      message: `Found ${enhancedRecommendations.length} equipment recommendations`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching equipment recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment recommendations' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/equipment/compare - Compare multiple equipment items
 */
export async function GET_COMPARE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { success: false, error: 'Equipment IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',').map(id => id.trim());
    const equipmentItems = idArray
      .map(id => equipmentDatabase.find(item => item.id === id))
      .filter(item => item !== undefined) as EquipmentItem[];

    if (equipmentItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid equipment items found' },
        { status: 404 }
      );
    }

    // Generate comparison data
    const comparison = {
      items: equipmentItems,
      categories: Array.from(new Set(equipmentItems.map(item => item.category))),
      priceRanges: Array.from(new Set(equipmentItems.map(item => item.priceRange))),
      averageRating: equipmentItems.reduce((sum, item) => sum + item.rating, 0) / equipmentItems.length,
      commonFeatures: findCommonFeatures(equipmentItems),
      uniqueFeatures: findUniqueFeatures(equipmentItems),
      bestValue: findBestValue(equipmentItems),
      highestRated: equipmentItems.reduce((best, item) => 
        item.rating > best.rating ? item : best
      )
    };

    const response: ApiResponse<typeof comparison> = {
      success: true,
      data: comparison,
      message: `Comparing ${equipmentItems.length} equipment items`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error comparing equipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compare equipment' },
      { status: 500 }
    );
  }
}

// Helper functions

/**
 * Get recommendation reasons for an equipment item
 */
function getRecommendationReasons(item: EquipmentItem, riskFactors: string[]): string[] {
  const reasons: string[] = [];
  const riskString = riskFactors.join(' ').toLowerCase();

  if (riskString.includes('back') && item.ergonomicBenefits.some(benefit => 
    benefit.toLowerCase().includes('back') || benefit.toLowerCase().includes('spine'))) {
    reasons.push('Addresses back support needs');
  }

  if (riskString.includes('neck') && item.ergonomicBenefits.some(benefit => 
    benefit.toLowerCase().includes('neck') || benefit.toLowerCase().includes('posture'))) {
    reasons.push('Helps with neck alignment');
  }

  if (riskString.includes('wrist') && item.ergonomicBenefits.some(benefit => 
    benefit.toLowerCase().includes('wrist') || benefit.toLowerCase().includes('hand'))) {
    reasons.push('Reduces wrist strain');
  }

  if (riskString.includes('movement') && item.category === 'desk') {
    reasons.push('Promotes movement and posture changes');
  }

  if (item.rating >= 4.5) {
    reasons.push('Highly rated by users');
  }

  if (item.priceRange === 'budget') {
    reasons.push('Cost-effective solution');
  }

  return reasons;
}

/**
 * Find common features across equipment items
 */
function findCommonFeatures(items: EquipmentItem[]): string[] {
  if (items.length === 0) return [];
  
  return items[0].features.filter(feature =>
    items.every(item => item.features.includes(feature))
  );
}

/**
 * Find unique features for each equipment item
 */
function findUniqueFeatures(items: EquipmentItem[]): Record<string, string[]> {
  const allFeatures: string[] = [];
  items.forEach(item => allFeatures.push(...item.features));
  
  const featureCounts = allFeatures.reduce((acc, feature) => {
    acc[feature] = (acc[feature] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return items.reduce((acc, item) => {
    acc[item.id] = item.features.filter(feature => featureCounts[feature] === 1);
    return acc;
  }, {} as Record<string, string[]>);
}

/**
 * Find best value equipment item
 */
function findBestValue(items: EquipmentItem[]): EquipmentItem {
  const priceScores = { 'budget': 4, 'mid-range': 3, 'premium': 2, 'luxury': 1 };
  
  return items.reduce((best, item) => {
    const itemScore = item.rating + priceScores[item.priceRange];
    const bestScore = best.rating + priceScores[best.priceRange];
    return itemScore > bestScore ? item : best;
  });
}