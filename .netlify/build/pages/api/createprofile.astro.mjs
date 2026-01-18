import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../chunks/userDetails_BjvOpMvp.mjs';
import { u as user } from '../../chunks/user_DS_DMAEJ.mjs';
import { a as adminStore } from '../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { formData, id } = body;
    const {
      name,
      fatherName,
      address,
      contactNumber,
      age,
      bloodGroup,
      dateOfBirth,
      weight,
      height,
      gender
    } = formData;
    if (!name || !address || !bloodGroup || !age || !weight || !contactNumber || !dateOfBirth) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            address: !address ? "Address is required" : null,
            age: !age ? "Age is required" : null,
            gender: !gender ? "Gender is required" : null,
            weight: !weight ? "Weight is required" : null,
            bloodGroup: !bloodGroup ? "Bloodgroup is required" : null,
            dateOfBirth: !dateOfBirth ? "Birthday is required" : null,
            contactNumber: !contactNumber ? "Contact number is required" : null
          }
        }),
        {
          status: 401,
          headers
        }
      );
    }
    await connect();
    let userdetails = await userDetails.findOne({ userId: id });
    let userdata = await user.findOne({ _id: id });
    if (!userdetails) {
      userdetails = new userDetails({
        userId: id,
        email: userdata?.email,
        name,
        fatherName,
        address,
        dateOfBirth,
        contactNumber,
        age,
        gender,
        bloodGroup,
        weight,
        height
      });
      await userdetails.save();
      await adminStore.updateMany(
        {},
        // Empty filter = update all admin documents
        {
          $push: {
            patientDetails: {
              userId: id,
              email: userdata?.email,
              name,
              fatherName,
              address,
              dateOfBirth,
              contactNumber,
              age,
              gender,
              bloodGroup,
              weight,
              height,
              status: "active",
              createdAt: /* @__PURE__ */ new Date()
            }
          }
        }
      );
    } else {
      userdetails.name = name || userdetails.name;
      userdetails.email = userdata?.email || userdetails.email;
      userdetails.fatherName = fatherName || userdetails.fatherName;
      userdetails.address = address || userdetails.address;
      userdetails.dateOfBirth = dateOfBirth || userdetails.dateOfBirth;
      userdetails.contactNumber = contactNumber || userdetails.contactNumber;
      userdetails.age = age || userdetails.age;
      userdetails.gender = gender || userdetails.gender;
      userdetails.bloodGroup = bloodGroup || userdetails.bloodGroup;
      userdetails.weight = weight || userdetails.weight;
      userdetails.height = height || userdetails.height;
      await userdetails.save();
      await adminStore.updateMany(
        {},
        // Empty filter = update all admin documents
        {
          $push: {
            patientDetails: {
              userId: id,
              email: userdata?.email,
              name: name || userdetails.name,
              fatherName: fatherName || userdetails.fatherName,
              address: address || userdetails.address,
              dateOfBirth: dateOfBirth || userdetails.dateOfBirth,
              contactNumber: contactNumber || userdetails.contactNumber,
              age: age || userdetails.age,
              gender: gender || userdetails.gender,
              bloodGroup: bloodGroup || userdetails.bloodGroup,
              weight: weight || userdetails.weight,
              height: height || userdetails.height,
              status: "active",
              createdAt: /* @__PURE__ */ new Date()
            }
          }
        }
      );
    }
    return new Response(JSON.stringify({ userdetails }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create profile.",
        error: error instanceof Error ? error.message : "Token verification failed"
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
