import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
