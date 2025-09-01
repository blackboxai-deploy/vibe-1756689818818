'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardData {
  user: {
    id: string;
    name: string;
    latestAssessment?: {
      date: string;
      riskLevel: string;
      score: number;
    };
  };
  metrics: {
    totalAssessments: number;
    currentRiskScore: number;
    riskLevel: string;
    improvement: number;
    lastAssessmentDate?: string;
  };
  recentActivity: Array<{
    id: string;
    type: 'assessment' | 'recommendation' | 'metric';
    title: string;
    date: string;
    status?: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    priority: string;
    category: string;
    estimatedCost: string;
  }>;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Demo data for initial display
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        user: {
          id: 'demo_user',
          name: 'Demo User',
          latestAssessment: {
            date: new Date().toISOString(),
            riskLevel: 'moderate',
            score: 45
          }
        },
        metrics: {
          totalAssessments: 3,
          currentRiskScore: 45,
          riskLevel: 'moderate',
          improvement: 15,
          lastAssessmentDate: new Date().toISOString()
        },
        recentActivity: [
          {
            id: '1',
            type: 'assessment',
            title: 'Completed workspace assessment',
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            type: 'recommendation',
            title: 'AI recommendations generated',
            date: new Date(Date.now() - 3600000).toISOString(),
            status: 'active'
          },
          {
            id: '3',
            type: 'metric',
            title: 'Recorded comfort level',
            date: new Date(Date.now() - 7200000).toISOString(),
            status: 'logged'
          }
        ],
        recommendations: [
          {
            id: 'rec_1',
            title: 'Adjust monitor height',
            priority: 'high',
            category: 'immediate',
            estimatedCost: 'free'
          },
          {
            id: 'rec_2',
            title: 'Add lumbar support',
            priority: 'medium',
            category: 'short-term',
            estimatedCost: 'low'
          },
          {
            id: 'rec_3',
            title: 'Increase break frequency',
            priority: 'high',
            category: 'immediate',
            estimatedCost: 'free'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to ErgonoAI</h2>
          <p className="text-gray-600 mb-6">Get started with your first ergonomic assessment</p>
          <Link href="/assessment">
            <Button className="bg-gradient-to-r from-blue-600 to-green-600">
              Start Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">ErgonoAI</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/assessment" className="text-gray-600 hover:text-gray-900">Assessment</Link>
              <Link href="/recommendations" className="text-gray-600 hover:text-gray-900">Recommendations</Link>
              <Link href="/equipment" className="text-gray-600 hover:text-gray-900">Equipment</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {dashboardData.user.name}!
          </h1>
          <p className="text-gray-600">
            Here's your ergonomic health overview and recommendations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={getRiskLevelColor(dashboardData.metrics.riskLevel)}>
                  {dashboardData.metrics.riskLevel.toUpperCase()}
                </Badge>
                <span className="text-2xl font-bold">{dashboardData.metrics.currentRiskScore}/100</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {dashboardData.metrics.improvement > 0 ? '+' : ''}{dashboardData.metrics.improvement}%
                </span>
                <span className="text-sm text-gray-500">vs baseline</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.metrics.totalAssessments}</div>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.recommendations.length}</div>
              <p className="text-sm text-gray-500">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Risk Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Overview</CardTitle>
                  <CardDescription>
                    Your current ergonomic risk profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Risk Score</span>
                    <span className="text-sm text-gray-500">{dashboardData.metrics.currentRiskScore}/100</span>
                  </div>
                  <Progress 
                    value={dashboardData.metrics.currentRiskScore} 
                    className="w-full"
                  />
                  
                  <div className="pt-4">
                    <Badge className={getRiskLevelColor(dashboardData.metrics.riskLevel)}>
                      {dashboardData.metrics.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="pt-4">
                    <Link href="/assessment">
                      <Button variant="outline" className="w-full">
                        Take New Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/assessment">
                    <Button className="w-full justify-start" variant="outline">
                      Start New Assessment
                    </Button>
                  </Link>
                  <Link href="/recommendations">
                    <Button className="w-full justify-start" variant="outline">
                      View All Recommendations
                    </Button>
                  </Link>
                  <Link href="/equipment">
                    <Button className="w-full justify-start" variant="outline">
                      Browse Equipment
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Recommendations</CardTitle>
                    <CardDescription>
                      Personalized action items for your workspace
                    </CardDescription>
                  </div>
                  <Link href="/recommendations">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {rec.category}</span>
                        <span>Cost: {rec.estimatedCost}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Mark Complete
                    </Button>
                  </div>
                ))}
                
                {dashboardData.recommendations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No active recommendations.</p>
                    <Link href="/assessment">
                      <Button className="mt-4">
                        Take Assessment to Get Recommendations
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest ergonomic health activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'assessment' ? 'bg-blue-500' :
                      activity.type === 'recommendation' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                      </p>
                    </div>
                    {activity.status && (
                      <Badge variant="outline">{activity.status}</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Your ergonomic health journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Improvement</span>
                      <span className="font-medium">{dashboardData.metrics.improvement}%</span>
                    </div>
                    <Progress value={dashboardData.metrics.improvement} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Reduction</span>
                      <span className="font-medium">
                        {100 - dashboardData.metrics.currentRiskScore}/100
                      </span>
                    </div>
                    <Progress value={100 - dashboardData.metrics.currentRiskScore} className="w-full" />
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      View Detailed Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>
                    Track your comfort and wellbeing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">7.2/10</div>
                      <p className="text-sm text-gray-500">Average Comfort Score</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-semibold">2.1/10</div>
                        <p className="text-xs text-gray-500">Pain Level</p>
                      </div>
                      <div>
                        <div className="text-xl font-semibold">8.5/10</div>
                        <p className="text-xs text-gray-500">Energy Level</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Log Health Metric
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        {dashboardData.metrics.riskLevel !== 'low' && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 text-orange-600 font-bold">!</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Action Recommended
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Your current risk level is {dashboardData.metrics.riskLevel}. 
                    Take action now to prevent potential health issues.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/recommendations">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        View Recommendations
                      </Button>
                    </Link>
                    <Link href="/equipment">
                      <Button variant="outline" className="border-orange-300 text-orange-700">
                        Find Equipment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}