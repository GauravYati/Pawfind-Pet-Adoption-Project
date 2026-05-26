import express from "express";
import mongoose from "mongoose";
import Inquiry from "../models/Inquiry.js";
import Pet from "../models/Pet.js";

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9]{10}$/;
const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,48}$/;

function validateInquiry({ pet, name = "", email = "", phone = "", message = "" }) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  const trimmedMessage = message.trim();

  if (!pet || !trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
    return "All fields are required";
  }

  if (!mongoose.Types.ObjectId.isValid(pet.trim())) {
    return "A valid pet id is required";
  }

  if (!namePattern.test(trimmedName)) {
    return "Name must be 2-49 letters and can include spaces, apostrophes, periods, or hyphens";
  }

  if (!emailPattern.test(trimmedEmail) || trimmedEmail.length > 80) {
    return "Enter a valid email address";
  }

  if (!phonePattern.test(trimmedPhone)) {
    return "Phone number must be exactly 10 digits";
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 300) {
    return "Message must be between 10 and 300 characters";
  }

  return "";
}

router.post("/", async (req, res) => {
  const { pet, name, email, phone, message } = req.body;
  const validationMessage = validateInquiry(req.body);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const selectedPet = await Pet.findById(pet.trim());

  if (!selectedPet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  const inquiry = await Inquiry.create({
    pet: pet.trim(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message.trim()
  });
  return res.status(201).json({
    message: `Thanks, ${name}. The shelter team will contact you about ${selectedPet.name}.`,
    inquiry
  });
});

export default router;
