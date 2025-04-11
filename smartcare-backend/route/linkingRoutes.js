import express from 'express';
import User from '../models/User.js';
import HealthData from '../models/HealthData.js';
import mongoose from "mongoose";

const router = express.Router();

// 🔗 1. Send request to caregiver/hospital
router.post('/request-link', async (req, res) => {
  const { patientId, targetEmail } = req.body;

  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ msg: 'Invalid or missing patient ID' });
  }

  try {
    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser || !['caregiver', 'hospital'].includes(targetUser.role)) {
      return res.status(404).json({ msg: 'Caregiver or Hospital not found' });
    }

    // Already requested?
   if (targetUser.pendingApprovals.some(id => id?.toString() === patientId)) {
      return res.status(400).json({ msg: 'Request already sent' });
    }

    targetUser.pendingApprovals.push(patientId);
    await targetUser.save();

    res.status(200).json({ msg: 'Link request sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// 👀 2. Get pending requests for caregiver/hospital
router.get('/pending-requests/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('pendingApprovals', 'name email');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ pendingRequests: user.pendingApprovals });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ 3. Approve patient request
router.post('/approve-request', async (req, res) => {
  const { approverId, patientId } = req.body;

  try {
    const approver = await User.findById(approverId);
    const patient = await User.findById(patientId);

    if (!approver || !patient) return res.status(404).json({ msg: 'User not found' });

    // Link both ways
    if (!approver.patients.includes(patientId)) approver.patients.push(patientId);
    if (!patient.caregivers.includes(approverId)) patient.caregivers.push(approverId);

    // Remove from pending
    approver.pendingApprovals = approver.pendingApprovals.filter(id => id.toString() !== patientId);

    await approver.save();
    await patient.save();

    res.status(200).json({ msg: 'Request approved. Patient linked.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// 📊 4. Get health data of all linked patients
router.get('/linked-patients/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('patients', 'name email');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const data = await Promise.all(user.patients.map(async (patient) => {
      const health = await HealthData.find({ user: patient._id }).sort({ recordedAt: -1 }).limit(1);
      return {
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email
        },
        latestHealth: health[0] || null
      };
    }));

    res.status(200).json({ linkedPatients: data });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /link/approved/:caregiverId
router.get("/approved/:caregiverId", async (req, res) => {
  const caregiverId = req.params.caregiverId;

  try {
    const caregiver = await User.findById(caregiverId).populate("patients", "name email");
    if (!caregiver) return res.status(404).json({ error: "Caregiver not found" });

    res.json({ approvedPatients: caregiver.patients });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approved patients" });
  }
});


export default router;
