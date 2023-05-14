import { Button, RenderObject } from "@@components/common";

// import "../ProjectsTable/ProjectsTable.scss";
import "./ProjectView.scss";
import { ProjectTypes } from "@@types";
import ProjectViewHeader from "./ProjectViewHeader/ProjectViewHeader";
import SidePanel from "@@components/common/SidePanel";
import { usePopupContext } from "@@components/Layout";
import AddMemberForm from "./AddMemberForm/AddMemberForm";
import { useUserValue } from "@@contexts";
import { AreYouSureDialog, FormClearX } from "@@components/forms";
import { ProjectsAPI } from "@@api/firebase";
import { NewTaskForm } from "@@components/Tasks";
import { useState } from "react";
import { TaskList } from "src/app/types/Tasks";
import ProjectSchedule from "./ProjectSchedule/ProjectSchedule";

type Props = {
  projectData: ProjectTypes.Project | undefined;
};
const ProjectView: React.FC<Props> = ({ projectData }) => {
  console.log(projectData);
  const [tab, settab] = useState<TaskList>("schedule");
  // schedule - statuses: "New", "In progress" + "Blocked", "In review" + "In tests"
  // backlog - "New", occasionally also "Blocked"
  // archive - "Done", "Cancelled"

  const { user } = useUserValue();

  const { showPopup } = usePopupContext();

  const popupAddMemberForm = () =>
    showPopup(
      <AddMemberForm
        user={user}
        project={projectData}
      />
    );

  const popupAreYouSureDialog = (member: ProjectTypes.ProjectTeamMember) =>
    showPopup(
      <AreYouSureDialog
        submitFn={() => removeMember(member)}
        whatAction="remove member from project"
        closeOnSuccess={true}
      />
    );

  const removeMember = (member: ProjectTypes.ProjectTeamMember) => {
    if (projectData) {
      ProjectsAPI.userAsTeamMember(member, projectData, "break")
        .then(() => {
          console.log("git");
        })
        .catch((e) => console.error(e));
    }
  };

  const popupNewTaskForm = () => {
    showPopup(<NewTaskForm project={projectData} />);
  };

  return (
    <>
      <div className="flex flex-col rounded-[3px]">
        <div className="project-view justify-center font-app_primary bg-[rgba(241,241,241,1)] flex ">
          {/* Side - Left */}
          {/* <SidePanel
            widthPx="220"
            heightPxHeader="60"
            heightPxBody="540">
            <div className="h-full project-border border border-r-[1px]">1</div>
            <div className="h-full project-border border border-t-0 ">2</div>
          </SidePanel> */}

          {/* Main */}
          <div className="project-view__main flex flex-col justify-start">
            <ProjectViewHeader
              projectTitle={projectData?.title}
              setTabFn={(tab) => settab(tab)}
              tab={tab}
            />

            <div className={`text-[16px] font-bold w-full text-center py-2 bg-neutral-200`}> {projectData?.title} </div>

            <ProjectSchedule tasks={[]} />
          </div>

          {/* Side - Right */}
          <SidePanel
            widthPx="220"
            heightPxHeader="60"
            heightPxBody="540">
            <div className="h-full project-border border border-l-[1px] app_flex_center">
              <Button
                label="Add member"
                clickFn={popupAddMemberForm}
                formStyle="primary"
              />
            </div>
            <div className="h-full project-border border border-y-0 ">
              {projectData?.teamMembers.map((m, i) => (
                <div
                  className="relative flex items-center py-2 border-none border-transparent"
                  key={i}>
                  <div
                    key={i + "name"}
                    className={`team-member relative font-app_mono mx-[10px] text-[10px] h-[24px] w-[24px] rounded-full ${m.roleColor} app_flex_center border-2 border-white border-solid
                     `}>
                    <p>{m.email?.substring(0, 2).toUpperCase()}</p>
                  </div>
                  <p
                    key={m.email}
                    className="text-[11px]">
                    {m.email}
                  </p>

                  {user?.authentication.id !== m.id && (
                    <div className="ml-2">
                      <FormClearX
                        key={i + "x"}
                        clickFn={() => popupAreYouSureDialog(m)}
                        sizeVariant="I"
                        relatedItemId={m.id}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SidePanel>
        </div>

        <div className="w-full h-[120px] flex bg-neutral-200 project-border border app_flex_center ">
          <div className="">
            <Button
              label="Add task"
              clickFn={popupNewTaskForm}
              formStyle="primary"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectView;
