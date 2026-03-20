import { useEffect, useState } from "react";
import api from "../api/axios";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await api.get("/");
    setWorkouts(res.data);
  };

  const deleteWorkout = async (id) => {
    await api.delete(`/${id}`);
    fetchWorkouts();
  };

  const startEdit = (workout) => {
    setEditingId(workout._id);
    setLoad(workout.load);
    setReps(workout.reps);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLoad("");
    setReps("");
  };

  const updateWorkout = async (id) => {
    await api.patch(`/${id}`, {
      load: Number(load),
      reps: Number(reps),
    });

    setEditingId(null);
    fetchWorkouts();
  };

  return (
    <div>
      <h3>All Workouts</h3>

      {workouts.map((w) => (
        <div
          key={w._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h4>{w.title}</h4>

          {editingId === w._id ? (
            <>
              <input
                value={load}
                onChange={(e) => setLoad(e.target.value)}
              />
              <input
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />

              <button onClick={() => updateWorkout(w._id)}>
                Save
              </button>
              <button onClick={cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>Load: {w.load}</p>
              <p>Reps: {w.reps}</p>
              <p>Difficulty: {w.difficulty}</p>

              <button onClick={() => startEdit(w)}>
                Edit
              </button>
              <button onClick={() => deleteWorkout(w._id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
