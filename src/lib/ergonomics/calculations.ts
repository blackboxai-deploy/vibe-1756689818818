// Ergonomic risk calculation algorithms and utility functions

import type {
  RiskCalculationInput,
  RiskFactor,
  RiskLevel,
  WorkspaceSetup,
  PostureData,
  MovementPatterns,
  HealthSymptom,
  UserProfile
} from '@/types/ergonomics';

/**
 * Calculate overall ergonomic risk score (0-100)
 */
export function calculateOverallRiskScore(input: RiskCalculationInput): number {
  const postureScore = calculatePostureRisk(input.posture, input.userProfile);
  const workspaceScore = calculateWorkspaceRisk(input.workspace, input.userProfile);
  const movementScore = calculateMovementRisk(input.movement);
  const symptomsScore = calculateSymptomsRisk(input.symptoms);

  // Weighted average with emphasis on symptoms and posture
  const weightedScore = (
    postureScore * 0.3 +
    workspaceScore * 0.25 +
    movementScore * 0.25 +
    symptomsScore * 0.2
  );

  return Math.min(100, Math.max(0, Math.round(weightedScore)));
}

/**
 * Calculate posture-related risk factors
 */
export function calculatePostureRisk(
  posture: PostureData,
  userProfile: Pick<UserProfile, 'age' | 'workHoursPerDay'>
): number {
  let riskScore = 0;

  // Neck angle risk (optimal: 0-15 degrees)
  if (Math.abs(posture.neckAngle) > 45) riskScore += 25;
  else if (Math.abs(posture.neckAngle) > 30) riskScore += 15;
  else if (Math.abs(posture.neckAngle) > 15) riskScore += 8;

  // Shoulder position risk
  const shoulderRisk = {
    'relaxed': 0,
    'elevated': 15,
    'hunched': 20,
    'forward': 18
  };
  riskScore += shoulderRisk[posture.shoulderPosition];

  // Back curvature risk
  const backRisk = {
    'natural': 0,
    'straight': 10,
    'slouched': 25,
    'arched': 15
  };
  riskScore += backRisk[posture.backCurvature];

  // Elbow angle risk (optimal: 90-110 degrees)
  const elbowDeviation = Math.abs(posture.elbowAngle - 100);
  if (elbowDeviation > 30) riskScore += 15;
  else if (elbowDeviation > 15) riskScore += 8;

  // Wrist position risk
  const wristRisk = {
    'neutral': 0,
    'extended': 12,
    'flexed': 15,
    'deviated': 18
  };
  riskScore += wristRisk[posture.wristPosition];

  // Hip angle risk (optimal: 90-110 degrees)
  const hipDeviation = Math.abs(posture.hipAngle - 100);
  if (hipDeviation > 20) riskScore += 10;
  else if (hipDeviation > 10) riskScore += 5;

  // Feet position risk
  const feetRisk = {
    'flat-floor': 0,
    'footrest': 2,
    'dangling': 15,
    'crossed': 12
  };
  riskScore += feetRisk[posture.feetPosition];

  // Age and work hours multipliers
  const ageMultiplier = userProfile.age > 50 ? 1.2 : userProfile.age > 35 ? 1.1 : 1.0;
  const hoursMultiplier = userProfile.workHoursPerDay > 8 ? 1.3 : 
                         userProfile.workHoursPerDay > 6 ? 1.1 : 1.0;

  return Math.min(100, riskScore * ageMultiplier * hoursMultiplier);
}

/**
 * Calculate workspace setup risk factors
 */
export function calculateWorkspaceRisk(
  workspace: WorkspaceSetup,
  userProfile: Pick<UserProfile, 'height'>
): number {
  let riskScore = 0;

  // Calculate ideal desk height based on user height
  const idealDeskHeight = userProfile.height * 0.45; // Rough approximation
  const deskHeightDeviation = Math.abs(workspace.deskHeight - idealDeskHeight);
  if (deskHeightDeviation > 10) riskScore += 15;
  else if (deskHeightDeviation > 5) riskScore += 8;

  // Monitor distance risk (optimal: 50-70cm)
  if (workspace.monitorDistance < 40 || workspace.monitorDistance > 80) riskScore += 12;
  else if (workspace.monitorDistance < 50 || workspace.monitorDistance > 70) riskScore += 6;

  // Monitor height risk (top should be at or below eye level)
  if (workspace.monitorHeight > 15) riskScore += 10;
  else if (workspace.monitorHeight > 5) riskScore += 5;
  else if (workspace.monitorHeight < -10) riskScore += 8;

  // Input device positioning
  if (workspace.keyboardPosition === 'desktop') riskScore += 8;
  if (workspace.mousePosition === 'desktop') riskScore += 6;

  // Support features
  if (!workspace.footSupport) riskScore += 8;
  if (!workspace.lumbarSupport) riskScore += 15;
  if (!workspace.armrestSupport) riskScore += 10;

  // Environmental factors
  const lightingRisk = {
    'excellent': 0,
    'good': 3,
    'fair': 8,
    'poor': 15
  };
  riskScore += lightingRisk[workspace.lightingQuality];

  const noiseRisk = {
    'quiet': 0,
    'moderate': 3,
    'loud': 8,
    'very-loud': 12
  };
  riskScore += noiseRisk[workspace.noiseLevel];

  return Math.min(100, riskScore);
}

/**
 * Calculate movement pattern risk factors
 */
