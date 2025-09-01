// Risk assessment and analysis utilities

import type {
  RiskCalculationInput,
  RiskAnalysis,
  RiskFactor,
  ErgonomicAssessment,
  UserProfile
} from '@/types/ergonomics';

import {
  calculateOverallRiskScore,
  getRiskLevel,
  generateRiskFactors
} from './calculations';

/**
 * Perform comprehensive risk analysis
 */
export function performRiskAnalysis(
  assessment: ErgonomicAssessment,
  userProfile: UserProfile
): RiskAnalysis {
  const input: RiskCalculationInput = {
    workspace: assessment.workspaceSetup,
    posture: assessment.postureData,
    movement: assessment.movementPatterns,
    symptoms: assessment.symptoms,
    userProfile: {
      age: userProfile.age,
      height: userProfile.height,
      weight: userProfile.weight,
      workHoursPerDay: userProfile.workHoursPerDay
    }
  };

  const riskScore = calculateOverallRiskScore(input);
  const overallRisk = getRiskLevel(riskScore);
  const factors = generateRiskFactors(input);
  const priorityAreas = identifyPriorityAreas(factors);

  return {
    assessmentId: assessment.id,
    overallRisk,
    riskScore,
    factors,
    priorityAreas,
    analysisDate: new Date()
  };
}

/**
 * Identify priority areas for intervention
 */
export function identifyPriorityAreas(factors: RiskFactor[]): string[] {
  const priorities: string[] = [];
  
  // Sort factors by severity and score
  const sortedFactors = factors
    .filter(factor => factor.severity === 'critical' || factor.severity === 'high')
    .sort((a, b) => b.score - a.score);

  // Add top risk categories
  const categories = new Set(sortedFactors.slice(0, 3).map(f => f.category));
  
  if (categories.has('posture')) {
    priorities.push('Improve posture alignment and body positioning');
  }
  
  if (categories.has('equipment')) {
    priorities.push('Upgrade workspace equipment and setup');
  }
  
  if (categories.has('movement')) {
    priorities.push('Increase movement and break frequency');
  }
  
  if (categories.has('environment')) {
    priorities.push('Optimize environmental conditions');
  }
  
  if (categories.has('time')) {
    priorities.push('Manage work duration and scheduling');
  }

  // Add specific high-risk symptoms
  const criticalSymptoms = factors.filter(f => 
    f.category === 'posture' && f.name.includes('Discomfort') && f.severity === 'critical'
  );
  
  if (criticalSymptoms.length > 0) {
    priorities.unshift('Address existing pain and discomfort immediately');
  }

  return priorities.slice(0, 5); // Limit to top 5 priorities
}

/**
 * Calculate risk trend over time
 */
export function calculateRiskTrend(assessments: ErgonomicAssessment[]): {
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number;
  riskProgression: { date: Date; score: number }[];
} {
  if (assessments.length < 2) {
    return {
      trend: 'stable',
      changeRate: 0,
      riskProgression: assessments.map(a => ({ date: a.assessmentDate, score: a.overallScore }))
    };
  }

  // Sort by date
  const sorted = assessments.sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  const totalChange = last.overallScore - first.overallScore;
  const timeSpan = (last.assessmentDate.getTime() - first.assessmentDate.getTime()) / (1000 * 60 * 60 * 24); // days
  const changeRate = timeSpan > 0 ? totalChange / timeSpan : 0; // points per day

  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(totalChange) < 5) {
    trend = 'stable';
  } else if (totalChange < 0) {
    trend = 'improving'; // Lower score is better
  } else {
    trend = 'declining';
  }

  const riskProgression = sorted.map(assessment => ({
    date: assessment.assessmentDate,
    score: assessment.overallScore
  }));

  return { trend, changeRate: Math.abs(changeRate), riskProgression };
}

/**
 * Generate risk level recommendations
 */
