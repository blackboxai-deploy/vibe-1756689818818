// Reports generation API endpoints

import { NextRequest, NextResponse } from 'next/server';
import type { 
  AssessmentReport,
  ApiResponse,
  PaginatedResponse,
  RiskAnalysis,
  RecommendationSet
} from '@/types/ergonomics';
import { performRiskAnalysis } from '@/lib/ergonomics/risk-assessment';
import { generateAIRecommendations } from '@/lib/ergonomics/recommendations';
import { getRecommendedEquipment } from '@/lib/data/equipment-database';
import { assessments, users } from '../assessments/route';
import { recommendationSets } from '../recommendations/route';
import { progressTracking } from '../health-metrics/route';

// In-memory storage for reports
const reports: AssessmentReport[] = [];

/**
 * POST /api/reports - Generate comprehensive assessment report
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, reportType = 'detailed', includeEquipmentSuggestions = true } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Validate report type
    const validReportTypes = ['summary', 'detailed', 'comparison', 'progress'];
    if (!validReportTypes.includes(reportType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid report type' },
        { status: 400 }
      );
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

    // Generate report sections
    const riskAnalysis = performRiskAnalysis(assessment, userProfile);
    
    // Get or generate recommendations
    let recommendations = recommendationSets.find(r => r.assessmentId === assessmentId);
    if (!recommendations) {
      recommendations = await generateAIRecommendations(assessment, riskAnalysis, userProfile);
      recommendationSets.push(recommendations);
    }

    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(assessment, riskAnalysis, recommendations);

    // Create report
    const report: AssessmentReport = {
      id: 'report_' + Date.now(),
      assessmentId,
      userId: assessment.userId,
      reportType,
      generatedDate: new Date(),
      sections: {
        executive_summary: executiveSummary,
        risk_analysis: riskAnalysis,
        recommendations
      },
      format: 'json'
    };

    // Add progress data for progress reports
    if (reportType === 'progress') {
      const userProgress = progressTracking.find(p => p.userId === assessment.userId);
      if (userProgress) {
        report.sections.progress_data = userProgress;
      }
    }

    // Add equipment suggestions if requested
    if (includeEquipmentSuggestions) {
      const riskFactorNames = riskAnalysis.factors.map(f => f.name);
      const equipmentSuggestions = getRecommendedEquipment(riskFactorNames);
      report.sections.equipment_suggestions = equipmentSuggestions;
    }

    reports.push(report);

    const response: ApiResponse<AssessmentReport> = {
      success: true,
      data: report,
      message: 'Report generated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reports - Get reports with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const assessmentId = searchParams.get('assessmentId');
    const reportType = searchParams.get('reportType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredReports = [...reports];

    if (userId) {
      filteredReports = filteredReports.filter(r => r.userId === userId);
    }

    if (assessmentId) {
      filteredReports = filteredReports.filter(r => r.assessmentId === assessmentId);
    }

    if (reportType) {
      filteredReports = filteredReports.filter(r => r.reportType === reportType);
    }

    // Sort by date (newest first)
    filteredReports.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    const response: PaginatedResponse<AssessmentReport> = {
      success: true,
      data: paginatedReports,
      pagination: {
        page,
        limit,
        total: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reports/[id] - Get specific report
 */
export async function GET_BY_ID(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const report = reports.find(r => r.id === id);
    
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<AssessmentReport> = {
      success: true,
      data: report
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reports/[id] - Delete report
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    reports.splice(reportIndex, 1);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Report deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}

// Helper functions

/**
 * Generate executive summary for report
 */
function generateExecutiveSummary(
  assessment: any,
  riskAnalysis: RiskAnalysis,
  recommendations: RecommendationSet
): string {
  const { overallRisk, riskScore, factors } = riskAnalysis;
  const topRisks = factors.slice(0, 3).map(f => f.name).join(', ');
  const criticalRecommendations = recommendations.recommendations
    .filter(r => r.priority === 'critical' || r.priority === 'high').length;

  return `
ERGONOMIC ASSESSMENT EXECUTIVE SUMMARY

Assessment Date: ${assessment.assessmentDate.toLocaleDateString()}
Overall Risk Level: ${overallRisk.toUpperCase()}
Risk Score: ${riskScore}/100

KEY FINDINGS:
${factors.length > 0 ? `Primary risk factors identified: ${topRisks}` : 'No significant risk factors identified.'}

RECOMMENDATIONS:
- Total recommendations: ${recommendations.recommendations.length}
- High priority actions: ${criticalRecommendations}
- Immediate actions required: ${recommendations.recommendations.filter(r => r.category === 'immediate').length}

NEXT STEPS:
${riskScore > 75 ? 'Immediate intervention required to prevent injury.' :
  riskScore > 50 ? 'Proactive measures recommended to reduce risk.' :
  riskScore > 25 ? 'Minor adjustments will optimize ergonomic setup.' :
  'Continue current practices with regular monitoring.'}

This assessment was ${recommendations.aiGenerated ? 'enhanced with AI-powered analysis' : 'generated using standard protocols'}.
  `.trim();
}

// Export for use in other endpoints
export { reports };