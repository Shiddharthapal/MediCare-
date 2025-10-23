"use client";
import { useState } from "react";
import {
  Clock,
  Truck,
  Star,
  Phone,
  Mail,
  MapPin,
  Shield,
  Users,
  BarChart3,
  Zap,
  BookOpen,
  Activity,
  Calendar,
  FileText,
  Heart,
  Settings,
} from "lucide-react";
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
import ReportAnalysisForm from "@/components/pages/services/form/report-analysis-form";
import DiagnosisForm from "@/components/pages/services/form/diagnosis-form";
import TreatmentPlanForm from "@/components/pages/services/form/treatment-plan-form";
import HealthMonitoringForm from "@/components/pages/services/form/health-monitoring-form";

//for doctor

import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
type ServiceType = "report" | "diagnosis" | "treatment" | "monitoring" | null;

export default function MedicationLandingPage() {
  const [activeService, setActiveService] = useState<ServiceType>(null);
  let doctor = useAppSelector((state) => state.auth.user);
  console.log("🧞‍♂️  doctor --->", doctor);
  const role = doctor?.role || null;
  console.log("🧞‍♂️  role --->", role);
  const services = [
    {
      id: "diagnosis" as const,
      title: "AI Diagnosis",
      description:
        "Receive AI-powered disease predictions with confidence scores and detailed explanations",
      icon: Zap,
      buttonText: "View Diagnosis",
      color: "bg-green-200",
    },
    {
      id: "report" as const,
      title: "Report Analysis",
      description:
        "Upload your test reports and medical documents for AI-powered analysis and disease prediction",
      icon: BarChart3,
      buttonText: "Upload Reports",
      color: "bg-green-200",
    },
    {
      id: "treatment" as const,
      title: "Treatment Plans",
      description:
        "Get personalized treatment recommendations and medication suggestions based on AI diagnosis",
      icon: BookOpen,
      buttonText: "Get Treatment",
      color: "bg-green-200",
    },
    {
      id: "monitoring" as const,
      title: "Health Monitoring",
      description:
        "Continuous AI-powered health monitoring actively and recommendations for preventive care",
      icon: Activity,
      buttonText: "Start Monitoring",
      color: "bg-green-200",
    },
  ];

  const renderForm = () => {
    switch (activeService) {
      case "diagnosis":
        return <DiagnosisForm onClose={() => setActiveService(null)} />;
      case "report":
        return <ReportAnalysisForm onClose={() => setActiveService(null)} />;
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
  function ServiceCard({ service }: { service: (typeof services)[0] }) {
    const Icon = service.icon;

    return (
      <Card className="flex-shrink-0 w-80 mx-4 bg-[hsl(201,96%,32%)] border-0 shadow-sm">
        <CardContent className="p-1 text-center">
          <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {service.title}
          </h3>

          <p className="text-gray-900 mb-4 leading-relaxed">
            {service.description}
          </p>

          <Button
            onClick={() => setActiveService(service.id)}
            className="bg-white hover:bg-cyan-900 hover:text-white text-black px-6 py-1 rounded-md font-medium"
          >
            {service.buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  }
  const cardWidth = 320 + 32;
  const totalWidth = services.length * cardWidth;

  return (
    <div className=" bg-gradient-to-br from-primary to-secondary   ">
      <div className=" ">
        <section className="relative py-20 lg:py-32  ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                  Your Health,
                  <span className="text-[hsl(201,96%,32%)]"> Delivered</span>
                </h1>
                <p className="mt-3 text-base text-black sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Get your medications delivered safely and securely to your
                  doorstep. Our platform connects patients with licensed
                  pharmacies and healthcare providers for seamless medication
                  management.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-[hsl(201,96%,32%)] hover:border-primary/50 hover:shadow-lg hover:text-black"
                    >
                      Order Medication
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 transition-all text-black hover:border-primary/50 hover:underline"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm text-black">
                      4.9/5 from 2,000+ reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Dashboard features*/}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Dashboard Features
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Manage your health journey with our comprehensive dashboard
                tools
              </p>
            </div>

            {role !== "doctor" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Appointments */}
                <Link to="/patient" state={{ file: "appointments", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[hsl(273,100%,60%)] rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Appointments</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Schedule and manage appointments with doctors and
                        specialists. Get reminders and track your upcoming
                        visits all in one place.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Doctors */}
                <Link to="patient" state={{ file: "doctors", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Doctors</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Browse and connect with licensed healthcare
                        professionals. View profiles, specializations, and book
                        consultations instantly.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Reports */}
                <Link to="patient" state={{ file: "reports", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Reports</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Access all your medical reports and test results in one
                        secure location. Download, share, and track your health
                        data over time.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Health Records */}
                <Link to="patient" state={{ file: "health records", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[hsl(355,89%,52%)] rounded-lg flex items-center justify-center">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">
                          Health Records
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Maintain a complete digital health record including
                        medications, allergies, conditions, and treatment
                        history for better care coordination.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Settings */}
                <Link to="patient" state={{ file: "settings", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Settings className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Settings</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Customize your experience with personalized preferences,
                        notification settings, privacy controls, billing setting
                        and account management options.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* CTA Card */}
                <Card className="border-2 border-[hsl(201,96%,32%)] bg-gradient-to-br from-[hsl(201,96%,32%)] to-[hsl(201,96%,25%)] text-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      Ready to Get Started?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white leading-tight">
                      Create your account today and access all these powerful
                      features to manage your health effectively.
                    </p>
                    <Link to="/profile">
                      <Button className="w-full bg-white text-[hsl(201,96%,32%)] hover:bg-gray-100 font-semibold">
                        Create Account
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Appointments */}
                <Link to="/doctor" state={{ file: "appointments", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[hsl(273,100%,60%)] rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Appointments</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Schedule and manage appointments with doctors and
                        specialists. Get reminders and track your upcoming
                        visits all in one place.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Doctors */}
                <Link to="/doctor" state={{ file: "patients", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Patients</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Browse and connect with licensed healthcare
                        professionals. View profiles, specializations, and book
                        consultations instantly.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Reports */}
                <Link to="/doctor" state={{ file: "reports", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Reports</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Access all your medical reports and test results in one
                        secure location. Download, share, and track your health
                        data over time.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Settings */}
                <Link to="/doctor" state={{ file: "setting", id: 123 }}>
                  <Card className="border border-gray-700 hover:border-[hsl(201,96%,32%)] hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Settings className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Settings</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Customize your experience with personalized preferences,
                        notification settings, privacy controls, billing setting
                        and account management options.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* CTA Card */}

                <Card className="border- border-[hsl(201,96%,32%)] bg-gradient-to-br from-[hsl(201,96%,32%)] to-[hsl(201,96%,25%)] text-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      Ready to Get Started?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="">
                    <p className="text-white leading-tight">
                      Create your account today and access all these powerful
                      features to manage your health effectively.
                    </p>
                    <Link to="/profilefordoctor">
                      <Button className="w-full bg-white text-[hsl(201,96%,32%)] hover:bg-gray-100 font-semibold">
                        Create Account
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/*service section */}
        <section id="services" className="py-16 bg-white">
          <div className="w-full py-16 bg-white overflow-hidden">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Services
              </h2>
              <p className="text-lg text-gray-600">
                Choose any services for better medication
              </p>
            </div>

            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: [0, -totalWidth],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                  },
                }}
              >
                {/* First set */}
                {services.map((service, index) => (
                  <ServiceCard key={`original-${index}`} service={service} />
                ))}
                {/* Second set - exact duplicate for seamless loop */}
                {services.map((service, index) => (
                  <ServiceCard key={`duplicate-${index}`} service={service} />
                ))}
                {/* Third set - extra buffer for ultra smooth transition */}
                {services.map((service, index) => (
                  <ServiceCard key={`buffer-${index}`} service={service} />
                ))}
              </motion.div>
            </div>

            <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
          `}</style>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Why Choose MediCare+?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We provide comprehensive medication management solutions for
                patients and healthcare providers
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center border-0 shadow-lg bg-[hsl(201,96%,32%)]">
                <CardHeader>
                  <div className="mx-auto w-12 h-12  rounded-lg bg-blue-400 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Secure & Licensed</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    All medications sourced from licensed pharmacies with full
                    regulatory compliance
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-[hsl(201,96%,32%)]">
                <CardHeader>
                  <div className="mx-auto w-12 h-12  rounded-lg bg-[hsl(273,100%,60%)] flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Round-the-clock customer support and pharmacist consultation
                    available
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-[hsl(201,96%,32%)]">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-[hsl(355,89%,52%)] flex items-center justify-center">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Fast Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Same-day delivery available in major cities, next-day
                    delivery nationwide
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-[hsl(201,96%,32%)]">
                <CardHeader>
                  <div className="mx-auto w-12 h-12  rounded-lg bg-green-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Expert Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Licensed pharmacists and healthcare professionals managing
                    your care
                  </CardDescription>
                </CardContent>
              </Card>
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
                <div className="mx-auto w-16 h-16 bg-[hsl(201,96%,32%)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Upload Prescription
                </h3>
                <p className="mt-2 text-gray-600">
                  Upload your prescription or have your doctor send it directly
                  to our platform
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[hsl(201,96%,32%)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Verify & Process
                </h3>
                <p className="mt-2 text-gray-600">
                  Our licensed pharmacists verify your prescription and prepare
                  your medication
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[hsl(201,96%,32%)] rounded-full flex items-center justify-center text-white font-bold text-xl">
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
        <section className="py-16 bg-[hsl(201,96%,32%)]">
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
              Join thousands of patients who trust MediCare+ for their
              medication needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[hsl(201,96%,32%)] hover:text-black"
              >
                Start Your Order
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 text-black hover:border-primary/50 hover:underline"
              >
                Contact Support
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
                  <div className="w-8 h-8 bg-[hsl(201,96%,32%)] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">
                    MediCare+
                  </span>
                </div>
                <p className="mt-4 text-gray-400 max-w-md">
                  Your trusted partner for safe, secure, and convenient
                  medication delivery. Licensed, regulated, and committed to
                  your health.
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
    </div>
  );
}
