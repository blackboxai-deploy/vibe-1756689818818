// Assessment templates and default values

import type {
  WorkspaceSetup,
  PostureData,
  MovementPatterns,
  AssessmentFormData
} from '@/types/ergonomics';

/**
 * Default workspace setup values
 */
export const defaultWorkspaceSetup: WorkspaceSetup = {
  deskHeight: 74, // cm (29 inches)
  chairHeight: 45, // cm (18 inches)
  monitorDistance: 60, // cm (24 inches)
  monitorHeight: 5, // cm above desk
  keyboardPosition: 'desktop',
  mousePosition: 'desktop',
  footSupport: false,
  lumbarSupport: false,
  armrestSupport: false,
  lightingQuality: 'fair',
  noiseLevel: 'moderate'
};

/**
 * Default posture data values
 */
export const defaultPostureData: PostureData = {
  neckAngle: 15, // degrees forward
  shoulderPosition: 'elevated',
  backCurvature: 'slouched',
  elbowAngle: 90, // degrees
  wristPosition: 'neutral',
  hipAngle: 90, // degrees
  kneeAngle: 90, // degrees
  feetPosition: 'flat-floor'
};

/**
 * Default movement patterns
 */
export const defaultMovementPatterns: MovementPatterns = {
  screenBreakFrequency: 1, // per hour
  stretchingFrequency: 1, // per day
  walkingFrequency: 0.5, // per hour
  postureChanges: 1, // per hour
  repetitiveMotions: {
    typing: 200, // keystrokes per minute
    mouseClicks: 50, // clicks per minute
    reachingMovements: 10 // per hour
  }
};

/**
 * Assessment form field configurations
 */
export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'checkbox' | 'textarea';
  unit?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
}

/**
 * Workspace setup form fields
 */
export const workspaceFormFields: FormField[] = [
  {
    name: 'deskHeight',
    label: 'Desk Height',
    type: 'number',
    unit: 'cm',
    min: 60,
    max: 120,
    step: 1,
    required: true,
    helpText: 'Measure from floor to desk surface'
  },
  {
    name: 'chairHeight',
    label: 'Chair Seat Height',
    type: 'number',
    unit: 'cm',
    min: 30,
    max: 70,
    step: 1,
    required: true,
    helpText: 'Measure from floor to seat surface'
  },
  {
    name: 'monitorDistance',
    label: 'Monitor Distance',
    type: 'number',
    unit: 'cm',
    min: 30,
    max: 100,
    step: 1,
    required: true,
    helpText: 'Distance from eyes to monitor screen'
  },
  {
    name: 'monitorHeight',
    label: 'Monitor Height Above Desk',
    type: 'number',
    unit: 'cm',
    min: -20,
    max: 40,
    step: 1,
    required: true,
    helpText: 'Height of monitor center above desk surface'
  },
  {
    name: 'keyboardPosition',
    label: 'Keyboard Position',
    type: 'select',
    required: true,
    options: [
      { value: 'desktop', label: 'On desktop surface' },
      { value: 'tray', label: 'On keyboard tray' },
      { value: 'adjustable', label: 'Adjustable height' }
    ]
  },
  {
    name: 'mousePosition',
    label: 'Mouse Position',
    type: 'select',
    required: true,
    options: [
      { value: 'desktop', label: 'On desktop surface' },
      { value: 'tray', label: 'On keyboard tray' },
      { value: 'adjustable', label: 'Adjustable height' }
    ]
  },
  {
    name: 'footSupport',
    label: 'Foot Support Available',
    type: 'checkbox',
    helpText: 'Do you have a footrest or can place feet flat on floor?'
  },
  {
    name: 'lumbarSupport',
    label: 'Lumbar Support Available',
    type: 'checkbox',
    helpText: 'Does your chair provide lower back support?'
  },
  {
    name: 'armrestSupport',
    label: 'Armrest Support Available',
    type: 'checkbox',
    helpText: 'Does your chair have adjustable armrests?'
  },
  {
    name: 'lightingQuality',
    label: 'Lighting Quality',
    type: 'select',
    required: true,
    options: [
      { value: 'poor', label: 'Poor - Too dark or too bright' },
      { value: 'fair', label: 'Fair - Sometimes causes strain' },
      { value: 'good', label: 'Good - Generally comfortable' },
      { value: 'excellent', label: 'Excellent - Perfect lighting' }
    ]
  },
  {
    name: 'noiseLevel',
    label: 'Noise Level',
    type: 'select',
    required: true,
    options: [
      { value: 'quiet', label: 'Quiet - Little to no noise' },
      { value: 'moderate', label: 'Moderate - Some background noise' },
      { value: 'loud', label: 'Loud - Distracting noise levels' },
      { value: 'very-loud', label: 'Very Loud - Difficult to concentrate' }
    ]
  }
];

