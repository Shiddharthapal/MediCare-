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
  fatherName: string;
  address: string;
  age: string; // Keep as string for input handling
  bloodGroup: string;
  weight: string; // Keep as string for input handling
  height: string; // Keep as string for input handling
  contactNumber: string;
  lastTreatmentDate: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isEditing, isSaving, error } = useAppSelector(
    (state) => state.profile
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const defaultProfile: ProfileFormData = {
    name: "",
    fatherName: "",
    address: "",
    age: "",
    bloodGroup: "",
    weight: "",
    height: "",
    contactNumber: "",
    lastTreatmentDate: new Date().toISOString().split("T")[0],
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
  }, [user]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (
      !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(formData.contactNumber.trim())
    ) {
      newErrors.contactNumber = "Invalid contact number format";
    }

    if (!formData.bloodGroup.trim()) {
      newErrors.bloodGroup = "Blood group is required";
    } else if (!/^(A|B|AB|O)[+-]$/.test(formData.bloodGroup.trim())) {
      newErrors.bloodGroup = "Invalid blood group format";
    }

    if (
      formData.age &&
      (isNaN(Number(formData.age)) || Number(formData.age) < 0)
    ) {
      newErrors.age = "Age must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const updatedProfile: Partial<User> = {
        name: formData.name,
        ...(formData.age ? { age: Number(formData.age) } : {}),
        ...(formData.weight ? { weight: Number(formData.weight) } : {}),
        ...(formData.height ? { height: Number(formData.height) } : {}),
        ...(formData.fatherName ? { fatherName: formData.fatherName } : {}),
        ...(formData.address ? { address: formData.address } : {}),
        ...(formData.bloodGroup ? { bloodGroup: formData.bloodGroup } : {}),
        ...(formData.contactNumber
          ? { contactNumber: formData.contactNumber }
          : {}),
        ...(formData.lastTreatmentDate
          ? { lastTreatmentDate: new Date(formData.lastTreatmentDate) }
          : {}),
      };

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
      <div className="bg-white shadow-lg rounded-lg p-6">
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
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.name}
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
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.fatherName || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.address || "Not provided"}
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
                    className={errors.contactNumber ? "border-red-500" : ""}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500">
                      {errors.contactNumber}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.contactNumber || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Medical Details
            </h2>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              {isEditing ? (
                <>
                  <Input
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={errors.bloodGroup ? "border-red-500" : ""}
                    placeholder="e.g., A+, B-, O+"
                  />
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">{errors.bloodGroup}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.bloodGroup || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              {isEditing ? (
                <>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.age ? `${formData.age} years` : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              {isEditing ? (
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.weight ? `${formData.weight} kg` : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              {isEditing ? (
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.height ? `${formData.height} cm` : "Not provided"}
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
                  value={formData.lastTreatmentDate}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  {formData.lastTreatmentDate
                    ? new Date(formData.lastTreatmentDate).toLocaleDateString()
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
              <Button onClick={handleEdit} variant="outline">
                Edit
              </Button>
              <Button onClick={handleClose} variant="secondary">
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
