import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    personal: {
        firstName: { type: String, required: true },
        middleName: String,
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date, required: true },
        // maritalStatus: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true }
    },
    academic: {
        collegeName: { type: String, required: true },
        collegeCity: { type: String, required: true },
        state: { type: String, required: true },
        stream: { type: String, required: true },
        course: { type: String, required: true },
        standard: { type: String, required: true },
        admissionYear: { type: Number, required: true }
    },
    other: {
        interests: [{ type: String }],
        personalityType: { type: String, required: true },
        genz: { type: Boolean, default: false }
    },
    auth: {
        password: { type: String, required: true, select: false },
        otp: { type: String, select: false },
        otpExpires: { type: Date, select: false },
        isVerified: { type: Boolean, default: false }
    }
}, { timestamps: true });


studentSchema.index({
    'personal.firstName': "text",
    'personal.lastName': "text", 
    'academic.course': "text",
    'academic.collegeName': "text"
  });

export default mongoose.model('Student', studentSchema);