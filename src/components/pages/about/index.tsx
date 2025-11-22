"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              className="mb-6 bg-primary/10 text-primary hover:bg-primary/20"
              variant="secondary"
            >
              Revolutionizing Healthcare
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">Medicare</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl leading-relaxed">
              Your trusted telemedicine platform combining AI-powered diagnosis
              with expert medical care. Access quality healthcare anytime,
              anywhere.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base">
                📅 Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">
                Active Patients
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">
                Expert Doctors
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">
                Available Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl text-balance">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Experience the future of healthcare with our integrated platform
              designed for your convenience and well-being.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  AI-Powered Diagnosis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced artificial intelligence analyzes your symptoms and
                  medical history to provide accurate preliminary assessments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                  <span className="text-3xl">📹</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Video Consultations
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with certified doctors through secure, high-quality
                  video calls from the comfort of your home.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Easy Appointment Booking
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Schedule appointments with specialists at your convenience
                  with our intuitive booking system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Digital Prescriptions
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive electronic prescriptions instantly and access them
                  anytime through your patient portal.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Report Management
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload and manage your medical reports securely, making them
                  accessible to your healthcare providers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pay consultation fees securely with multiple payment options
                  and transparent pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-5">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl text-balance">
              How Medicare Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Getting quality healthcare has never been easier. Follow these
              simple steps to start your journey.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create Account</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sign up and complete your medical profile with relevant health
                  information.
                </p>
              </div>

              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Book Appointment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose a doctor, select a convenient time slot, and confirm
                  your booking.
                </p>
              </div>

              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Consult Doctor</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join the video consultation and discuss your health concerns
                  with the doctor.
                </p>
              </div>

              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="mb-2 text-xl font-semibold">Get Treatment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive prescriptions, submit reports, and follow up as
                  needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-28 ">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl text-balance">
                Why Choose Medicare?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                We're committed to making healthcare accessible, affordable, and
                efficient for everyone. Our platform combines cutting-edge
                technology with compassionate care.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      Certified Healthcare Professionals
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All our doctors are licensed, experienced, and verified
                      specialists.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      HIPAA Compliant & Secure
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your medical data is encrypted and protected with
                      industry-leading security.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="mb-1 font-semibold">Affordable Pricing</h4>
                    <p className="text-sm text-muted-foreground">
                      Transparent pricing with no hidden fees. Quality
                      healthcare shouldn't break the bank.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="mb-1 font-semibold">24/7 Availability</h4>
                    <p className="text-sm text-muted-foreground">
                      Access healthcare whenever you need it, day or night,
                      weekends and holidays.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">⏱️</span>
                  <div className="mb-2 text-3xl font-bold">20 min</div>
                  <p className="text-sm text-primary-foreground/90">
                    Average wait time for consultations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent text-accent-foreground">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">👥</span>
                  <div className="mb-2 text-3xl font-bold">50K+</div>
                  <p className="text-sm text-accent-foreground/90">
                    Successful consultations completed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-secondary text-secondary-foreground">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">🏆</span>
                  <div className="mb-2 text-3xl font-bold">4.6/5</div>
                  <p className="text-sm text-secondary-foreground/90">
                    Average patient rating
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">❤️</span>
                  <div className="mb-2 text-3xl font-bold text-foreground">
                    100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dedicated to your health
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-6xl mb-6 block">🩺</span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl text-balance">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90 text-pretty leading-relaxed">
              Join thousands of patients who trust Medicare for their healthcare
              needs. Book your first consultation today and discover the future
              of medicine.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="text-base">
                📅 Book Your First Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 text-base"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Medicare</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Revolutionizing healthcare through technology and compassion.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patient"
                    state={{ file: "settings", id: 123 }}
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patient"
                    state={{ file: "appointments", id: 123 }}
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Appointments
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/help"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-800 hover:text-[hsl(201,96%,32%)] transition-colors hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                <li>support@medicare.com</li>
                <li>1-800-MEDICARE</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Medicare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
