import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['patient', 'caregiver', 'hospital', 'admin'],
      default: 'patient',
    },

    // Caregivers or hospitals linked to this patient
    caregivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Patients linked to this caregiver/hospital
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Pending approval requests (for caregivers/hospitals)
    pendingApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
