'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      title: 'AI-Powered Assessment',
      description: 'Advanced ergonomic evaluation using machine learning to identify risks and provide personalized recommendations.',
      category: 'Assessment'
    },
    {
      title: 'Risk Analysis',
      description: 'Comprehensive risk scoring with detailed factor analysis and priority identification for intervention.',
      category: 'Analysis'
    },
    {
      title: 'Smart Recommendations',
      description: 'Personalized action plans with cost-effective solutions and implementation timelines.',
      category: 'Recommendations'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor improvements over time with health metrics and milestone achievements.',
      category: 'Tracking'
    },
    {
      title: 'Equipment Database',
      description: 'Curated collection of ergonomic products with ratings, specifications, and comparisons.',
      category: 'Equipment'
    },
    {
      title: 'Detailed Reports',
      description: 'Professional assessment reports with executive summaries and actionable insights.',
      category: 'Reports'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Software Developer',
      content: 'The AI recommendations helped me reduce neck pain by 80% in just 3 weeks. The equipment suggestions were spot-on!',
      improvement: '80% pain reduction'
    },
    {
      name: 'Michael Chen',
      role: 'Data Analyst',
      content: 'Finally found a solution that understands my specific work setup. The progress tracking keeps me motivated.',
      improvement: '90% comfort improvement'
    },
    {
      name: 'Dr. Lisa Rodriguez',
      role: 'Occupational Health Specialist',
      content: 'I recommend this platform to all my patients. The assessment quality rivals professional consultations.',
      improvement: 'Professional-grade analysis'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Assessments Completed' },
    { value: '85%', label: 'Users Report Improvement' },
    { value: '4.8/5', label: 'Average Rating' },
    { value: '24/7', label: 'AI-Powered Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">ErgonoAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Ergonomic Assessment
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Workspace Health
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get personalized ergonomic recommendations powered by advanced AI. Reduce pain, 
              improve productivity, and create a healthier work environment in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/assessment">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3">
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <img 
              src="https://placehold.co/1200x600?text=Modern+ergonomic+workspace+assessment+dashboard+interface"
              alt="Ergonomic assessment dashboard showing AI-powered workspace analysis"
              className="rounded-lg shadow-2xl border border-gray-200"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Ergonomic Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create a healthier, more productive workspace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{feature.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Complete Assessment',
                description: 'Answer questions about your workspace setup, posture, and any discomfort you experience.',
                image: 'Ergonomic+assessment+form+with+workspace+measurements'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our advanced AI analyzes your responses to identify risk factors and calculate your ergonomic score.',
                image: 'AI+analysis+dashboard+showing+risk+factors+and+scores'
              },
              {
                step: '03',
                title: 'Get Recommendations',
                description: 'Receive personalized action plans with equipment suggestions and improvement strategies.',
                image: 'Personalized+ergonomic+recommendations+and+equipment+suggestions'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img 
                    src={`https://placehold.co/400x300?text=${step.image}`}
                    alt={step.title}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how ErgonoAI has transformed workspaces
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </div>
                  <div className="mb-4">
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {testimonials[currentTestimonial].improvement}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workspace?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have improved their health and productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/equipment">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
                <span className="text-xl font-bold">ErgonoAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered ergonomic assessments for healthier workspaces.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/assessment" className="hover:text-white">Assessment</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/recommendations" className="hover:text-white">Recommendations</Link></li>
                <li><Link href="/equipment" className="hover:text-white">Equipment</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Ergonomic Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Health Tips</a></li>
                <li><a href="#" className="hover:text-white">Research</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ErgonoAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}