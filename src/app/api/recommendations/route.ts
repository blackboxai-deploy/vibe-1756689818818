// AI-powered recommendations API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type { 
  RecommendationSet,
  ApiResponse
} from '@/types/ergonomics';
import { generateAIRecommendations, filterRecommendations, sortRecommendationsByPriority } from '@/lib/ergonomics/recommendations';
import { performRiskAnalysis } from '@/lib/ergonomics/risk-assessment';
import { assessments, users } from '../assessments/route';

// In-memory storage for recommendations
const recommendationSets: RecommendationSet[] = [];

/**
 * POST /api/recommendations - Generate AI-powered recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, regenerate = false } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Check if recommendations already exist
    if (!regenerate) {
      const existingRecommendations = recommendationSets.find(r => r.assessmentId === assessmentId);
      if (existingRecommendations) {
        const response: ApiResponse<RecommendationSet> = {
          success: true,
          data: existingRecommendations,
          message: 'Existing recommendations returned (use regenerate=true to create new ones)'
        };
        return NextResponse.json(response);
      }
    }

    // Find assessment and user
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    const userProfile = users.find(u => u.id === assessment.userId);
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Perform risk analysis
    const riskAnalysis = performRiskAnalysis(assessment, userProfile);

    // Generate AI recommendations
    const recommendationSet = await generateAIRecommendations(assessment, riskAnalysis, userProfile);

    // Remove existing recommendations if regenerating
    if (regenerate) {
      const existingIndex = recommendationSets.findIndex(r => r.assessmentId === assessmentId);
      if (existingIndex !== -1) {
        recommendationSets.splice(existingIndex, 1);
      }
    }

    // Store recommendations
    recommendationSets.push(recommendationSet);

    const response: ApiResponse<RecommendationSet> = {
      success: true,
      data: recommendationSet,
      message: 'Recommendations generated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/recommendations - Get recommendations by assessment ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');

    if (!assessmentId && !userId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID or User ID is required' },
        { status: 400 }
      );
    }

    let recommendationSet: RecommendationSet | undefined;

    if (assessmentId) {
      recommendationSet = recommendationSets.find(r => r.assessmentId === assessmentId);
    } else if (userId) {
      // Get latest recommendations for user
      const userRecommendations = recommendationSets
        .filter(r => r.userId === userId)
        .sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());
      recommendationSet = userRecommendations[0];
    }

    if (!recommendationSet) {
      return NextResponse.json(
        { success: false, error: 'Recommendations not found' },
        { status: 404 }
      );
    }

    // Apply filters if provided
    let filteredRecommendations = recommendationSet.recommendations;
    
    if (category || priority || type) {
      filteredRecommendations = filterRecommendations(filteredRecommendations, {
        category: category || undefined,
        priority: priority || undefined,
        type: type || undefined
      });
    }

    // Sort by priority
    filteredRecommendations = sortRecommendationsByPriority(filteredRecommendations);

    const response: ApiResponse<{
      recommendationSet: RecommendationSet;
      filteredRecommendations: typeof filteredRecommendations;
    }> = {
      success: true,
      data: {
        recommendationSet,
        filteredRecommendations
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recommendations/[id] - Update recommendation status
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recommendationId = searchParams.get('recommendationId');
    const assessmentId = searchParams.get('assessmentId');
    
    if (!recommendationId || !assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Recommendation ID and Assessment ID are required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    // Find recommendation set
    const recommendationSetIndex = recommendationSets.findIndex(r => r.assessmentId === assessmentId);
    if (recommendationSetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Recommendation set not found' },
        { status: 404 }
      );
    }

    // Find specific recommendation
    const recommendationIndex = recommendationSets[recommendationSetIndex].recommendations
      .findIndex(r => r.id === recommendationId);
    
    if (recommendationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    // Update recommendation (extend type to include status tracking)
    const updatedRecommendation = {
      ...recommendationSets[recommendationSetIndex].recommendations[recommendationIndex],
      status: status || 'pending',
      notes: notes || undefined,
      updatedAt: new Date()
    };

    recommendationSets[recommendationSetIndex].recommendations[recommendationIndex] = updatedRecommendation;

    const response: ApiResponse<typeof updatedRecommendation> = {
      success: true,
      data: updatedRecommendation,
      message: 'Recommendation updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recommendations - Delete recommendation set
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    
    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const recommendationSetIndex = recommendationSets.findIndex(r => r.assessmentId === assessmentId);
    if (recommendationSetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Recommendation set not found' },
        { status: 404 }
      );
    }

    recommendationSets.splice(recommendationSetIndex, 1);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Recommendation set deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting recommendation set:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recommendation set' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/recommendations/summary/[userId] - Get recommendations summary for user
 */
export async function GET_SUMMARY(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all recommendations for user
    const userRecommendations = recommendationSets.filter(r => r.userId === userId);
    
    if (userRecommendations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recommendations found for user' },
        { status: 404 }
      );
    }

    // Get latest recommendation set
    const latestRecommendations = userRecommendations
      .sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime())[0];

    // Calculate summary statistics
    const allRecommendations = latestRecommendations.recommendations;
    const criticalCount = allRecommendations.filter(r => r.priority === 'critical').length;
    const highCount = allRecommendations.filter(r => r.priority === 'high').length;
    const immediateCount = allRecommendations.filter(r => r.category === 'immediate').length;
    const freeCount = allRecommendations.filter(r => r.estimatedCost === 'free').length;

    // Group by type
    const typeGroups = allRecommendations.reduce((acc, rec) => {
      acc[rec.type] = (acc[rec.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = {
      userId,
      totalRecommendations: allRecommendations.length,
      criticalPriority: criticalCount,
      highPriority: highCount,
      immediateActions: immediateCount,
      freeImplementations: freeCount,
      typeBreakdown: typeGroups,
      latestGenerated: latestRecommendations.generatedDate,
      aiGenerated: latestRecommendations.aiGenerated
    };

    const response: ApiResponse<typeof summary> = {
      success: true,
      data: summary
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching recommendations summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations summary' },
      { status: 500 }
    );
  }
}

// Export for use in other endpoints
export { recommendationSets };