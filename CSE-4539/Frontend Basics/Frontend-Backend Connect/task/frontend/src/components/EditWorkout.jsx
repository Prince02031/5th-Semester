import { useEffect, useState } from "react";
import api from "../api/axios";

const EditWorkout = ({ workout }) => {
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    if (workout) {
      setLoad(workout.load);
      setReps(workout.reps);
    }
  }, [workout]);

  if (!workout) {
    return <p>Loading workout...</p>;
  }

  const updateWorkout = async () => {
    await api.patch(`/${workout._id}`, {
      load: Number(load),
      reps: Number(reps)
    });

    alert("Workout updated");
  };

  return (
    <div>
      <h4>Edit Workout</h4>

      <input
        value={load}
        onChange={(e) => setLoad(e.target.value)}
      />

      <input
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />

      <button onClick={updateWorkout}>Update</button>
    </div>
  );
};

export default EditWorkout;
