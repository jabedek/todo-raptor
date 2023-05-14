import { useNavigate } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { CallbackFn } from "frotsi";

import { ProjectTypes, UserTypes } from "@@types";
import { usePopupContext } from "@@components/Layout";
import { DeleteProjectForm, ProjectStatus } from "@@components/Projects";
import { ReactIcons } from "@@components/Layout/preloaded-icons";
import { ROLES_COLORS } from "@@components/Projects/project-roles";

type Props = {
  project: ProjectTypes.Project;
  user: UserTypes.User | undefined;
  deleteFn: CallbackFn<Promise<void>>;
};

const AVATARS_LIMIT = 5;
const TAGS_CHARS_LIMIT = 30;

const ProjectsTableItem: React.FC<Props> = ({ project, user, deleteFn }) => {
  const { showPopup } = usePopupContext();
  const navigate = useNavigate();
  const [userIsCreator, setuserIsCreator] = useState(false);
  const [userIsManager, setuserIsManager] = useState(false);
  const [membersLimited, setmembersLimited] = useState<ProjectTypes.ProjectTeamMember[]>([]);
  const [tagsLimited, settagsLimited] = useState<string[]>([]);

  useLayoutEffect(() => {
    setmembersLimited(project.teamMembers.slice(0, AVATARS_LIMIT));

    const checkTagsCombinedLength = () => {
      let charsLength = 0;
      let lastIndex = 0;

      project.tags.forEach((tag, index) => {
        if (charsLength + tag.length <= TAGS_CHARS_LIMIT) {
          charsLength += tag.length;
          lastIndex = index;
        }
      });

      settagsLimited(project.tags.slice(0, lastIndex + 1));
    };

    checkTagsCombinedLength();
  }, [project]);

  useLayoutEffect(() => {
    setuserIsCreator(user?.authentication.id === project.originalCreatorId);
    setuserIsManager(user?.authentication.id === project.managerId);
  }, [user]);

  const popupDelete = () =>
    showPopup(
      <DeleteProjectForm
        project={project}
        deleteFn={deleteFn}
      />
    );

  return (
    <>
      <div className="project-table-item ">
        <div
          className={` w-full h-full  py-[8px] flex flex-col justify-between bg-white project-border border  hover:border-gray-500 transition-all transition-150   rounded-[3px] `}>
          {/* # Title */}
          <div className="flex w-full font-[800] text-[16px] justify-between px-[10px] ">
            <p className="app_ellipsis_inline w-full ">{project.title}</p>
          </div>

          {/* # Tags */}
          <div className="flex w-full flex-wrap max-h-[36px] min-h-[36px] px-[4px]   mt-[4px] mb-[8px]">
            {tagsLimited.map((tag, i) => (
              <div
                key={i}
                className="project-tag font-app_mono text-orange-600 bg-orange-200  rounded-[50px] text-[9px] uppercase
                  px-[6px] pt-[1px] m-[2px] h-[14px] leading-1 ">
                <p className="project-tag__label">{tag}</p>
              </div>
            ))}

            {project.tags.length > tagsLimited.length && (
              <div
                className="project-tag font-app_mono text-orange-600 bg-orange-200  rounded-[50px] text-[9px] 
                  px-[4px] pt-[2px] m-[1px] h-[16px] leading-1 ">
                <p className=" font-[800] tracking-[-1.5px] ">...</p>
              </div>
            )}
          </div>

          {/* # Description */}
          <div className="flex w-full font-[400] text-[12px] text-gray-500 h-[34px] italic px-[10px] ">
            <p className="app_ellipsis leading-[1.4] h-[34px]">{project.description}</p>
          </div>

          {/* # Members */}
          <div className="flex w-full justify-start min-h-[28px] h-[24px] my-[4px] ml-[3px] px-[10px]">
            {membersLimited.map((m, i) => (
              <div
                key={i}
                className={`team-member relative font-app_mono ml-[-5px] text-[10px] h-[24px] w-[24px] rounded-full ${m.roleColor} app_flex_center border-2 border-white border-solid`}>
                <p>{m.email?.substring(0, 2).toUpperCase()}</p>
              </div>
            ))}
            {project.teamMembers.length > AVATARS_LIMIT && (
              <div className=" relative font-app_mono ml-[-5px] text-[10px] h-[24px] w-[24px] app_flex_center border-2 border-white border-solid">
                <p className=" tracking-[-1.5px]">...</p>
              </div>
            )}
          </div>

          <div className="flex w-full justify-between items-center px-[10px]">
            {/* # Status */}
            <ProjectStatus
              status={project.status}
              userIsCreator={userIsCreator}
              userIsManager={userIsManager}
            />

            {/* Actions */}
            <div className="flex justify-between gap-2 min-w-[60px] ">
              {/* <div
                className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                onClick={popupDelete}>
                <MdInventory className="h-[12px] w-[12px] font-[300] text-gray-500 group-hover:text-red-700" />
              </div> */}
              <div
                className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                onClick={popupDelete}>
                <ReactIcons.MdPlaylistRemove className="h-[16px] w-[16px] font-[300] text-gray-500 group-hover:text-red-700" />
              </div>
              <div
                className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                onClick={() => navigate(`/projects/${project.id}`)}>
                <ReactIcons.MdReadMore className="h-[16px] w-[16px] font-[300] text-gray-500 group-hover:text-blue-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsTableItem;
