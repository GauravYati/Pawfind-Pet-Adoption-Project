import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ["Female", "Male"], required: true },
    city: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    temperament: [{ type: String, trim: true }],
    story: { type: String, required: true },
    adoptionFee: { type: Number, required: true, min: 0 },
    vaccinated: { type: Boolean, default: false },
    adopted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
