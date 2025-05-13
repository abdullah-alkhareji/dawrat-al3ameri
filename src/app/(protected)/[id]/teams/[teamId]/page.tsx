import React from "react";
import EditTeamForm from "@/components/forms/edit-team-form";

type EditTeamPageProps = {
  params: Promise<{ teamId: string }>;
};

const EditTeamPage = async ({ params }: EditTeamPageProps) => {
  const { teamId } = await params;

  return (
    <div>
      <EditTeamForm teamId={teamId} />
    </div>
  );
};

export default EditTeamPage;
