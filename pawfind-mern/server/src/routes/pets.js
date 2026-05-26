import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { species, search } = req.query;
  const filters = { adopted: false };

  if (species && species !== "All") {
    filters.species = species;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { breed: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } }
    ];
  }

  const pets = await Pet.find(filters).sort({ createdAt: -1 });
  res.json(pets);
});

router.get("/:id", async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  return res.json(pet);
});

router.post("/", async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json(pet);
});

export default router;