export function calculateMovementRisk(movement: MovementPatterns): number {
  let riskScore = 0;

  // Screen break frequency (recommended: every 20-30 minutes)
  const recommendedBreaks = 2; // per hour
  if (movement.screenBreakFrequency < 1) riskScore += 20;
  else if (movement.screenBreakFrequency < recommendedBreaks) riskScore += 10;

  // Stretching frequency (recommended: 3-5 times per day)
  if (movement.stretchingFrequency < 2) riskScore += 15;
  else if (movement.stretchingFrequency < 3) riskScore += 8;

  // Walking frequency (recommended: every hour)
  if (movement.walkingFrequency < 0.5) riskScore += 18;
  else if (movement.walkingFrequency < 1) riskScore += 10;

  // Posture changes (recommended: every 30 minutes)
  if (movement.postureChanges < 1) riskScore += 12;
  else if (movement.postureChanges < 2) riskScore += 6;

  // Repetitive motions risk
  const { typing, mouseClicks, reachingMovements } = movement.repetitiveMotions;
  
  // High typing rate risk (>60 WPM sustained)
  if (typing > 300) riskScore += 10; // ~60 WPM
  else if (typing > 400) riskScore += 15; // ~80 WPM
  
  // High mouse usage risk
  if (mouseClicks > 100) riskScore += 8;
  else if (mouseClicks > 150) riskScore += 12;
  
  // Excessive reaching risk
  if (reachingMovements > 20) riskScore += 10;
  else if (reachingMovements > 30) riskScore += 15;

  return Math.min(100, riskScore);
}

/**
 * Calculate symptom-based risk factors
 */
export function calculateSymptomsRisk(symptoms: HealthSymptom[]): number {
  if (symptoms.length === 0) return 0;

  let riskScore = 0;
  let severityMultiplier = 0;
  let frequencyMultiplier = 0;

  symptoms.forEach(symptom => {
    // Base score for having any symptom
    riskScore += 5;

    // Severity multipliers
    const severityScores = {
      'none': 0,
      'mild': 1,
      'moderate': 2,
      'severe': 3
    };
    severityMultiplier += severityScores[symptom.severity];

    // Frequency multipliers
    const frequencyScores = {
      'never': 0,
      'rarely': 0.5,
      'sometimes': 1,
      'often': 2,
      'always': 3
    };
    frequencyMultiplier += frequencyScores[symptom.frequency];

    // Critical area penalties
    if (['neck', 'back', 'wrist'].includes(symptom.type)) {
      riskScore += 5;
    }
  });

  // Apply multipliers
  const averageSeverity = severityMultiplier / symptoms.length;
  const averageFrequency = frequencyMultiplier / symptoms.length;
  
  riskScore *= (1 + averageSeverity * 0.5) * (1 + averageFrequency * 0.3);

  return Math.min(100, Math.round(riskScore));
}

/**
 * Convert risk score to risk level
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'critical';
}

/**
 * Generate detailed risk factors from assessment
 */
export function generateRiskFactors(input: RiskCalculationInput): RiskFactor[] {
  const factors: RiskFactor[] = [];

  // Posture-related factors
  const postureScore = calculatePostureRisk(input.posture, input.userProfile);
  if (postureScore > 25) {
    factors.push({
      category: 'posture',
      name: 'Poor Posture Alignment',
      severity: getRiskLevel(postureScore),
      score: postureScore,
      description: 'Current posture deviates significantly from ergonomic guidelines',
      impact: 'May lead to neck, back, and shoulder strain over time'
    });
  }

  // Workspace-related factors
  const workspaceScore = calculateWorkspaceRisk(input.workspace, input.userProfile);
  if (workspaceScore > 25) {
    factors.push({
      category: 'equipment',
      name: 'Suboptimal Workspace Setup',
      severity: getRiskLevel(workspaceScore),
      score: workspaceScore,
      description: 'Workspace configuration does not support proper ergonomics',
      impact: 'Increases risk of musculoskeletal disorders and eye strain'
    });
  }

  // Movement-related factors
  const movementScore = calculateMovementRisk(input.movement);
  if (movementScore > 25) {
    factors.push({
      category: 'movement',
      name: 'Insufficient Movement Patterns',
      severity: getRiskLevel(movementScore),
      score: movementScore,
      description: 'Limited movement and breaks during work hours',
      impact: 'May cause muscle stiffness, reduced circulation, and fatigue'
    });
  }

  // Time-related factors
  if (input.userProfile.workHoursPerDay > 8) {
    factors.push({
      category: 'time',
      name: 'Extended Work Hours',
      severity: input.userProfile.workHoursPerDay > 10 ? 'high' : 'moderate',
      score: Math.min(100, (input.userProfile.workHoursPerDay - 8) * 15),
      description: `Working ${input.userProfile.workHoursPerDay} hours per day exceeds recommendations`,
      impact: 'Prolonged exposure increases all ergonomic risks'
    });
  }

  // Symptom-based factors
  const symptomsScore = calculateSymptomsRisk(input.symptoms);
  if (symptomsScore > 0) {
    factors.push({
      category: 'posture',
      name: 'Existing Discomfort/Pain',
      severity: getRiskLevel(symptomsScore),
      score: symptomsScore,
      description: 'Reported symptoms indicate current ergonomic issues',
      impact: 'Existing symptoms may worsen without intervention'
    });
  }

  return factors.sort((a, b) => b.score - a.score);
}

/**
 * Calculate improvement score between two assessments
 */
export function calculateImprovement(
  previousScore: number,
  currentScore: number
): { percentage: number; trend: 'improving' | 'declining' | 'stable' } {
  const difference = currentScore - previousScore;
  const percentage = previousScore > 0 ? Math.round((difference / previousScore) * 100) : 0;
  
  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(percentage) < 5) {
    trend = 'stable';
  } else if (percentage < 0) {
    trend = 'improving'; // Lower risk score is better
  } else {
    trend = 'declining';
  }

  return { percentage: Math.abs(percentage), trend };
}