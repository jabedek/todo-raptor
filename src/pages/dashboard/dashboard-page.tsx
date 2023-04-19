import NewTaskForm from "@@components/Projects/NewTaskForm";
import { useLoaderData } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const item = useLoaderData();
  console.log(item);
  return (
    <div>
      DashboardPage
      <NewTaskForm />
    </div>
  );
};

export default DashboardPage;
