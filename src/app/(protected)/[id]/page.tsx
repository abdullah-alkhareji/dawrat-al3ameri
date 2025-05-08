import React from "react";

const TournamentPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Tournament Page</h1>
      <p>{params.id}</p>
    </div>
  );
};

export default TournamentPage;
