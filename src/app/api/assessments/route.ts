// Ergonomic assessments API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type {
  ErgonomicAssessment,
  UserProfile,
  ApiResponse,
  PaginatedResponse,
  AssessmentFormData
} from '@/types/ergonomics';

// In-memory storage for demo (replace with database in production)
const assessments: ErgonomicAssessment[] = [];
const users: UserProfile[] = [];

/**
 * GET /api/assessments - Get all assessments or filter by user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredAssessments = assessments;
    
    if (userId) {
      filteredAssessments = assessments.filter(a => a.userId === userId);
    }

    // Sort by date (newest first)
    filteredAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

    const response: PaginatedResponse<ErgonomicAssessment> = {
      success: true,
      data: paginatedAssessments,
      pagination: {
        page,
        limit,
        total: filteredAssessments.length,
        totalPages: Math.ceil(filteredAssessments.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assessments - Create new assessment
 */
export async function POST(request: NextRequest) {
  try {
    const body: AssessmentFormData = await request.json();

    // Validate required fields
    if (!body.workspaceSetup || !body.postureData || !body.movementPatterns) {
      return NextResponse.json(
        { success: false, error: 'Missing required assessment data' },
        { status: 400 }
      );
    }

    // Create or update user profile
    let userId = 'user_' + Date.now();
    if (body.userProfile.email) {
      const existingUser = users.find(u => u.email === body.userProfile.email);
      if (existingUser) {
        userId = existingUser.id;
        // Update user profile
        Object.assign(existingUser, body.userProfile, { updatedAt: new Date() });
      } else {
        // Create new user
        const newUser: UserProfile = {
          id: userId,
          name: body.userProfile.name || 'Anonymous User',
          email: body.userProfile.email || '',
          age: body.userProfile.age || 30,
          height: body.userProfile.height || 170,
          weight: body.userProfile.weight || 70,
          occupation: body.userProfile.occupation || 'Office Worker',
          workHoursPerDay: body.userProfile.workHoursPerDay || 8,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        users.push(newUser);
      }
    }

    // Calculate basic risk score (will be updated by risk analysis endpoint)
    const basicRiskScore = calculateBasicRiskScore(body);
    const riskLevel = getRiskLevelFromScore(basicRiskScore);

    // Create assessment
    const assessment: ErgonomicAssessment = {
      id: 'assessment_' + Date.now(),
      userId,
      assessmentDate: new Date(),
      workspaceSetup: body.workspaceSetup,
      postureData: body.postureData,
      movementPatterns: body.movementPatterns,
      symptoms: body.symptoms || [],
      overallScore: basicRiskScore,
      riskLevel,
      assessmentType: assessments.filter(a => a.userId === userId).length === 0 ? 'initial' : 'follow-up',
      notes: body.notes
    };

    assessments.push(assessment);

    const response: ApiResponse<ErgonomicAssessment> = {
      success: true,
      data: assessment,
      message: 'Assessment created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/assessments/[id] - Get specific assessment
 */
export async function GET_BY_ID(id: string) {
  try {
    const assessment = assessments.find(a => a.id === id);
    
    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<ErgonomicAssessment> = {
      success: true,
      data: assessment
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/assessments/[id] - Update assessment
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID required' },
        { status: 400 }
      );
    }

    const assessmentIndex = assessments.findIndex(a => a.id === id);
    
    if (assessmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    const body: Partial<ErgonomicAssessment> = await request.json();
    
    // Update assessment
    assessments[assessmentIndex] = {
      ...assessments[assessmentIndex],
      ...body,
      id, // Ensure ID doesn't change
    };

    const response: ApiResponse<ErgonomicAssessment> = {
      success: true,
      data: assessments[assessmentIndex],
      message: 'Assessment updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/assessments/[id] - Delete assessment
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID required' },
        { status: 400 }
      );
    }

    const assessmentIndex = assessments.findIndex(a => a.id === id);
    
    if (assessmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    assessments.splice(assessmentIndex, 1);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Assessment deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
}

// Helper functions

/**
 * Calculate basic risk score from assessment data
 */
function calculateBasicRiskScore(data: AssessmentFormData): number {
  let riskScore = 0;

  // Basic posture risks
  if (Math.abs(data.postureData.neckAngle) > 30) riskScore += 20;
  else if (Math.abs(data.postureData.neckAngle) > 15) riskScore += 10;

  if (data.postureData.shoulderPosition !== 'relaxed') riskScore += 15;
  if (data.postureData.backCurvature === 'slouched') riskScore += 20;
  if (data.postureData.wristPosition !== 'neutral') riskScore += 10;

  // Basic workspace risks
  if (!data.workspaceSetup.lumbarSupport) riskScore += 15;
  if (!data.workspaceSetup.footSupport) riskScore += 10;
  if (data.workspaceSetup.lightingQuality === 'poor') riskScore += 10;

  // Basic movement risks
  if (data.movementPatterns.screenBreakFrequency < 1) riskScore += 15;
  if (data.movementPatterns.stretchingFrequency < 2) riskScore += 10;

  // Symptoms risk
  const symptomSeverity = data.symptoms?.reduce((acc, symptom) => {
    if (symptom.severity === 'severe') return acc + 25;
    if (symptom.severity === 'moderate') return acc + 15;
    if (symptom.severity === 'mild') return acc + 5;
    return acc;
  }, 0) || 0;
  riskScore += Math.min(30, symptomSeverity);

  return Math.min(100, riskScore);
}

/**
 * Convert risk score to risk level
 */
function getRiskLevelFromScore(score: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (score < 25) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'critical';
}

// Export helper functions for use in other endpoints
export { assessments, users };