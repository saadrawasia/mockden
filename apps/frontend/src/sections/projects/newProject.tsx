import projectSVG from '@frontend/assets/projects.svg';

type NewProjectSectionProps = {
  button: React.ReactNode;
};

export default function NewProjectSection({ button }: NewProjectSectionProps) {
  return (
    <div className="flex flex-auto flex-col items-center justify-center gap-8 text-center">
      <img src={projectSVG} alt="create-project" className="sm:w-md" />
      {button}
    </div>
  );
}
