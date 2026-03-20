import { useState } from "react";
import api from "../api/axios";

const CreateWorkout = () => {
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const createWorkout = async () => {
    try {
      await api.post("/", {
        title,
        load: Number(load),
        reps: Number(reps),
        difficulty
      });

      alert("Workout created");
      setTitle("");
      setLoad("");
      setReps("");
      setDifficulty("medium");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div>
      <h3>Create Workout</h3>

      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Load" value={load} onChange={e => setLoad(e.target.value)} />
      <input placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} />

      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button onClick={createWorkout}>Add Workout</button>
    </div>
  );
};

export default CreateWorkout;
