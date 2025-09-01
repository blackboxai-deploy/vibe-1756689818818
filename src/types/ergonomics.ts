// Core ergonomics domain types and interfaces

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  occupation: string;
  workHoursPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceSetup {
  deskHeight: number; // cm
  chairHeight: number; // cm
  monitorDistance: number; // cm
  monitorHeight: number; // cm from desk
  keyboardPosition: 'desktop' | 'tray' | 'adjustable';
  mousePosition: 'desktop' | 'tray' | 'adjustable';
  footSupport: boolean;
  lumbarSupport: boolean;
  armrestSupport: boolean;
  lightingQuality: 'poor' | 'fair' | 'good' | 'excellent';
  noiseLevel: 'quiet' | 'moderate' | 'loud' | 'very-loud';
}

export interface PostureData {
  neckAngle: number; // degrees from neutral
  shoulderPosition: 'relaxed' | 'elevated' | 'hunched' | 'forward';
  backCurvature: 'natural' | 'straight' | 'slouched' | 'arched';
  elbowAngle: number; // degrees
  wristPosition: 'neutral' | 'extended' | 'flexed' | 'deviated';
  hipAngle: number; // degrees
  kneeAngle: number; // degrees
  feetPosition: 'flat-floor' | 'footrest' | 'dangling' | 'crossed';
}

export interface MovementPatterns {
  screenBreakFrequency: number; // per hour
  stretchingFrequency: number; // per day
  walkingFrequency: number; // per hour
  postureChanges: number; // per hour
  repetitiveMotions: {
    typing: number; // keystrokes per minute
    mouseClicks: number; // clicks per minute
    reachingMovements: number; // per hour
  };
}

export interface ErgonomicAssessment {
  id: string;
  userId: string;
  assessmentDate: Date;
  workspaceSetup: WorkspaceSetup;
  postureData: PostureData;
  movementPatterns: MovementPatterns;
  symptoms: HealthSymptom[];
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  assessmentType: 'initial' | 'follow-up' | 'annual';
  notes?: string;
}

export interface HealthSymptom {
  id: string;
  type: 'neck' | 'shoulder' | 'back' | 'wrist' | 'eye' | 'hip' | 'knee' | 'foot';
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  description: string;
  onsetDate?: Date;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskFactor {
  category: 'posture' | 'movement' | 'environment' | 'equipment' | 'time';
  name: string;
  severity: RiskLevel;
  score: number; // 0-100
  description: string;
  impact: string;
}

export interface RiskAnalysis {
  assessmentId: string;
  overallRisk: RiskLevel;
  riskScore: number; // 0-100
  factors: RiskFactor[];
  priorityAreas: string[];
  analysisDate: Date;
}

export interface Recommendation {
  id: string;
  category: 'immediate' | 'short-term' | 'long-term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'posture' | 'equipment' | 'movement' | 'environment' | 'behavior';
  title: string;
  description: string;
  actionSteps: string[];
  expectedBenefit: string;
  timeframe: string;
  estimatedCost: 'free' | 'low' | 'medium' | 'high';
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

export interface RecommendationSet {
  assessmentId: string;
  userId: string;
  recommendations: Recommendation[];
  generatedDate: Date;
  aiGenerated: boolean;
  customNotes?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'chair' | 'desk' | 'monitor' | 'keyboard' | 'mouse' | 'accessories';
  description: string;
  features: string[];
  ergonomicBenefits: string[];
  priceRange: 'budget' | 'mid-range' | 'premium' | 'luxury';
  rating: number; // 0-5
  imageUrl: string;
  specifications: Record<string, string>;
  suitableFor: string[]; // user types or conditions
}

export interface HealthMetric {
  id: string;
  userId: string;
  metricType: 'pain-level' | 'comfort-score' | 'productivity' | 'energy-level' | 'sleep-quality';
  value: number; // 0-10
  recordedDate: Date;
  notes?: string;
  assessmentId?: string; // linked to specific assessment
}

export interface ProgressTracking {
  userId: string;
  startDate: Date;
  currentDate: Date;
  initialScore: number;
  currentScore: number;
  improvement: number; // percentage
  metrics: HealthMetric[];
  completedRecommendations: string[]; // recommendation IDs
  milestones: {
    date: Date;
    achievement: string;
    score: number;
  }[];
}

export interface AssessmentReport {
  id: string;
  assessmentId: string;
  userId: string;
  reportType: 'summary' | 'detailed' | 'comparison' | 'progress';
  generatedDate: Date;
  sections: {
    executive_summary: string;
    risk_analysis: RiskAnalysis;
    recommendations: RecommendationSet;
    progress_data?: ProgressTracking;
    equipment_suggestions?: EquipmentItem[];
  };
  format: 'pdf' | 'html' | 'json';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Input Types
export interface AssessmentFormData {
  userProfile: Partial<UserProfile>;
  workspaceSetup: WorkspaceSetup;
  postureData: PostureData;
  movementPatterns: MovementPatterns;
  symptoms: HealthSymptom[];
  notes?: string;
}

export interface RiskCalculationInput {
  workspace: WorkspaceSetup;
  posture: PostureData;
  movement: MovementPatterns;
  symptoms: HealthSymptom[];
  userProfile: Pick<UserProfile, 'age' | 'height' | 'weight' | 'workHoursPerDay'>;
}

// Constants and Enums
export const RISK_THRESHOLDS = {
  LOW: 25,
  MODERATE: 50,
  HIGH: 75,
  CRITICAL: 100
} as const;

export const ASSESSMENT_CATEGORIES = [
  'posture',
  'movement',
  'environment',
  'equipment',
  'symptoms'
] as const;

export const EQUIPMENT_CATEGORIES = [
  'chair',
  'desk',
  'monitor',
  'keyboard',
  'mouse',
  'accessories'
] as const;

export type AssessmentCategory = typeof ASSESSMENT_CATEGORIES[number];
export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];