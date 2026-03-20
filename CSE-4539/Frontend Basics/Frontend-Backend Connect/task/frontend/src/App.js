import CreateWorkout from "./components/CreateWorkout";
import WorkoutList from "./components/WorkoutList";
import SingleWorkout from "./components/SingleWorkout";
import EditWorkout from "./components/EditWorkout";

function App() {
  return (
    <div>
      <CreateWorkout />
      <WorkoutList />
      <SingleWorkout />
      <EditWorkout/>
    </div>
  );
}

export default App;
