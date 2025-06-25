import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types/userDetails";
import {
  setEditMode,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/redux/slices/profileSlice";

interface FormErrors {
  [key: string]: string;
}

interface ProfileFormData {
  name: string;
  fatherName?: string;
  address: string;
  age: number;
  bloodGroup: string;
  weight: number;
  height?: number;
  contactNumber: string;
  lastTreatmentDate?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isEditing, isSaving, error } = useAppSelector(
    (state) => state.profile
  );
  const token = useAppSelector((state) => state.auth.token);
  const [errors, setErrors] = useState<FormErrors>({});

  const defaultProfile: ProfileFormData = {
    name: "",
    fatherName: undefined,
    address: "",
    age: 18,
    bloodGroup: "",
    weight: 0,
    height: undefined,
    contactNumber: "",
    lastTreatmentDate: undefined,
  };

  const [formData, setFormData] = useState<ProfileFormData>(defaultProfile);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        UserId: user._id,
        // Add other fields when API is ready
      }));
    }
    const fetchData = async () => {
      let id = user?._id;
      try {
        let response = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Status:${response.status}`);
        }
        const responseData = await response.json();
        //console.log("🧞‍♂️responseData --->", responseData.userdetails);
        setFormData(responseData?.userdetails);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (formData.contactNumber.trim().length < 10) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    }

    if (!formData.bloodGroup.trim()) {
      newErrors.bloodGroup = "Blood group is required";
    } else if (!/^(A|B|AB|O)[+-]$/.test(formData.bloodGroup.trim())) {
      newErrors.bloodGroup = "Invalid blood group format (e.g., A+, B-, O+)";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 0 || formData.age > 150) {
      newErrors.age = "Age must be between 0 and 150";
    }

    if (formData.weight && formData.weight < 0) {
      newErrors.weight = "Weight must be a positive number";
    }

    if (formData.height && formData.height < 0) {
      newErrors.height = "Height must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | undefined = value;

    // Handle numeric inputs
    if (type === "number") {
      parsedValue = value === "" ? undefined : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEdit = () => {
    dispatch(setEditMode(true));
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      dispatch(updateProfileStart());

      // Convert form data to User type
      // Required fields
      const updatedProfile: Partial<User> = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        age: formData.age,
        bloodGroup: formData.bloodGroup.trim(),
        weight: formData.weight,
      };

      // Optional fields
      if (formData.fatherName?.trim()) {
        updatedProfile.fatherName = formData.fatherName.trim();
      }
      if (formData.height) {
        updatedProfile.height = formData.height;
      }
      if (formData.lastTreatmentDate) {
        updatedProfile.lastTreatmentDate = new Date(formData.lastTreatmentDate);
      }

      let response = await fetch("/api/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedProfile, token }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const responseData = await response.json();

      // TODO: Add API call to update profile
      // const response = await updateUserProfile(updatedProfile);
      dispatch(updateProfileSuccess(updatedProfile));
      dispatch(setEditMode(false));
    } catch (err) {
      dispatch(
        updateProfileFailure(
          err instanceof Error ? err.message : "Failed to update profile"
        )
      );
    }
  };

  const handleCancel = () => {
    setFormData(defaultProfile);
    setErrors({});
    dispatch(setEditMode(false));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-green-100 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Profile Information
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Details
            </h2>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : "bg-white"}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.name || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              {isEditing ? (
                <Input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="bg-white"
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.fatherName || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "border-red-500" : "bg-white"}
                    required
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.address || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={
                      errors.contactNumber ? "border-red-500" : "bg-white"
                    }
                    placeholder="01xxxxxxxxx"
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500">
                      {errors.contactNumber}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.contactNumber || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4"></h2>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={
                      errors.bloodGroup ? "border-red-500" : "bg-white"
                    }
                    placeholder="e.g., A+, B-, O+"
                  />
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">{errors.bloodGroup}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.bloodGroup || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={errors.age ? "border-red-500" : "bg-white"}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.age ? `${formData?.age} years` : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight || ""}
                    onChange={handleInputChange}
                    className={errors.weight ? "border-red-500" : "bg-white"}
                    required
                  />
                  {errors.weight && (
                    <p className="text-sm text-red-500">{errors.weight}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.weight ? `${formData?.weight} kg` : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (inch)</Label>
              {isEditing ? (
                <>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.height || ""}
                    onChange={handleInputChange}
                    className={errors.height ? "border-red-500" : "bg-white"}
                  />
                  {errors.height && (
                    <p className="text-sm text-red-500">{errors.height}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.height
                    ? `${formData?.height} inch`
                    : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastTreatmentDate">Last Treatment Date</Label>
              {isEditing ? (
                <Input
                  id="lastTreatmentDate"
                  name="lastTreatmentDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.lastTreatmentDate || ""}
                  onChange={handleInputChange}
                  className="bg-white"
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData?.lastTreatmentDate
                    ? new Date(formData?.lastTreatmentDate).toLocaleDateString()
                    : "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
                className="hover:bg-red-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEdit}
                variant="outline"
                className="hover:bg-blue-300"
              >
                Edit
              </Button>
              <Button
                onClick={handleClose}
                variant="secondary"
                className="hover:bg-red-300"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
