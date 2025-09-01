// Health metrics tracking API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type { 
  HealthMetric,
  ProgressTracking,
  ApiResponse,
  PaginatedResponse
} from '@/types/ergonomics';
import { assessments, users } from '../assessments/route';

// In-memory storage for health metrics
const healthMetrics: HealthMetric[] = [];
const progressTracking: ProgressTracking[] = [];

/**
 * POST /api/health-metrics - Record new health metric
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, metricType, value, notes, assessmentId } = body;

    if (!userId || !metricType || value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'User ID, metric type, and value are required' },
        { status: 400 }
      );
    }

    // Validate metric type
    const validMetricTypes = ['pain-level', 'comfort-score', 'productivity', 'energy-level', 'sleep-quality'];
    if (!validMetricTypes.includes(metricType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid metric type' },
        { status: 400 }
      );
    }

    // Validate value range (0-10)
    if (value < 0 || value > 10) {
      return NextResponse.json(
        { success: false, error: 'Value must be between 0 and 10' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create health metric
    const healthMetric: HealthMetric = {
      id: 'metric_' + Date.now(),
      userId,
      metricType,
      value,
      recordedDate: new Date(),
      notes,
      assessmentId
    };

    healthMetrics.push(healthMetric);

    // Update progress tracking
    await updateProgressTracking(userId);

    const response: ApiResponse<HealthMetric> = {
      success: true,
      data: healthMetric,
      message: 'Health metric recorded successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error recording health metric:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record health metric' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/health-metrics - Get health metrics with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const metricType = searchParams.get('metricType');
    const days = parseInt(searchParams.get('days') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Filter metrics
    let filteredMetrics = healthMetrics.filter(m => m.userId === userId);

    if (metricType) {
      filteredMetrics = filteredMetrics.filter(m => m.metricType === metricType);
    }

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filteredMetrics = filteredMetrics.filter(m => m.recordedDate >= cutoffDate);

    // Sort by date (newest first)
    filteredMetrics.sort((a, b) => b.recordedDate.getTime() - a.recordedDate.getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMetrics = filteredMetrics.slice(startIndex, endIndex);

    const response: PaginatedResponse<HealthMetric> = {
      success: true,
      data: paginatedMetrics,
      pagination: {
        page,
        limit,
        total: filteredMetrics.length,
        totalPages: Math.ceil(filteredMetrics.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health metrics' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/health-metrics/progress/[userId] - Get progress tracking for user
 */
