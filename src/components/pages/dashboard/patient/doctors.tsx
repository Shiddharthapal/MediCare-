"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import BookAppointment from "./bookAppoinment";

interface DoctorDetails {
  _id: string;
  userId: string;
  name: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  gender: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: AppointmentSlot;
  consultationModes: string[];
  createdAt: Date;
}

interface AppointmentSlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [doctordata, setDoctordata] = useState<DoctorDetails[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Ref for intersection observer
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 20;

  // Shuffle function
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Fetch doctors with pagination
  const fetchDoctors = useCallback(async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `/api/allDoctorDetails?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const result = await response.json();
      const newDoctors = (result?.doctordetails || []) as DoctorDetails[];

      // Check if there are more doctors to load
      if (newDoctors.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      // Shuffle new doctors
      const shuffledDoctors = shuffleArray(newDoctors);

      // Append or set doctors
      if (pageNum === 1) {
        setDoctordata(shuffledDoctors);
      } else {
        setDoctordata((prev) => [...prev, ...shuffledDoctors]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDoctors(1);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before reaching the bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchDoctors(page);
    }
  }, [page, fetchDoctors]);

  const handleBookAppointment = (doctorId: string) => {
    const doctor = doctordata.find((d) => d._id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsBookingOpen(true);
    }
  };

  const filteredDoctors = doctordata?.filter((doctor) => {
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

  const getDoctorInitials = (doctorName: string) => {
    if (!doctorName) return "DR";
    const cleanName = doctorName.replace(/^(DR\.?|Dr\.?)\s*/i, "").trim();
    if (!cleanName) return "DR";
    const words = cleanName.split(" ").filter((word) => word.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "DR";
    }
  };

  const formatTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const minute = minutes || "00";

    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  };

  const formatWorkingHours = (hours) => {
    if (!hours?.enabled) {
      return "Closed";
    }

    const startTime = formatTo12Hour(hours.startTime);
    const endTime = formatTo12Hour(hours.endTime);

    return `${startTime} - ${endTime}`;
  };

  const DoctorCard = ({ doctor }: { doctor: DoctorDetails }) => (
    <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
              {getDoctorInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.5</span>
              </div>
            </div>
            <div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {doctor?.gender}
              </Badge>
            </div>

            <div className="space-y-2 mt-2">
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
                  Next available:{" "}
                  <div className="grid grid-cols-2 gap-x-4">
                    {doctor?.availableSlots &&
                      Object.entries(doctor?.availableSlots).map(
                        ([day, hours]) => (
                          <div key={day} className="flex items-center py-1">
                            <span className="capitalize font-medium text-gray-700 w-20">
                              {day}:
                            </span>
                            <span
                              className={`${hours?.enabled ? "text-green-600" : "text-red-500"} font-medium`}
                            >
                              {formatWorkingHours(hours)}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 text-sm line-clamp-2">{doctor.about}</p>

          <div className="flex flex-wrap gap-2">
            {doctor?.specializations
              .slice(0, 3)
              .map((spec: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {doctor?.consultationModes?.map((mode: string, index: number) => (
                <Badge key={index} className={getAvailabilityColor(doctor)}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-lg font-semibold text-gray-900">
              ${doctor?.fees}
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
          {filteredDoctors?.length} doctors loaded
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
                <option value="All Specialties">All Specialties</option>
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
                  {doctordata?.length}
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
                    doctordata?.filter((doctor) => {
                      // Check if availableSlots exists
                      if (!doctor?.availableSlots) return false;

                      // Check if any day has enabled slots
                      return Object.values(doctor.availableSlots).some(
                        (slot) => slot?.enabled === true
                      );
                    }).length
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
                  {
                    // [...new Set(doctordata.flatMap((d) => d.specializations))]
                    //   .length
                    doctordata.length
                  }
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

      {/* Initial Loading */}
      {loading && doctordata.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors?.length > 0 ? (
          filteredDoctors?.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : !loading ? (
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
        ) : null}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 text-blue-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">Loading more doctors...</span>
          </div>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="h-10" />

      {/* End of List Message */}
      {!hasMore && doctordata.length > 0 && (
        <div className="text-center py-8">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <p className="text-gray-600 font-medium">
                You've reached the end of the list
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total doctors loaded: {doctordata.length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <BookAppointment
        isOpen={isBookingOpen}
        doctor={selectedDoctor}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
