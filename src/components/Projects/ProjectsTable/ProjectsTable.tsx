import React, { useState } from "react";
import { MdCardMembership } from "react-icons/md";
import "./ProjectsTable.scss";

import { ProjectTypes } from "@@types";
import ProjectTableItem from "./ProjectTableItem/ProjectTableItem";

interface ProjectTableProps {
  projects: ProjectTypes.Project[];
}

const ProjectsTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  //   const categories = [...new Set(projects.map((project) => project.category))];
  const tags = [...new Set(projects.flatMap((project) => project.tags))];
  const statuses = [...new Set(projects.map((project) => project.status))];

  const filteredProjects = projects.filter(
    (project) =>
      //   (selectedCategory === "" || project.category === selectedCategory) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => project.tags.includes(tag))) &&
      (selectedStatus === "" || project.status === selectedStatus)
  );

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTags(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div className="font-app_primary bg-[rgba(241,241,241,1)]">
      <div>
        <div className="project-badge  app_flex_center">
          <MdCardMembership className="project-badge__icon text-lime-300" />
        </div>
        Projects you manage
      </div>
      <div>
        <div className="project-badge  app_flex_center">
          <MdCardMembership className="project-badge__icon text-orange-300" />
        </div>
        Projects you are managed in
      </div>
      <div>
        <div className="project-badge  app_flex_center">
          <MdCardMembership className="project-badge__icon text-indigo-300" />
        </div>
        Projects you created
      </div>
      {/* <div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          multiple
          value={selectedTags}
          onChange={handleTagChange}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option
              key={tag}
              value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option
              key={status}
              value={status}>
              {status}
            </option>
          ))}
        </select>
      </div> */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {filteredProjects.map((project) => (
          <ProjectTableItem project={project} />
          // <div
          //   key={project.id}
          //   style={{ border: "1px solid #ccc", padding: "1rem" }}>
          //   {/* <img
          //     src={project.image}
          //     alt={project.title}
          //     style={{ maxWidth: "100%" }}
          //   /> */}
          //   <h3>{project.title}</h3>
          //   <p>{project.description}</p>
          //   <p>{project.tags.join(", ")}</p>
          //   <p>{project.status}</p>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTable;