export async function GET_PROGRESS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    let userProgress = progressTracking.find(p => p.userId === userId);
    
    if (!userProgress) {
      // Create initial progress tracking
      userProgress = await createInitialProgressTracking(userId);
    }

    const response: ApiResponse<ProgressTracking> = {
      success: true,
      data: userProgress
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching progress tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress tracking' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/health-metrics/summary/[userId] - Get health metrics summary
 */
export async function GET_SUMMARY(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Filter metrics for the time period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const recentMetrics = healthMetrics.filter(m => 
      m.userId === userId && m.recordedDate >= cutoffDate
    );

    if (recentMetrics.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No metrics found for the specified period' },
        { status: 404 }
      );
    }

    // Calculate averages by metric type
    const metricAverages = recentMetrics.reduce((acc, metric) => {
      if (!acc[metric.metricType]) {
        acc[metric.metricType] = { sum: 0, count: 0 };
      }
      acc[metric.metricType].sum += metric.value;
      acc[metric.metricType].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    const averages = Object.entries(metricAverages).reduce((acc, [type, data]) => {
      acc[type] = Math.round((data.sum / data.count) * 10) / 10;
      return acc;
    }, {} as Record<string, number>);

    // Calculate trends (compare first half vs second half of period)
    const midDate = new Date(cutoffDate.getTime() + (Date.now() - cutoffDate.getTime()) / 2);
    const firstHalf = recentMetrics.filter(m => m.recordedDate < midDate);
    const secondHalf = recentMetrics.filter(m => m.recordedDate >= midDate);

    const trends = {} as Record<string, 'improving' | 'declining' | 'stable'>;
    
    Object.keys(averages).forEach(metricType => {
      const firstHalfAvg = firstHalf
        .filter(m => m.metricType === metricType)
        .reduce((acc, m) => acc + m.value, 0) / Math.max(1, firstHalf.filter(m => m.metricType === metricType).length);
      
      const secondHalfAvg = secondHalf
        .filter(m => m.metricType === metricType)
        .reduce((acc, m) => acc + m.value, 0) / Math.max(1, secondHalf.filter(m => m.metricType === metricType).length);
      
      const difference = secondHalfAvg - firstHalfAvg;
      
      if (metricType === 'pain-level') {
        // For pain level, lower is better
        trends[metricType] = difference < -0.5 ? 'improving' : difference > 0.5 ? 'declining' : 'stable';
      } else {
        // For other metrics, higher is better
        trends[metricType] = difference > 0.5 ? 'improving' : difference < -0.5 ? 'declining' : 'stable';
      }
    });

    // Get most recent entry for each metric type
    const latestMetrics = Object.keys(averages).reduce((acc, metricType) => {
      const latest = recentMetrics
        .filter(m => m.metricType === metricType)
        .sort((a, b) => b.recordedDate.getTime() - a.recordedDate.getTime())[0];
      if (latest) {
        acc[metricType] = {
          value: latest.value,
          recordedDate: latest.recordedDate
        };
      }
      return acc;
    }, {} as Record<string, { value: number; recordedDate: Date }>);

    const summary = {
      userId,
      timeframe: `${days} days`,
      totalEntries: recentMetrics.length,
      averages,
      trends,
      latestMetrics,
      overallWellbeingScore: calculateOverallWellbeingScore(averages)
    };

    const response: ApiResponse<typeof summary> = {
      success: true,
      data: summary
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching health metrics summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health metrics summary' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/health-metrics/[id] - Update health metric
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    const metricIndex = healthMetrics.findIndex(m => m.id === id);
    if (metricIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Health metric not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { value, notes } = body;

    // Validate value if provided
    if (value !== undefined && (value < 0 || value > 10)) {
      return NextResponse.json(
        { success: false, error: 'Value must be between 0 and 10' },
        { status: 400 }
      );
    }

    // Update metric
    const updatedMetric = {
      ...healthMetrics[metricIndex],
      ...(value !== undefined && { value }),
      ...(notes !== undefined && { notes })
    };

    healthMetrics[metricIndex] = updatedMetric;

    // Update progress tracking
    await updateProgressTracking(updatedMetric.userId);

    const response: ApiResponse<HealthMetric> = {
      success: true,
      data: updatedMetric,
      message: 'Health metric updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating health metric:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update health metric' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/health-metrics/[id] - Delete health metric
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    const metricIndex = healthMetrics.findIndex(m => m.id === id);
    if (metricIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Health metric not found' },
        { status: 404 }
      );
    }

    const userId = healthMetrics[metricIndex].userId;
    healthMetrics.splice(metricIndex, 1);

    // Update progress tracking
    await updateProgressTracking(userId);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Health metric deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting health metric:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete health metric' },
      { status: 500 }
    );
  }
}

// Helper functions

/**
 * Update progress tracking for a user
 */
async function updateProgressTracking(userId: string): Promise<ProgressTracking> {
  let userProgress = progressTracking.find(p => p.userId === userId);
  
  if (!userProgress) {
    userProgress = await createInitialProgressTracking(userId);
  }

  // Get user's health metrics
  const userMetrics = healthMetrics.filter(m => m.userId === userId);
  const userAssessments = assessments.filter(a => a.userId === userId);

  if (userMetrics.length === 0 || userAssessments.length === 0) {
    return userProgress;
  }

  // Update current date and metrics
  userProgress.currentDate = new Date();
  userProgress.metrics = userMetrics;

  // Calculate current score based on latest assessment
  const latestAssessment = userAssessments
    .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
  userProgress.currentScore = latestAssessment.overallScore;

  // Calculate improvement
  userProgress.improvement = userProgress.initialScore > 0 
    ? Math.round(((userProgress.initialScore - userProgress.currentScore) / userProgress.initialScore) * 100)
    : 0;

  // Update milestones
  const significantImprovements = userAssessments
    .filter(a => userProgress.initialScore - a.overallScore >= 10)
    .map(a => ({
      date: a.assessmentDate,
      achievement: `Risk score improved to ${a.overallScore}`,
      score: a.overallScore
    }));

  userProgress.milestones = significantImprovements;

  return userProgress;
}

/**
 * Create initial progress tracking for a user
 */
async function createInitialProgressTracking(userId: string): Promise<ProgressTracking> {
  const userAssessments = assessments.filter(a => a.userId === userId);
  const userMetrics = healthMetrics.filter(m => m.userId === userId);

  const firstAssessment = userAssessments
    .sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime())[0];
  
  const latestAssessment = userAssessments
    .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];

  const initialScore = firstAssessment?.overallScore || 0;
  const currentScore = latestAssessment?.overallScore || 0;

  const progress: ProgressTracking = {
    userId,
    startDate: firstAssessment?.assessmentDate || new Date(),
    currentDate: new Date(),
    initialScore,
    currentScore,
    improvement: initialScore > 0 ? Math.round(((initialScore - currentScore) / initialScore) * 100) : 0,
    metrics: userMetrics,
    completedRecommendations: [],
    milestones: []
  };

  progressTracking.push(progress);
  return progress;
}

/**
 * Calculate overall wellbeing score from metric averages
 */
function calculateOverallWellbeingScore(averages: Record<string, number>): number {
  const weights = {
    'pain-level': -0.3, // Negative because lower is better
    'comfort-score': 0.25,
    'productivity': 0.2,
    'energy-level': 0.15,
    'sleep-quality': 0.1
  };

  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(averages).forEach(([metricType, value]) => {
    const weight = weights[metricType as keyof typeof weights];
    if (weight && typeof value === 'number') {
      weightedSum += value * Math.abs(weight) * (weight < 0 ? -1 : 1);
      totalWeight += Math.abs(weight);
    }
  });

  const score = totalWeight > 0 ? (weightedSum / totalWeight) : 5;
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

// Export for use in other endpoints
export { healthMetrics, progressTracking };