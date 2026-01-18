import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let body = await request.json();
    let { patientData, prescriptionData } = body;
    let { doctorpatinetId, patientId, doctorId, doctorName, reasonForVisit } = patientData;
    let {
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      symptoms,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId
    } = prescriptionData;
    await connect();
    let userdetails = await userDetails.findOne({ userId: patientId });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "Profile not create"
        }),
        {
          status: 401,
          headers
        }
      );
    }
    userdetails.appointments.status = "completed";
    userdetails.save();
    const newPrescriptionPatient = {
      doctorpatinetId,
      patientId,
      doctorName,
      doctorId,
      vitalSign,
      reasonForVisit,
      primaryDiagnosis,
      testandReport,
      symptoms,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId,
      createdAt: /* @__PURE__ */ new Date()
    };
    const createUserPrescription = await userDetails.findOneAndUpdate(
      {
        userId: patientId,
        "appointments.doctorpatinetId": doctorpatinetId
      },
      {
        $set: {
          "appointments.$.prescription": newPrescriptionPatient
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    let doctordetails = await doctorDetails.findOne({ userId: doctorId });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Profile not create"
        }),
        {
          status: 402,
          headers
        }
      );
    }
    doctordetails.appointments.status = "completed";
    doctordetails.save();
    const newPrescriptionDoctor = {
      doctorpatinetId,
      patientId,
      patientName: userdetails.name,
      patientAge: userdetails.age,
      doctorName,
      doctorId,
      vitalSign,
      reasonForVisit,
      primaryDiagnosis,
      testandReport,
      medication,
      symptoms,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId,
      createdAt: /* @__PURE__ */ new Date()
    };
    const createDoctorPrescription = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorId,
        "appointments.doctorpatinetId": doctorpatinetId
      },
      {
        $set: {
          "appointments.$.prescription": newPrescriptionDoctor
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    const createprescription = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorId
      },
      {
        $push: {
          prescription: newPrescriptionDoctor
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    await adminStore.updateMany(
      {},
      // Update all admin documents
      {
        $push: {
          prescription: {
            doctorpatinetId,
            patientId,
            doctorName: doctordetails.name,
            doctorId,
            doctorHospital: doctordetails.hospital,
            doctorContact: doctordetails.contact,
            patientSpecializations: doctordetails.specializations,
            patientSpecialist: doctordetails.specialist,
            patientName: userdetails.name,
            patientAge: userdetails.age,
            patientGender: userdetails.gender,
            patientContact: userdetails.contactNumber,
            patientBloodGroup: userdetails.bloodGroup,
            vitalSign,
            reasonForVisit,
            primaryDiagnosis,
            testandReport,
            medication,
            symptoms,
            restrictions,
            followUpDate,
            additionalNote,
            prescriptionId,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      }
    );
    await adminStore.updateOne(
      { "doctorDetails.userId": doctorId },
      {
        $set: {
          "doctorDetails.$[doctor].appointments.$[appointment].prescription": {
            doctorpatinetId,
            patientId,
            doctorName,
            doctorId,
            vitalSign,
            reasonForVisit,
            primaryDiagnosis,
            testandReport,
            medication,
            symptoms,
            restrictions,
            followUpDate,
            additionalNote,
            prescriptionId,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      },
      {
        arrayFilters: [
          { "doctor.userId": doctorId },
          // Match all patients with this ID
          { "appointment.doctorpatinetId": doctorpatinetId }
          // Match all patients with this ID
        ]
      }
    );
    await adminStore.updateOne(
      { "doctorDetails.userId": doctorId },
      {
        $push: {
          prescription: {
            doctorpatinetId,
            patientId,
            doctorName: doctordetails.name,
            doctorId,
            doctorHospital: doctordetails.hospital,
            doctorContact: doctordetails.contact,
            patientSpecializations: doctordetails.specializations,
            patientSpecialist: doctordetails.specialist,
            patientName: userdetails.name,
            patientAge: userdetails.age,
            patientGender: userdetails.gender,
            patientContact: userdetails.contactNumber,
            patientBloodGroup: userdetails.bloodGroup,
            vitalSign,
            reasonForVisit,
            primaryDiagnosis,
            testandReport,
            medication,
            symptoms,
            restrictions,
            followUpDate,
            additionalNote,
            prescriptionId,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      }
    );
    await adminStore.updateOne(
      { "patientDetails.userId": patientId },
      {
        $set: {
          "patientDetails.$[patient].appointments.$[appointment].prescription": {
            doctorpatinetId,
            patientId,
            doctorName,
            doctorId,
            vitalSign,
            reasonForVisit,
            primaryDiagnosis,
            testandReport,
            medication,
            symptoms,
            restrictions,
            followUpDate,
            additionalNote,
            prescriptionId,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      },
      {
        arrayFilters: [
          { "patient.userId": patientId },
          // Match all patients with this ID
          { "appointment.doctorpatinetId": doctorpatinetId }
          // Match all patients with this ID
        ]
      }
    );
    return new Response(JSON.stringify({ createDoctorPrescription }), {
      status: 200,
      headers
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Prescription not created. Error: ${error}`
      }),
      {
        status: 400,
        headers
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
