import { useState } from "react";
import api from "../api/axios";

const SingleWorkoutNoForm = () => {
  const [id, setId] = useState("");
  const [workout, setWorkout] = useState(null);

  const getWorkout = async () => {
    const res = await api.get(`/${id}`);
    setWorkout(res.data);
  };

  return (
    <div>
      <h3>Find Workout</h3>

      <input
        placeholder="Workout ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />

      <button onClick={getWorkout}>Get Workout</button>

      {workout && (
        <div>
          <h4>{workout.title}</h4>
          <p>Load: {workout.load}</p>
          <p>Reps: {workout.reps}</p>
          <p>Difficulty: {workout.difficulty}</p>
        </div>
      )}
    </div>
  );
};

export default SingleWorkoutNoForm;