export function getRiskLevelRecommendations(riskLevel: string): {
  urgency: string;
  actionItems: string[];
  followUpSchedule: string;
} {
  switch (riskLevel) {
    case 'low':
      return {
        urgency: 'Preventive measures recommended',
        actionItems: [
          'Maintain current good practices',
          'Implement minor optimizations',
          'Monitor for changes over time',
          'Schedule regular check-ins'
        ],
        followUpSchedule: 'Annual assessment or as needed'
      };

    case 'moderate':
      return {
        urgency: 'Improvements recommended within 1-2 weeks',
        actionItems: [
          'Address identified risk factors',
          'Implement workspace modifications',
          'Establish better movement habits',
          'Consider equipment upgrades'
        ],
        followUpSchedule: 'Quarterly assessment recommended'
      };

    case 'high':
      return {
        urgency: 'Immediate attention required within 1 week',
        actionItems: [
          'Prioritize critical risk factors',
          'Implement immediate interventions',
          'Seek professional consultation if needed',
          'Make workspace adjustments immediately',
          'Start symptom monitoring'
        ],
        followUpSchedule: 'Monthly assessment until improved'
      };

    case 'critical':
      return {
        urgency: 'URGENT: Address immediately within 1-2 days',
        actionItems: [
          'Stop activities causing immediate harm',
          'Seek professional medical/ergonomic consultation',
          'Implement emergency interventions',
          'Consider temporary work modifications',
          'Begin immediate symptom treatment'
        ],
        followUpSchedule: 'Weekly assessment until risk reduced'
      };

    default:
      return {
        urgency: 'Assessment needed',
        actionItems: ['Complete ergonomic assessment'],
        followUpSchedule: 'As soon as possible'
      };
  }
}

/**
 * Compare two assessments and highlight changes
 */
export function compareAssessments(
  previousAssessment: ErgonomicAssessment,
  currentAssessment: ErgonomicAssessment
): {
  scoreDifference: number;
  riskLevelChange: string;
  improvedAreas: string[];
  worsenedAreas: string[];
  newSymptoms: string[];
  resolvedSymptoms: string[];
} {
  const scoreDifference = currentAssessment.overallScore - previousAssessment.overallScore;
  const riskLevelChange = `${previousAssessment.riskLevel} → ${currentAssessment.riskLevel}`;

  // Analyze specific areas
  const improvedAreas: string[] = [];
  const worsenedAreas: string[] = [];

  // Compare posture
  if (Math.abs(currentAssessment.postureData.neckAngle) < Math.abs(previousAssessment.postureData.neckAngle)) {
    improvedAreas.push('Neck positioning');
  } else if (Math.abs(currentAssessment.postureData.neckAngle) > Math.abs(previousAssessment.postureData.neckAngle)) {
    worsenedAreas.push('Neck positioning');
  }

  // Compare movement patterns
  if (currentAssessment.movementPatterns.screenBreakFrequency > previousAssessment.movementPatterns.screenBreakFrequency) {
    improvedAreas.push('Break frequency');
  } else if (currentAssessment.movementPatterns.screenBreakFrequency < previousAssessment.movementPatterns.screenBreakFrequency) {
    worsenedAreas.push('Break frequency');
  }

  // Compare symptoms
  const previousSymptomTypes = new Set(previousAssessment.symptoms.map(s => s.type));
  const currentSymptomTypes = new Set(currentAssessment.symptoms.map(s => s.type));

  const newSymptoms = Array.from(currentSymptomTypes).filter(type => !previousSymptomTypes.has(type)) as string[];
  const resolvedSymptoms = Array.from(previousSymptomTypes).filter(type => !currentSymptomTypes.has(type)) as string[];

  return {
    scoreDifference,
    riskLevelChange,
    improvedAreas,
    worsenedAreas,
    newSymptoms,
    resolvedSymptoms
  };
}

/**
 * Generate risk assessment summary
 */
export function generateRiskSummary(analysis: RiskAnalysis): string {
  const { overallRisk, riskScore, factors } = analysis;
  
  const riskDescriptions = {
    low: 'Your current setup shows minimal ergonomic risks.',
    moderate: 'There are some areas of concern that should be addressed.',
    high: 'Several significant risk factors require immediate attention.',
    critical: 'URGENT: Multiple critical risk factors detected requiring immediate action.'
  };

  const topRisks = factors
    .filter(f => f.severity === 'high' || f.severity === 'critical')
    .slice(0, 3)
    .map(f => f.name)
    .join(', ');

  let summary = `Risk Level: ${overallRisk.toUpperCase()} (Score: ${riskScore}/100)\n\n`;
  summary += riskDescriptions[overallRisk] + '\n\n';

  if (topRisks) {
    summary += `Primary concerns: ${topRisks}\n\n`;
  }

  const recommendations = getRiskLevelRecommendations(overallRisk);
  summary += `Recommended action timeframe: ${recommendations.urgency}`;

  return summary;
}