/**
 * Posture form fields
 */
export const postureFormFields: FormField[] = [
  {
    name: 'neckAngle',
    label: 'Neck Angle',
    type: 'number',
    unit: 'degrees',
    min: -30,
    max: 60,
    step: 5,
    required: true,
    helpText: 'Angle of head relative to neutral (0 = looking straight ahead, positive = forward)'
  },
  {
    name: 'shoulderPosition',
    label: 'Shoulder Position',
    type: 'select',
    required: true,
    options: [
      { value: 'relaxed', label: 'Relaxed and level' },
      { value: 'elevated', label: 'Elevated/raised up' },
      { value: 'hunched', label: 'Hunched forward' },
      { value: 'forward', label: 'Rolled forward' }
    ]
  },
  {
    name: 'backCurvature',
    label: 'Back Curvature',
    type: 'select',
    required: true,
    options: [
      { value: 'natural', label: 'Natural S-curve' },
      { value: 'straight', label: 'Straight/flat' },
      { value: 'slouched', label: 'Slouched/rounded' },
      { value: 'arched', label: 'Over-arched' }
    ]
  },
  {
    name: 'elbowAngle',
    label: 'Elbow Angle',
    type: 'number',
    unit: 'degrees',
    min: 60,
    max: 150,
    step: 5,
    required: true,
    helpText: 'Angle of elbow when typing (90 degrees is ideal)'
  },
  {
    name: 'wristPosition',
    label: 'Wrist Position',
    type: 'select',
    required: true,
    options: [
      { value: 'neutral', label: 'Neutral - straight line with forearm' },
      { value: 'extended', label: 'Extended - bent upward' },
      { value: 'flexed', label: 'Flexed - bent downward' },
      { value: 'deviated', label: 'Deviated - bent sideways' }
    ]
  },
  {
    name: 'hipAngle',
    label: 'Hip Angle',
    type: 'number',
    unit: 'degrees',
    min: 70,
    max: 130,
    step: 5,
    required: true,
    helpText: 'Angle between torso and thighs (90-110 degrees is ideal)'
  },
  {
    name: 'kneeAngle',
    label: 'Knee Angle',
    type: 'number',
    unit: 'degrees',
    min: 70,
    max: 130,
    step: 5,
    required: true,
    helpText: 'Angle of knee bend (90-110 degrees is ideal)'
  },
  {
    name: 'feetPosition',
    label: 'Feet Position',
    type: 'select',
    required: true,
    options: [
      { value: 'flat-floor', label: 'Flat on floor' },
      { value: 'footrest', label: 'On footrest' },
      { value: 'dangling', label: 'Dangling/not supported' },
      { value: 'crossed', label: 'Crossed or tucked' }
    ]
  }
];

/**
 * Movement patterns form fields
 */
export const movementFormFields: FormField[] = [
  {
    name: 'screenBreakFrequency',
    label: 'Screen Breaks Per Hour',
    type: 'number',
    min: 0,
    max: 10,
    step: 0.5,
    required: true,
    helpText: 'How often do you look away from screen each hour?'
  },
  {
    name: 'stretchingFrequency',
    label: 'Stretching Sessions Per Day',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    required: true,
    helpText: 'How many times do you stretch during work day?'
  },
  {
    name: 'walkingFrequency',
    label: 'Walking Breaks Per Hour',
    type: 'number',
    min: 0,
    max: 5,
    step: 0.5,
    required: true,
    helpText: 'How often do you get up and walk each hour?'
  },
  {
    name: 'postureChanges',
    label: 'Posture Changes Per Hour',
    type: 'number',
    min: 0,
    max: 10,
    step: 0.5,
    required: true,
    helpText: 'How often do you change sitting position each hour?'
  },
  {
    name: 'typing',
    label: 'Typing Speed',
    type: 'number',
    unit: 'keystrokes/min',
    min: 50,
    max: 600,
    step: 10,
    required: true,
    helpText: 'Average keystrokes per minute during active typing'
  },
  {
    name: 'mouseClicks',
    label: 'Mouse Click Rate',
    type: 'number',
    unit: 'clicks/min',
    min: 10,
    max: 200,
    step: 5,
    required: true,
    helpText: 'Average mouse clicks per minute during active use'
  },
  {
    name: 'reachingMovements',
    label: 'Reaching Movements Per Hour',
    type: 'number',
    min: 0,
    max: 100,
    step: 5,
    required: true,
    helpText: 'Times per hour you reach for items away from neutral position'
  }
];

