"use client";
import { useState } from "react";
import { Star, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckSquare,
  BarChart3,
  Zap,
  BookOpen,
  Activity,
} from "lucide-react";
import ReportAnalysisForm from "@/components/pages/services/form/report-analysis-form";
import DiagnosisForm from "@/components/pages/services/form/diagnosis-form";
import TreatmentPlanForm from "@/components/pages/services/form/treatment-plan-form";
import HealthMonitoringForm from "@/components/pages/services/form/health-monitoring-form";

type ServiceType = "report" | "diagnosis" | "treatment" | "monitoring" | null;

export default function HealthcareServices() {
  const [activeService, setActiveService] = useState<ServiceType>(null);

  const services = [
    {
      id: "diagnosis" as const,
      title: "AI Diagnosis",
      description:
        "Receive AI-powered disease predictions with confidence scores and detailed explanations",
      icon: Zap,
      buttonText: "View Diagnosis",
      color: "bg-green-100",
    },
    {
      id: "report" as const,
      title: "Report Analysis",
      description:
        "Upload your test reports and medical documents for AI-powered analysis and disease prediction",
      icon: BarChart3,
      buttonText: "Upload Reports",
      color: "bg-green-100",
    },
    {
      id: "treatment" as const,
      title: "Treatment Plans",
      description:
        "Get personalized treatment recommendations and medication suggestions based on AI diagnosis",
      icon: BookOpen,
      buttonText: "Get Treatment",
      color: "bg-green-100",
    },
    {
      id: "monitoring" as const,
      title: "Health Monitoring",
      description:
        "Continuous AI-powered health monitoring with alerts and recommendations for preventive care",
      icon: Activity,
      buttonText: "Start Monitoring",
      color: "bg-green-100",
    },
  ];

  const renderForm = () => {
    switch (activeService) {
      case "report":
        return <ReportAnalysisForm onClose={() => setActiveService(null)} />;
      case "diagnosis":
        return <DiagnosisForm onClose={() => setActiveService(null)} />;
      case "treatment":
        return <TreatmentPlanForm onClose={() => setActiveService(null)} />;
      case "monitoring":
        return <HealthMonitoringForm onClose={() => setActiveService(null)} />;
      default:
        return null;
    }
  };

  if (activeService) {
    return renderForm();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* AI-Powered Services Section */}
      <section id="services" className="py-16">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Healthcare AI Services
              </h1>
              <p className="text-xl text-gray-600">
                Advanced AI-powered healthcare solutions for better diagnosis
                and treatment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={service.id}
                    className={` bg-green-100 hover:shadow-lg hover:ring-4 transition-all duration-300 border-0 shadow-md`}
                    onClick={() => setActiveService(service.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </CardDescription>
                      <Button
                        onClick={() => setActiveService(service.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        {service.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to get your medications delivered
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Upload Prescription
              </h3>
              <p className="mt-2 text-gray-600">
                Upload your prescription or have your doctor suggestion or test
                report send it directly to our platform
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Verify & Process
              </h3>
              <p className="mt-2 text-gray-600">
                Our licensed system verify your prescription, test report and
                prepare your medication
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Receive Delivery
              </h3>
              <p className="mt-2 text-gray-600">
                Get your medications delivered safely to your doorstep with
                tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-green-100">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-green-100">Partner Pharmacies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-green-100">Medications Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-green-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of patients who trust MediCare+ for their medication
            needs
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Start Your Medication
            </Button>
            <Button variant="outline" size="lg">
              <Link to="/contact" className="text-gray-900">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  MediCare+
                </span>
              </div>
              <p className="mt-4 text-gray-400 max-w-md">
                Your trusted partner for safe, secure, and convenient medication
                delivery. Licensed, regulated, and committed to your health.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1-800-MEDICARE</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@medicareplus.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Available nationwide</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Services
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Prescription Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Medication Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Pharmacy Consultation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Health Monitoring
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-base text-gray-400">
                © 2024 MediCare+. All rights reserved. Licensed pharmacy
                services.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <Badge
                  variant="outline"
                  className="text-gray-400 border-gray-600"
                >
                  FDA Approved
                </Badge>
                <Badge
                  variant="outline"
                  className="text-gray-400 border-gray-600"
                >
                  HIPAA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
