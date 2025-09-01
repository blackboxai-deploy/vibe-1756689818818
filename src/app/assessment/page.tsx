'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { AssessmentFormData, HealthSymptom } from '@/types/ergonomics';
import { 
  defaultWorkspaceSetup, 
  defaultPostureData, 
  defaultMovementPatterns,
  workspaceFormFields,
  postureFormFields,
  movementFormFields,
  symptomTypes,
  severityOptions,
  frequencyOptions,
  validateAssessmentForm,
  getAssessmentProgress
} from '@/lib/data/assessment-templates';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    userProfile: {},
    workspaceSetup: { ...defaultWorkspaceSetup },
    postureData: { ...defaultPostureData },
    movementPatterns: { ...defaultMovementPatterns },
    symptoms: [],
    notes: ''
  });

  const steps = [
    { title: 'Personal Info', description: 'Basic information and work details' },
    { title: 'Workspace Setup', description: 'Desk, chair, and equipment measurements' },
    { title: 'Posture Analysis', description: 'Body positioning and alignment' },
    { title: 'Movement Patterns', description: 'Breaks, activity, and repetitive motions' },
    { title: 'Health Symptoms', description: 'Any discomfort or pain experienced' },
    { title: 'Review & Submit', description: 'Confirm your information and submit' }
  ];



  const handleInputChange = (section: keyof AssessmentFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRepetitiveMotionChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      movementPatterns: {
        ...prev.movementPatterns,
        repetitiveMotions: {
          ...prev.movementPatterns.repetitiveMotions,
          [field]: value
        }
      }
    }));
  };

  const handleSymptomChange = (index: number, field: keyof HealthSymptom, value: any) => {
    setFormData(prev => {
      const updatedSymptoms = [...prev.symptoms];
      if (index >= updatedSymptoms.length) {
        updatedSymptoms[index] = {
          id: `symptom_${Date.now()}_${index}`,
          type: 'neck',
          severity: 'none',
          frequency: 'never',
          description: ''
        } as HealthSymptom;
      }
      updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };
      return { ...prev, symptoms: updatedSymptoms };
    });
  };

  const addSymptom = () => {
    const newSymptom: HealthSymptom = {
      id: `symptom_${Date.now()}`,
      type: 'neck',
      severity: 'mild',
      frequency: 'sometimes',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom]
    }));
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate form
      const validation = validateAssessmentForm(formData);
      if (!validation.isValid) {
        setError('Please correct the form errors: ' + Object.values(validation.errors).join(', '));
        setLoading(false);
        return;
      }

      // Submit assessment
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const result = await response.json();
      
      if (result.success) {
        // Redirect to results page
        router.push(`/dashboard?assessment=${result.data.id}&new=true`);
      } else {
        throw new Error(result.error || 'Assessment submission failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.userProfile.name || ''}
                  onChange={(e) => handleInputChange('userProfile', 'name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.userProfile.email || ''}
                  onChange={(e) => handleInputChange('userProfile', 'email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.userProfile.age || ''}
                  onChange={(e) => handleInputChange('userProfile', 'age', parseInt(e.target.value))}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="140"
                  max="220"
                  value={formData.userProfile.height || ''}
                  onChange={(e) => handleInputChange('userProfile', 'height', parseInt(e.target.value))}
                  placeholder="170"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="40"
                  max="200"
                  value={formData.userProfile.weight || ''}
                  onChange={(e) => handleInputChange('userProfile', 'weight', parseInt(e.target.value))}
                  placeholder="70"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.userProfile.occupation || ''}
                  onChange={(e) => handleInputChange('userProfile', 'occupation', e.target.value)}
                  placeholder="Software Developer"
                />
              </div>
              <div>
                <Label htmlFor="workHours">Work Hours Per Day</Label>
                <Input
                  id="workHours"
                  type="number"
                  min="1"
                  max="16"
                  value={formData.userProfile.workHoursPerDay || ''}
                  onChange={(e) => handleInputChange('userProfile', 'workHoursPerDay', parseInt(e.target.value))}
                  placeholder="8"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Workspace Setup</h3>
            <p className="text-gray-600">Measure your current workspace configuration</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {workspaceFormFields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>
                    {field.label} {field.unit && <span className="text-gray-500">({field.unit})</span>}
                  </Label>
                  
                  {field.type === 'number' && (
                    <Input
                      id={field.name}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData.workspaceSetup[field.name as keyof typeof formData.workspaceSetup] || ''}
                      onChange={(e) => handleInputChange('workspaceSetup', field.name, parseFloat(e.target.value))}
                      placeholder={field.min?.toString()}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <Select
                      value={formData.workspaceSetup[field.name as keyof typeof formData.workspaceSetup]?.toString()}
                      onValueChange={(value) => handleInputChange('workspaceSetup', field.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id={field.name}
                        checked={Boolean(formData.workspaceSetup[field.name as keyof typeof formData.workspaceSetup])}
                        onCheckedChange={(checked) => handleInputChange('workspaceSetup', field.name, checked)}
                      />
                      <Label htmlFor={field.name} className="text-sm">
                        {field.helpText}
                      </Label>
                    </div>
                  )}
                  
                  {field.helpText && field.type !== 'checkbox' && (
                    <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Posture Analysis</h3>
            <p className="text-gray-600">Analyze your current sitting posture</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {postureFormFields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>
                    {field.label} {field.unit && <span className="text-gray-500">({field.unit})</span>}
                  </Label>
                  
                  {field.type === 'number' && (
                    <Input
                      id={field.name}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData.postureData[field.name as keyof typeof formData.postureData] || ''}
                      onChange={(e) => handleInputChange('postureData', field.name, parseFloat(e.target.value))}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <Select
                      value={formData.postureData[field.name as keyof typeof formData.postureData]?.toString()}
                      onValueChange={(value) => handleInputChange('postureData', field.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.helpText && (
                    <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Movement Patterns</h3>
            <p className="text-gray-600">Track your daily movement and break habits</p>
            
            <div className="space-y-6">
              {/* Break and movement patterns */}
              <div className="grid md:grid-cols-2 gap-6">
                {movementFormFields.slice(0, 4).map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>
                      {field.label} {field.unit && <span className="text-gray-500">({field.unit})</span>}
                    </Label>
                    <Input
                      id={field.name}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData.movementPatterns[field.name as keyof typeof formData.movementPatterns] || ''}
                      onChange={(e) => handleInputChange('movementPatterns', field.name, parseFloat(e.target.value))}
                    />
                    {field.helpText && (
                      <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Repetitive motions */}
              <div>
                <h4 className="font-medium mb-4">Repetitive Motions</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="typing">Typing Speed (keystrokes/min)</Label>
                    <Input
                      id="typing"
                      type="number"
                      min="50"
                      max="600"
                      step="10"
                      value={formData.movementPatterns.repetitiveMotions.typing || ''}
                      onChange={(e) => handleRepetitiveMotionChange('typing', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mouseClicks">Mouse Clicks (clicks/min)</Label>
                    <Input
                      id="mouseClicks"
                      type="number"
                      min="10"
                      max="200"
                      step="5"
                      value={formData.movementPatterns.repetitiveMotions.mouseClicks || ''}
                      onChange={(e) => handleRepetitiveMotionChange('mouseClicks', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reachingMovements">Reaching Movements (/hour)</Label>
                    <Input
                      id="reachingMovements"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.movementPatterns.repetitiveMotions.reachingMovements || ''}
                      onChange={(e) => handleRepetitiveMotionChange('reachingMovements', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Health Symptoms</h3>
            <p className="text-gray-600">Report any discomfort or pain you experience</p>
            
            <div className="space-y-4">
              {formData.symptoms.map((symptom, index) => (
                <Card key={index} className="p-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label>Body Area</Label>
                      <Select
                        value={symptom.type}
                        onValueChange={(value) => handleSymptomChange(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {symptomTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Severity</Label>
                      <Select
                        value={symptom.severity}
                        onValueChange={(value) => handleSymptomChange(index, 'severity', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {severityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Frequency</Label>
                      <Select
                        value={symptom.frequency}
                        onValueChange={(value) => handleSymptomChange(index, 'frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSymptom(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={symptom.description}
                      onChange={(e) => handleSymptomChange(index, 'description', e.target.value)}
                      placeholder="Describe the discomfort or when it occurs..."
                      className="mt-1"
                    />
                  </div>
                </Card>
              ))}
              
              <Button type="button" variant="outline" onClick={addSymptom} className="w-full">
                Add Symptom
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review & Submit</h3>
            <p className="text-gray-600">Review your assessment information before submitting</p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Personal Info:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>Name: {formData.userProfile.name || 'Not provided'}</li>
                        <li>Age: {formData.userProfile.age || 'Not provided'}</li>
                        <li>Occupation: {formData.userProfile.occupation || 'Not provided'}</li>
                        <li>Work Hours: {formData.userProfile.workHoursPerDay || 'Not provided'}/day</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Workspace:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>Desk Height: {formData.workspaceSetup.deskHeight}cm</li>
                        <li>Chair Height: {formData.workspaceSetup.chairHeight}cm</li>
                        <li>Monitor Distance: {formData.workspaceSetup.monitorDistance}cm</li>
                        <li>Lumbar Support: {formData.workspaceSetup.lumbarSupport ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <strong>Reported Symptoms:</strong>
                    {formData.symptoms.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-gray-600">
                        {formData.symptoms.map((symptom, index) => (
                          <li key={index}>
                            {symptom.type}: {symptom.severity} ({symptom.frequency})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 mt-1">No symptoms reported</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information about your workspace or health concerns..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">ErgonoAI</span>
            </div>
            <Badge variant="secondary">Assessment in Progress</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Ergonomic Assessment</h1>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{steps[currentStep].title}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
            <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}