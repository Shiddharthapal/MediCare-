"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  User,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Doctor {
  id: number;
  name: string;
  specialist: string;
  hospital: string;
  fees: number;
  rating: number;
  experience: string;
  education: string;
  degree: string;
  about: string;
  image: string;
  availableSlots: string[];
}

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialist: "Cardiologist",
    hospital: "City General Hospital",
    fees: 150,
    rating: 4.8,
    experience: "12 years",
    education: "MD from Harvard Medical School",
    degree: "MBBS, MD (Cardiology)",
    about:
      "Dr. Sarah Johnson is a renowned cardiologist with over 12 years of experience in treating heart conditions. She specializes in interventional cardiology and has performed over 1000 successful procedures.",
    image: "/placeholder.svg?height=100&width=100",
    availableSlots: [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "03:30 PM",
      "05:00 PM",
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialist: "Neurologist",
    hospital: "Metro Medical Center",
    fees: 200,
    rating: 4.9,
    experience: "15 years",
    education: "MD from Johns Hopkins University",
    degree: "MBBS, MD (Neurology), DM",
    about:
      "Dr. Michael Chen is a leading neurologist specializing in brain disorders and neurological conditions. He has extensive experience in treating epilepsy, stroke, and neurodegenerative diseases.",
    image: "/placeholder.svg?height=100&width=100",
    availableSlots: ["08:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialist: "Pediatrician",
    hospital: "Children's Healthcare",
    fees: 120,
    rating: 4.7,
    experience: "8 years",
    education: "MD from Stanford University",
    degree: "MBBS, MD (Pediatrics)",
    about:
      "Dr. Emily Rodriguez is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence. She specializes in developmental pediatrics.",
    image: "/placeholder.svg?height=100&width=100",
    availableSlots: [
      "09:30 AM",
      "11:30 AM",
      "02:30 PM",
      "04:30 PM",
      "06:00 PM",
    ],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialist: "Orthopedic Surgeon",
    hospital: "Sports Medicine Institute",
    fees: 180,
    rating: 4.6,
    experience: "10 years",
    education: "MD from Mayo Clinic College",
    degree: "MBBS, MS (Orthopedics)",
    about:
      "Dr. James Wilson is an experienced orthopedic surgeon specializing in sports injuries and joint replacement surgeries. He has helped numerous athletes return to their peak performance.",
    image: "/placeholder.svg?height=100&width=100",
    availableSlots: ["08:30 AM", "10:00 AM", "01:30 PM", "03:00 PM"],
  },
];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const handleBookNow = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setShowBookingModal(true);
    setSelectedDate("");
    setSelectedSlot("");
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedSlot) {
      alert(
        `Booking confirmed for ${bookingDoctor?.name} on ${selectedDate} at ${selectedSlot}`
      );
      setShowBookingModal(false);
      setSelectedDate("");
      setSelectedSlot("");
    } else {
      alert("Please select both date and time slot");
    }
  };

  // Generate next 7 days for date selection
  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-BD", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Doctor
        </h1>
        <p className="text-gray-600">
          Book appointments with qualified healthcare professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader
              className="pb-4"
              onClick={() => handleDoctorClick(doctor)}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                  />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialist}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">
                      {doctor.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent
              className="pb-4"
              onClick={() => handleDoctorClick(doctor)}
            >
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  {doctor.hospital}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {doctor.experience} experience
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    ${doctor.fees}
                  </span>
                  <Badge variant="secondary">{doctor.specialist}</Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookNow(doctor);
                }}
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Doctor Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={selectedDoctor.image || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                  />
                  <AvatarFallback>
                    {selectedDoctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                  <p className="text-lg text-gray-600">
                    {selectedDoctor.specialist}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">
                      {selectedDoctor.rating}
                    </span>
                    <span className="ml-2 text-gray-600">
                      ({selectedDoctor.experience})
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Hospital
                    </h3>
                    <p className="text-gray-700">{selectedDoctor.hospital}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </h3>
                    <p className="text-gray-700">{selectedDoctor.education}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Degree</h3>
                    <p className="text-gray-700">{selectedDoctor.degree}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Consultation Fee
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedDoctor.fees}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Experience</h3>
                    <p className="text-gray-700">{selectedDoctor.experience}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Specialization
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {selectedDoctor.specialist}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedDoctor.about}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleBookNow(selectedDoctor);
                  }}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          {bookingDoctor && (
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={bookingDoctor.image || "/placeholder.svg"}
                    alt={bookingDoctor.name}
                  />
                  <AvatarFallback>
                    {bookingDoctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{bookingDoctor.name}</h3>
                  <p className="text-sm text-gray-600">
                    {bookingDoctor.specialist}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    ${bookingDoctor.fees}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Select Date
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {getNextSevenDays().map((date) => (
                    <Button
                      key={date.value}
                      variant={
                        selectedDate === date.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedDate(date.value)}
                      className="text-xs"
                    >
                      {date.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Available Slots
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingDoctor.availableSlots.map((slot: string) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        className="text-xs"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              {selectedDate && selectedSlot && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Doctor:</span>{" "}
                      {bookingDoctor.name}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {selectedSlot}
                    </p>
                    <p>
                      <span className="font-medium">Fee:</span> $
                      {bookingDoctor.fees}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleConfirmBooking}
                  disabled={!selectedDate || !selectedSlot}
                >
                  Confirm Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