/**
 * Health symptoms options
 */
export const symptomTypes = [
  { value: 'neck', label: 'Neck' },
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'back', label: 'Back' },
  { value: 'wrist', label: 'Wrist/Hand' },
  { value: 'eye', label: 'Eye/Vision' },
  { value: 'hip', label: 'Hip' },
  { value: 'knee', label: 'Knee' },
  { value: 'foot', label: 'Foot/Ankle' }
];

export const severityOptions = [
  { value: 'none', label: 'No discomfort' },
  { value: 'mild', label: 'Mild discomfort' },
  { value: 'moderate', label: 'Moderate pain' },
  { value: 'severe', label: 'Severe pain' }
];

export const frequencyOptions = [
  { value: 'never', label: 'Never' },
  { value: 'rarely', label: 'Rarely (1-2 times/month)' },
  { value: 'sometimes', label: 'Sometimes (1-2 times/week)' },
  { value: 'often', label: 'Often (daily)' },
  { value: 'always', label: 'Always (constant)' }
];

/**
 * Create empty assessment form data
 */
export function createEmptyAssessmentForm(): AssessmentFormData {
  return {
    userProfile: {},
    workspaceSetup: { ...defaultWorkspaceSetup },
    postureData: { ...defaultPostureData },
    movementPatterns: { ...defaultMovementPatterns },
    symptoms: [],
    notes: ''
  };
}

/**
 * Validate assessment form data
 */
export function validateAssessmentForm(data: AssessmentFormData): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate workspace setup
  if (!data.workspaceSetup.deskHeight || data.workspaceSetup.deskHeight < 60 || data.workspaceSetup.deskHeight > 120) {
    errors.deskHeight = 'Desk height must be between 60-120 cm';
  }

  if (!data.workspaceSetup.chairHeight || data.workspaceSetup.chairHeight < 30 || data.workspaceSetup.chairHeight > 70) {
    errors.chairHeight = 'Chair height must be between 30-70 cm';
  }

  if (!data.workspaceSetup.monitorDistance || data.workspaceSetup.monitorDistance < 30 || data.workspaceSetup.monitorDistance > 100) {
    errors.monitorDistance = 'Monitor distance must be between 30-100 cm';
  }

  // Validate posture data
  if (data.postureData.elbowAngle < 60 || data.postureData.elbowAngle > 150) {
    errors.elbowAngle = 'Elbow angle must be between 60-150 degrees';
  }

  if (data.postureData.hipAngle < 70 || data.postureData.hipAngle > 130) {
    errors.hipAngle = 'Hip angle must be between 70-130 degrees';
  }

  // Validate movement patterns
  if (data.movementPatterns.screenBreakFrequency < 0 || data.movementPatterns.screenBreakFrequency > 10) {
    errors.screenBreakFrequency = 'Screen break frequency must be between 0-10 per hour';
  }

  if (data.movementPatterns.repetitiveMotions.typing < 50 || data.movementPatterns.repetitiveMotions.typing > 600) {
    errors.typing = 'Typing speed must be between 50-600 keystrokes per minute';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Get assessment completion percentage
 */
export function getAssessmentProgress(data: AssessmentFormData): number {
  let completed = 0;
  let total = 0;

  // Workspace setup fields
  workspaceFormFields.forEach(field => {
    total++;
    if (field.required && data.workspaceSetup[field.name as keyof WorkspaceSetup] !== undefined) {
      completed++;
    }
  });

  // Posture fields
  postureFormFields.forEach(field => {
    total++;
    if (field.required && data.postureData[field.name as keyof PostureData] !== undefined) {
      completed++;
    }
  });

  // Movement fields
  movementFormFields.forEach(field => {
    total++;
    if (field.required && (field.name === 'typing' || field.name === 'mouseClicks' || field.name === 'reachingMovements' 
        ? data.movementPatterns.repetitiveMotions[field.name as keyof typeof data.movementPatterns.repetitiveMotions] !== undefined
        : data.movementPatterns[field.name as keyof MovementPatterns] !== undefined)) {
      completed++;
    }
  });

  return Math.round((completed / total) * 100);
}