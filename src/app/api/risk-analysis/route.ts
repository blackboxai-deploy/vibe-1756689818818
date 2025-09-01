// Risk analysis API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type { 
  RiskAnalysis, 
  ApiResponse
} from '@/types/ergonomics';
import { performRiskAnalysis } from '@/lib/ergonomics/risk-assessment';
import { assessments, users } from '../assessments/route';

/**
 * POST /api/risk-analysis - Perform risk analysis on assessment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Find assessment
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Find user profile
    const userProfile = users.find(u => u.id === assessment.userId);
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Perform comprehensive risk analysis
    const riskAnalysis = performRiskAnalysis(assessment, userProfile);

    // Update assessment with new risk data
    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
    if (assessmentIndex !== -1) {
      assessments[assessmentIndex].overallScore = riskAnalysis.riskScore;
      assessments[assessmentIndex].riskLevel = riskAnalysis.overallRisk;
    }

    const response: ApiResponse<RiskAnalysis> = {
      success: true,
      data: riskAnalysis,
      message: 'Risk analysis completed successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error performing risk analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform risk analysis' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/risk-analysis/[assessmentId] - Get existing risk analysis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Find assessment
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Find user profile
    const userProfile = users.find(u => u.id === assessment.userId);
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Generate fresh risk analysis
    const riskAnalysis = performRiskAnalysis(assessment, userProfile);

    const response: ApiResponse<RiskAnalysis> = {
      success: true,
      data: riskAnalysis
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching risk analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk analysis' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/risk-analysis/batch - Analyze multiple assessments
 */
export async function POST_BATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentIds } = body;

    if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Assessment IDs array is required' },
        { status: 400 }
      );
    }

    const analyses: RiskAnalysis[] = [];
    const errors: string[] = [];

    for (const assessmentId of assessmentIds) {
      try {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          errors.push(`Assessment ${assessmentId} not found`);
          continue;
        }

        const userProfile = users.find(u => u.id === assessment.userId);
        if (!userProfile) {
          errors.push(`User profile for assessment ${assessmentId} not found`);
          continue;
        }

        const riskAnalysis = performRiskAnalysis(assessment, userProfile);
        analyses.push(riskAnalysis);

        // Update assessment
        const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
        if (assessmentIndex !== -1) {
          assessments[assessmentIndex].overallScore = riskAnalysis.riskScore;
          assessments[assessmentIndex].riskLevel = riskAnalysis.overallRisk;
        }
      } catch (error) {
        errors.push(`Error analyzing assessment ${assessmentId}: ${error}`);
      }
    }

    const response = {
      success: true,
      data: analyses,
      message: `Analyzed ${analyses.length} assessments successfully`,
      errors: errors.length > 0 ? errors : undefined
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error performing batch risk analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch risk analysis' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/risk-analysis/trends/[userId] - Get risk trends for user
 */
export async function GET_TRENDS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const months = parseInt(searchParams.get('months') || '6');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user assessments
    const userAssessments = assessments
      .filter(a => a.userId === userId)
      .sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime());

    if (userAssessments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No assessments found for user' },
        { status: 404 }
      );
    }

    // Filter by time period
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    const recentAssessments = userAssessments.filter(a => a.assessmentDate >= cutoffDate);

    // Calculate trend data
    const trendData = recentAssessments.map(assessment => ({
      date: assessment.assessmentDate,
      riskScore: assessment.overallScore,
      riskLevel: assessment.riskLevel,
      assessmentId: assessment.id
    }));

    // Calculate overall trend
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAssessments.length >= 2) {
      const first = recentAssessments[0];
      const last = recentAssessments[recentAssessments.length - 1];
      const change = last.overallScore - first.overallScore;
      
      if (change < -5) trend = 'improving'; // Lower score is better
      else if (change > 5) trend = 'declining';
    }

    // Calculate average improvement rate
    let improvementRate = 0;
    if (recentAssessments.length >= 2) {
      const first = recentAssessments[0];
      const last = recentAssessments[recentAssessments.length - 1];
      const timeSpan = (last.assessmentDate.getTime() - first.assessmentDate.getTime()) / (1000 * 60 * 60 * 24); // days
      const scoreChange = first.overallScore - last.overallScore; // Positive = improvement
      improvementRate = timeSpan > 0 ? (scoreChange / timeSpan) * 30 : 0; // Monthly rate
    }

    const response = {
      success: true,
      data: {
        userId,
        timeFrame: `${months} months`,
        assessmentCount: recentAssessments.length,
        currentRiskLevel: recentAssessments[recentAssessments.length - 1].riskLevel,
        currentScore: recentAssessments[recentAssessments.length - 1].overallScore,
        trend,
        improvementRate: Math.round(improvementRate * 100) / 100,
        trendData
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching risk trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk trends' },
      { status: 500 }
    );
  }
}