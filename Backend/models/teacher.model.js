import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  // Draft Status
  draftId: { type: String, unique: true, index: true },
  status: { type: String, enum: ['draft', 'verified', 'active'], default: 'draft' },

  // Step 1 Data
  // Add proper nested schemas
  personal: {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    age: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    salary: { type: Number, required: true },
    termsAccepted: { type: String, default: false }
  },
  location: {
    city: { type: String},
    state: { type: String},
    country: { type: String, default: 'India' }
  },
  // Step 3 Data
  professional: {
    email: String,
    phone: String,
    classrooms: [String],
    role: String,
    yearlySalary: Number,
    joiningDate: Date,
    uid: { type: String, unique: true, sparse: true }
  },

  // OTP Verification
  otp: String,
  otpExpiry: Date,

  // Timestamps
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: Date
}, {timestamps: true});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;