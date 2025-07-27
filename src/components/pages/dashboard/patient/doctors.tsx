"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Video,
  Phone,
  Search,
  Filter,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Activity,
} from "lucide-react";
import BookAppointment from "./bookAppoinment";

// Mock doctors data

interface DoctorDetails {
  _id: string;
  userId: string;
  name: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: string[];
  consultationModes: string[];
  createdAt: Date;
}
// const doctorsData = [
//   {
//     id: 1,
//     name: "Dr. Sarah Wilson",
//     specialty: "Cardiologist",
//     experience: "15 years",
//     rating: 4.9,
//     reviews: 234,
//     location: "New York Medical Center",
//     availability: "Available Today",
//     consultationFee: 150,
//     image: "/placeholder.svg",
//     avatar: "SW",
//     about:
//       "Specialized in heart diseases and cardiovascular surgery with extensive experience in complex cardiac procedures.",
//     languages: ["English", "Spanish"],
//     education: "Harvard Medical School",
//     consultationModes: ["video", "in-person"],
//     nextAvailable: "Today 2:00 PM",
//     specializations: [
//       "Heart Surgery",
//       "Cardiac Imaging",
//       "Preventive Cardiology",
//     ],
//     icon: Heart,
//   },
//   {
//     id: 2,
//     name: "Dr. Michael Chen",
//     specialty: "Dermatologist",
//     experience: "12 years",
//     rating: 4.8,
//     reviews: 189,
//     location: "Skin Care Clinic",
//     availability: "Available Tomorrow",
//     consultationFee: 120,
//     image: "/placeholder.svg",
//     avatar: "MC",
//     about:
//       "Expert in skin conditions, cosmetic dermatology, and advanced skin cancer treatments.",
//     languages: ["English", "Mandarin"],
//     education: "Johns Hopkins University",
//     consultationModes: ["video", "in-person"],
//     nextAvailable: "Tomorrow 10:00 AM",
//     specializations: ["Skin Cancer", "Cosmetic Dermatology", "Acne Treatment"],
//     icon: Activity,
//   },
//   {
//     id: 3,
//     name: "Dr. Tina Murphy",
//     specialty: "Endocrinologist",
//     experience: "18 years",
//     rating: 4.9,
//     reviews: 312,
//     location: "Hormone Health Institute",
//     availability: "Available Today",
//     consultationFee: 180,
//     image: "/placeholder.svg",
//     avatar: "TM",
//     about:
//       "Leading expert in hormone therapy, diabetes management, and metabolic disorders.",
//     languages: ["English", "French"],
//     education: "Mayo Clinic College of Medicine",
//     consultationModes: ["video", "in-person", "phone"],
//     nextAvailable: "Today 4:00 PM",
//     specializations: ["Hormone Therapy", "Diabetes Care", "Thyroid Disorders"],
//     icon: Activity,
//   },
//   {
//     id: 4,
//     name: "Dr. James Rodriguez",
//     specialty: "Orthopedist",
//     experience: "20 years",
//     rating: 4.7,
//     reviews: 156,
//     location: "Orthopedic Sports Medicine",
//     availability: "Available in 2 days",
//     consultationFee: 200,
//     image: "/placeholder.svg",
//     avatar: "JR",
//     about:
//       "Specialized in sports medicine, joint replacement, and orthopedic trauma surgery.",
//     languages: ["English", "Spanish"],
//     education: "Stanford Medical School",
//     consultationModes: ["in-person"],
//     nextAvailable: "Jan 11, 9:00 AM",
//     specializations: ["Sports Medicine", "Joint Replacement", "Spine Surgery"],
//     icon: Activity,
//   },
//   {
//     id: 5,
//     name: "Dr. Lisa Thompson",
//     specialty: "Nutritionist",
//     experience: "10 years",
//     rating: 4.6,
//     reviews: 98,
//     location: "Wellness Nutrition Center",
//     availability: "Available Today",
//     consultationFee: 100,
//     image: "/placeholder.svg",
//     avatar: "LT",
//     about:
//       "Certified nutritionist specializing in weight management and therapeutic diets.",
//     languages: ["English"],
//     education: "Columbia University",
//     consultationModes: ["video", "phone"],
//     nextAvailable: "Today 1:00 PM",
//     specializations: [
//       "Weight Management",
//       "Sports Nutrition",
//       "Therapeutic Diets",
//     ],
//     icon: Activity,
//   },
//   {
//     id: 6,
//     name: "Dr. Emily Davis",
//     specialty: "General Physician",
//     experience: "8 years",
//     rating: 4.5,
//     reviews: 145,
//     location: "Family Health Clinic",
//     availability: "Available Today",
//     consultationFee: 80,
//     image: "/placeholder.svg",
//     avatar: "ED",
//     about:
//       "Primary care physician with focus on preventive medicine and family healthcare.",
//     languages: ["English"],
//     education: "University of Pennsylvania",
//     consultationModes: ["video", "in-person", "phone"],
//     nextAvailable: "Today 11:00 AM",
//     specializations: [
//       "Preventive Care",
//       "Family Medicine",
//       "Chronic Disease Management",
//     ],
//     icon: Stethoscope,
//   },
//   {
//     id: 7,
//     name: "Dr. Robert Kim",
//     specialty: "Psychiatrist",
//     experience: "14 years",
//     rating: 4.8,
//     reviews: 203,
//     location: "Mental Health Associates",
//     availability: "Available Tomorrow",
//     consultationFee: 160,
//     image: "/placeholder.svg",
//     avatar: "RK",
//     about:
//       "Mental health specialist with expertise in anxiety, depression, and cognitive behavioral therapy.",
//     languages: ["English", "Korean"],
//     education: "UCLA Medical School",
//     consultationModes: ["video", "in-person"],
//     nextAvailable: "Tomorrow 3:00 PM",
//     specializations: ["Anxiety Disorders", "Depression", "CBT"],
//     icon: Brain,
//   },
//   {
//     id: 8,
//     name: "Dr. David Park",
//     specialty: "Ophthalmologist",
//     experience: "16 years",
//     rating: 4.9,
//     reviews: 187,
//     location: "Vision Care Center",
//     availability: "Available in 3 days",
//     consultationFee: 140,
//     image: "/placeholder.svg",
//     avatar: "DP",
//     about:
//       "Eye specialist with expertise in cataract surgery, retinal diseases, and vision correction.",
//     languages: ["English", "Korean"],
//     education: "Duke University School of Medicine",
//     consultationModes: ["in-person"],
//     nextAvailable: "Jan 12, 2:00 PM",
//     specializations: ["Cataract Surgery", "Retinal Diseases", "LASIK"],
//     icon: Eye,
//   },
// ];

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Orthopedist",
  "Nutritionist",
  "General Physician",
  "Psychiatrist",
  "Ophthalmologist",
];

