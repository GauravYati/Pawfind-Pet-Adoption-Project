import { Heart, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fallbackPets } from "./data/pets.js";

const speciesOptions = ["All", "Dog", "Cat", "Rabbit", "Bird"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

function App() {
  const [pets, setPets] = useState(fallbackPets);
  const [selectedPet, setSelectedPet] = useState(fallbackPets[0]);
  const [species, setSpecies] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const params = new URLSearchParams();
        if (species !== "All") params.set("species", species);
        if (search.trim()) params.set("search", search.trim());

        const response = await fetch(`/api/pets?${params.toString()}`);
        if (!response.ok) throw new Error("API unavailable");

        const data = await response.json();
        setPets(data);
        setSelectedPet((current) => data.find((pet) => pet._id === current?._id) || data[0] || null);
        setIsFallback(false);
      } catch {
        const lowered = search.trim().toLowerCase();
        const filtered = fallbackPets.filter((pet) => {
          const matchesSpecies = species === "All" || pet.species === species;
          const matchesSearch =
            !lowered ||
            [pet.name, pet.breed, pet.city].some((value) => value.toLowerCase().includes(lowered));

          return matchesSpecies && matchesSearch;
        });

        setPets(filtered);
        setSelectedPet((current) => filtered.find((pet) => pet._id === current?._id) || filtered[0] || null);
        setIsFallback(true);
      }
    }

    loadPets();
  }, [species, search]);

  const stats = useMemo(
    () => [
      { label: "Ready pets", value: pets.length },
      { label: "Cities", value: new Set(pets.map((pet) => pet.city)).size },
      { label: "Vaccinated", value: pets.filter((pet) => pet.vaccinated).length }
    ],
    [pets]
  );

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitInquiry = async (event) => {
    event.preventDefault();
    if (!selectedPet) return;

    if (isFallback || selectedPet._id.length < 12) {
      setStatus(`Thanks, ${form.name || "friend"}. Start MongoDB and seed pets to save this inquiry.`);
      setForm(emptyForm);
      return;
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pet: selectedPet._id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setStatus(data.message);
      setForm(emptyForm);
    } catch (error) {
      setStatus(error.message || "Could not send inquiry right now.");
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">PawFind Adoption Desk</p>
            <h1>Find a companion who fits your home.</h1>
          </div>
          <div className="status-pill">
            <Sparkles size={18} />
            {isFallback ? "Demo data" : "Live API"}
          </div>
        </header>

        <section className="control-strip" aria-label="Pet filters">
          <label className="search-field">
            <Search size={18} />
            <input
              maxLength="60"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, breed, or city"
            />
          </label>
          <div className="species-tabs">
            {speciesOptions.map((option) => (
              <button
                className={option === species ? "active" : ""}
                key={option}
                onClick={() => setSpecies(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="stats-row" aria-label="Adoption stats">
          {stats.map((item) => (
            <div className="stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="pet-list" aria-label="Available pets">
            {pets.map((pet) => (
              <button
                className={`pet-card ${selectedPet?._id === pet._id ? "selected" : ""}`}
                key={pet._id}
                onClick={() => setSelectedPet(pet)}
                type="button"
              >
                <img alt={`${pet.name} the ${pet.species}`} src={pet.image} />
                <span className="species-badge">{pet.species}</span>
                <div className="pet-card-body">
                  <strong>{pet.name}</strong>
                  <span>{pet.breed}</span>
                  <small>
                    <MapPin size={14} />
                    {pet.city}
                  </small>
                </div>
              </button>
            ))}
            {!pets.length && <p className="empty-state">No pets match this search yet.</p>}
          </div>

          {selectedPet && (
            <aside className="detail-panel" aria-label="Selected pet details">
              <img className="detail-image" alt={`${selectedPet.name} profile`} src={selectedPet.image} />
              <div className="detail-header">
                <div>
                  <p className="eyebrow">{selectedPet.species}</p>
                  <h2>{selectedPet.name}</h2>
                  <span>
                    {selectedPet.breed} - {selectedPet.age} {selectedPet.age === 1 ? "year" : "years"} -{" "}
                    {selectedPet.gender}
                  </span>
                </div>
                <strong>Rs {selectedPet.adoptionFee}</strong>
              </div>

              <p className="story">{selectedPet.story}</p>

              <div className="trait-row">
                {selectedPet.temperament.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>

              <div className="care-line">
                <ShieldCheck size={18} />
                {selectedPet.vaccinated ? "Vaccinated and health checked" : "Health check scheduled"}
              </div>

              <form className="inquiry-form" onSubmit={submitInquiry}>
                <h3>
                  <Heart size={20} />
                  Adoption interest
                </h3>
                <input
                  maxLength="49"
                  minLength="2"
                  name="name"
                  onChange={updateForm}
                  pattern="[A-Za-z][A-Za-z ]{1,48}"
                  placeholder="Your name"
                  required
                  title="Use 2-49 letters. Spaces are allowed."
                  value={form.name}
                />
                <input
                  maxLength="80"
                  name="email"
                  onChange={updateForm}
                  placeholder="Email address"
                  required
                  type="email"
                  value={form.email}
                />
                <input
                  inputMode="numeric"
                  maxLength="10"
                  name="phone"
                  onChange={updateForm}
                  pattern="[0-9]{10}"
                  placeholder="Phone number"
                  required
                  title="Enter a 10 digit phone number."
                  value={form.phone}
                />
                <textarea
                  maxLength="300"
                  minLength="10"
                  name="message"
                  onChange={updateForm}
                  placeholder={`Tell us why ${selectedPet.name} feels like a fit`}
                  required
                  rows="4"
                  value={form.message}
                />
                <button type="submit">Send inquiry</button>
                {status && <p className="form-status">{status}</p>}
              </form>
            </aside>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
