// AI-powered recommendations generation and management

import type {
  RiskAnalysis,
  Recommendation,
  RecommendationSet,
  ErgonomicAssessment,
  UserProfile
} from '@/types/ergonomics';

/**
 * Generate AI-powered ergonomic recommendations
 */
export async function generateAIRecommendations(
  assessment: ErgonomicAssessment,
  riskAnalysis: RiskAnalysis,
  userProfile: UserProfile
): Promise<RecommendationSet> {
  try {
    const prompt = buildRecommendationPrompt(assessment, riskAnalysis, userProfile);
    
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'gabrielfrancelino04@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert ergonomist and occupational health specialist. Generate personalized ergonomic recommendations based on workplace assessments. Your recommendations should be:
            
            1. Specific and actionable
            2. Prioritized by urgency and impact
            3. Cost-effective when possible
            4. Evidence-based
            5. Tailored to the individual's specific situation
            
            Return ONLY a valid JSON object with the following structure:
            {
              "recommendations": [
                {
                  "category": "immediate|short-term|long-term",
                  "priority": "low|medium|high|critical",
                  "type": "posture|equipment|movement|environment|behavior",
                  "title": "Brief descriptive title",
                  "description": "Detailed explanation of the recommendation",
                  "actionSteps": ["Step 1", "Step 2", "Step 3"],
                  "expectedBenefit": "What improvement to expect",
                  "timeframe": "How long to implement",
                  "estimatedCost": "free|low|medium|high",
                  "implementationDifficulty": "easy|medium|hard"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No content in AI response');
    }

    const parsedRecommendations = JSON.parse(aiResponse);
    
    // Add IDs and validation
    const recommendations: Recommendation[] = parsedRecommendations.recommendations.map((rec: any, index: number) => ({
      id: `rec_${Date.now()}_${index}`,
      ...rec
    }));

    return {
      assessmentId: assessment.id,
      userId: userProfile.id,
      recommendations,
      generatedDate: new Date(),
      aiGenerated: true
    };

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    // Fallback to template-based recommendations
    return generateTemplateRecommendations(assessment, riskAnalysis, userProfile);
  }
}

/**
 * Build detailed prompt for AI recommendations
 */
function buildRecommendationPrompt(
  assessment: ErgonomicAssessment,
  riskAnalysis: RiskAnalysis,
  userProfile: UserProfile
): string {
  const riskFactorsSummary = riskAnalysis.factors
    .map(f => `- ${f.name} (${f.severity}): ${f.description}`)
    .join('\n');

  const symptomsSummary = assessment.symptoms
    .filter(s => s.severity !== 'none')
    .map(s => `- ${s.type}: ${s.severity} severity, ${s.frequency} frequency`)
    .join('\n');

  return `
ERGONOMIC ASSESSMENT ANALYSIS

USER PROFILE:
- Age: ${userProfile.age}, Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Occupation: ${userProfile.occupation}
- Work Hours: ${userProfile.workHoursPerDay} hours/day

CURRENT RISK ASSESSMENT:
- Overall Risk Level: ${riskAnalysis.overallRisk}
- Risk Score: ${riskAnalysis.riskScore}/100

IDENTIFIED RISK FACTORS:
${riskFactorsSummary}

WORKSPACE SETUP:
- Desk Height: ${assessment.workspaceSetup.deskHeight}cm
- Chair Height: ${assessment.workspaceSetup.chairHeight}cm
- Monitor Distance: ${assessment.workspaceSetup.monitorDistance}cm
- Monitor Height: ${assessment.workspaceSetup.monitorHeight}cm above desk
- Keyboard: ${assessment.workspaceSetup.keyboardPosition}
- Mouse: ${assessment.workspaceSetup.mousePosition}
- Lumbar Support: ${assessment.workspaceSetup.lumbarSupport ? 'Yes' : 'No'}
- Armrest Support: ${assessment.workspaceSetup.armrestSupport ? 'Yes' : 'No'}
- Foot Support: ${assessment.workspaceSetup.footSupport ? 'Yes' : 'No'}
- Lighting: ${assessment.workspaceSetup.lightingQuality}
- Noise Level: ${assessment.workspaceSetup.noiseLevel}

CURRENT POSTURE:
- Neck Angle: ${assessment.postureData.neckAngle}° from neutral
- Shoulder Position: ${assessment.postureData.shoulderPosition}
- Back Curvature: ${assessment.postureData.backCurvature}
- Elbow Angle: ${assessment.postureData.elbowAngle}°
- Wrist Position: ${assessment.postureData.wristPosition}
- Hip Angle: ${assessment.postureData.hipAngle}°
- Feet Position: ${assessment.postureData.feetPosition}

MOVEMENT PATTERNS:
- Screen Breaks: ${assessment.movementPatterns.screenBreakFrequency} per hour
- Stretching: ${assessment.movementPatterns.stretchingFrequency} times per day
- Walking: ${assessment.movementPatterns.walkingFrequency} times per hour
- Posture Changes: ${assessment.movementPatterns.postureChanges} per hour

REPORTED SYMPTOMS:
${symptomsSummary || 'No significant symptoms reported'}

PRIORITY AREAS:
${riskAnalysis.priorityAreas.join('\n- ')}

Please generate 8-12 specific, actionable recommendations addressing the highest-risk areas first. Focus on:
1. Immediate safety concerns (if any)
2. High-impact, low-cost solutions
3. Equipment adjustments and upgrades
4. Behavioral and movement improvements
5. Long-term preventive measures

Ensure recommendations are practical for a ${userProfile.occupation} who works ${userProfile.workHoursPerDay} hours per day.
`;
}

/**
 * Generate template-based recommendations as fallback
 */
function generateTemplateRecommendations(
  assessment: ErgonomicAssessment,
  riskAnalysis: RiskAnalysis,
  userProfile: UserProfile
): RecommendationSet {
  const recommendations: Recommendation[] = [];
  let id = 0;

  // High-priority risk factors
  const criticalFactors = riskAnalysis.factors.filter(f => f.severity === 'critical' || f.severity === 'high');

  criticalFactors.forEach(factor => {
    if (factor.category === 'posture') {
      recommendations.push({
        id: `rec_${Date.now()}_${id++}`,
        category: 'immediate',
        priority: 'high',
        type: 'posture',
        title: 'Improve Posture Alignment',
        description: 'Your current posture shows significant deviations that require immediate correction.',
        actionSteps: [
          'Adjust monitor height so top of screen is at or below eye level',
          'Position feet flat on floor or footrest',
          'Keep shoulders relaxed and elbows at 90-110 degrees',
          'Maintain neutral spine with lumbar support'
        ],
        expectedBenefit: 'Reduced neck, shoulder, and back strain within 1-2 weeks',
        timeframe: 'Implement immediately, habit formation in 2-3 weeks',
        estimatedCost: 'free',
        implementationDifficulty: 'easy'
      });
    }

    if (factor.category === 'movement') {
      recommendations.push({
        id: `rec_${Date.now()}_${id++}`,
        category: 'immediate',
        priority: 'high',
        type: 'movement',
        title: 'Increase Movement and Breaks',
        description: 'Your current movement patterns are insufficient for long work periods.',
        actionSteps: [
          'Take a 1-2 minute break every 20-30 minutes',
          'Stand and walk for 5 minutes every hour',
          'Perform neck and shoulder stretches 3-5 times per day',
          'Change sitting position every 15-20 minutes'
        ],
        expectedBenefit: 'Improved circulation, reduced stiffness, increased energy',
        timeframe: 'Start immediately, establish routine in 1 week',
        estimatedCost: 'free',
        implementationDifficulty: 'easy'
      });
    }

    if (factor.category === 'equipment') {
      recommendations.push({
        id: `rec_${Date.now()}_${id++}`,
        category: 'short-term',
        priority: 'high',
        type: 'equipment',
        title: 'Workspace Equipment Optimization',
        description: 'Current equipment setup contributes to ergonomic risks.',
        actionSteps: [
          'Adjust chair height for proper elbow angle',
          'Position keyboard and mouse at same level',
          'Use document holder to avoid neck strain',
          'Consider ergonomic accessories if needed'
        ],
        expectedBenefit: 'Better support and positioning, reduced strain',
        timeframe: '1-2 weeks for adjustments, 2-4 weeks for new equipment',
        estimatedCost: 'low',
        implementationDifficulty: 'medium'
      });
    }
  });

  // Standard recommendations based on common issues
  if (assessment.movementPatterns.screenBreakFrequency < 2) {
    recommendations.push({
      id: `rec_${Date.now()}_${id++}`,
      category: 'immediate',
      priority: 'medium',
      type: 'behavior',
      title: 'Implement 20-20-20 Rule',
      description: 'Reduce eye strain and encourage regular movement breaks.',
      actionSteps: [
        'Every 20 minutes, look at something 20 feet away for 20 seconds',
        'Set up hourly reminders for movement breaks',
        'Use apps or timers to maintain consistency',
        'Blink consciously to prevent dry eyes'
      ],
      expectedBenefit: 'Reduced eye strain and fatigue, better focus',
      timeframe: 'Start immediately, habit in 1-2 weeks',
      estimatedCost: 'free',
      implementationDifficulty: 'easy'
    });
  }

  if (!assessment.workspaceSetup.lumbarSupport) {
    recommendations.push({
      id: `rec_${Date.now()}_${id++}`,
      category: 'short-term',
      priority: 'medium',
      type: 'equipment',
      title: 'Add Lumbar Support',
      description: 'Proper back support is essential for spinal health.',
      actionSteps: [
        'Adjust existing chair lumbar support if available',
        'Use a lumbar cushion or rolled towel as temporary solution',
        'Consider upgrading to ergonomic chair with proper lumbar support',
        'Position support at natural curve of lower back'
      ],
      expectedBenefit: 'Reduced lower back pain and improved posture',
      timeframe: '1-3 weeks',
      estimatedCost: 'low',
      implementationDifficulty: 'easy'
    });
  }

  // Add environment-based recommendations
  if (assessment.workspaceSetup.lightingQuality === 'poor' || assessment.workspaceSetup.lightingQuality === 'fair') {
    recommendations.push({
      id: `rec_${Date.now()}_${id++}`,
      category: 'short-term',
      priority: 'medium',
      type: 'environment',
      title: 'Improve Lighting Conditions',
      description: 'Poor lighting contributes to eye strain and posture problems.',
      actionSteps: [
        'Position monitor perpendicular to windows to avoid glare',
        'Use adjustable task lighting for document work',
        'Adjust screen brightness to match surrounding lighting',
        'Consider anti-glare screen filter if needed'
      ],
      expectedBenefit: 'Reduced eye strain, less squinting and leaning',
      timeframe: '1-2 weeks',
      estimatedCost: 'low',
      implementationDifficulty: 'easy'
    });
  }

  return {
    assessmentId: assessment.id,
    userId: userProfile.id,
    recommendations: recommendations.slice(0, 8), // Limit to top 8
    generatedDate: new Date(),
    aiGenerated: false
  };
}

/**
 * Filter recommendations by criteria
 */
export function filterRecommendations(
  recommendations: Recommendation[],
  filters: {
    category?: string;
    priority?: string;
    type?: string;
    cost?: string;
    difficulty?: string;
  }
): Recommendation[] {
  return recommendations.filter(rec => {
    if (filters.category && rec.category !== filters.category) return false;
    if (filters.priority && rec.priority !== filters.priority) return false;
    if (filters.type && rec.type !== filters.type) return false;
    if (filters.cost && rec.estimatedCost !== filters.cost) return false;
    if (filters.difficulty && rec.implementationDifficulty !== filters.difficulty) return false;
    return true;
  });
}

/**
 * Sort recommendations by priority and impact
 */
export function sortRecommendationsByPriority(recommendations: Recommendation[]): Recommendation[] {
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  const categoryOrder = { immediate: 3, 'short-term': 2, 'long-term': 1 };

  return recommendations.sort((a, b) => {
    // First by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by category (immediate first)
    const categoryDiff = categoryOrder[b.category] - categoryOrder[a.category];
    if (categoryDiff !== 0) return categoryDiff;

    // Finally by cost (free first)
    const costOrder = { free: 4, low: 3, medium: 2, high: 1 };
    return costOrder[b.estimatedCost] - costOrder[a.estimatedCost];
  });
}