const availabilityFilters = [
  "All",
  "Available Today",
  "Available Tomorrow",
  "Available This Week",
];

export default function Doctors({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctordata, setDoctordata] = useState<DoctorDetails[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response = await fetch("/api/doctor/doctorDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Status:${response.status}`);
        }
        let doctordetails = await response.json();
        setDoctordata(doctordetails?.doctordetails);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleBookAppointment = (doctorId: number) => {
    const doctor = doctordata.find((d) => d._id === String(doctorId));
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsBookingOpen(true);
    }
  };

  const filteredDoctors = doctordata.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specializations
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      doctor.specializations.includes(selectedSpecialty);

    const matchesAvailability =
      selectedAvailability === "All" ||
      doctor.availableSlots.includes(
        selectedAvailability.replace("Available ", "")
      );

    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const getAvailabilityColor = (availability: string) => {
    return "bg-green-100 text-green-800";
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleBookNewAppointment = () => {
    if (onNavigate) {
      onNavigate("doctors");
    }
  };

  const DoctorCard = ({ doctor }: { doctor: any }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.image || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
              {doctor.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.5</span>
                <span className="text-sm text-gray-500">
                  ({doctor.reviews})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {doctor.specialist}
                </span>
                <span className="text-gray-500">
                  • {doctor.experience} years experience
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-sm">{doctor.hospital}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-sm">
                  Next available: {doctor.availableSlots}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 text-sm line-clamp-2">{doctor.about}</p>

          <div className="flex flex-wrap gap-2">
            {doctor.specializations
              .slice(0, 3)
              .map((spec: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getAvailabilityColor(doctor.availability)}>
                <Video className="" />
                {doctor.availability}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-gray-500">video</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-lg font-semibold text-gray-900">
              ${doctor.fees}
              <span className="text-sm font-normal text-gray-500">
                {" "}
                /consultation
              </span>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleBookAppointment(doctor._id)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Find Doctors</h1>
          <p className="text-gray-600">
            Book appointments with qualified healthcare professionals
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredDoctors.length} doctors available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[
                  ...new Set(
                    doctordata.flatMap((doctor) => doctor.specializations)
                  ),
                ].map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availabilityFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Doctors
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {doctordata.length}
                </p>
              </div>
              <Stethoscope className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Available Today
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {
                    doctordata.filter((d) =>
                      d.availableSlots.includes("availableSlots")
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Specialties
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {doctordata.length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold text-orange-900">4.7</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <BookAppointment
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
      />
    </div>
  );
}
