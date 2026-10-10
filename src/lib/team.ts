export const teamGroups = [
  { id: "leadership", positions: [
    { role: "founder", members: ["arstanbek"] },
    { role: "coFounder", members: ["barsbek"] },
  ] },
  { id: "departments", positions: [
    { role: "mathHead", members: ["arstanbek", "zhalal"] },
    { role: "chemistryHead", members: ["ismail"] },
    { role: "physicsHead", members: ["lira"] },
    { role: "biologyHead", members: ["elkhan", "barsbek"] },
    { role: "csHead", members: ["amantai"] },
  ] },
  { id: "platform", positions: [
    { role: "tech", members: ["amantai"] },
    { role: "ai", members: ["bermet"] },
    { role: "design", members: ["tolgonai"] },
    { role: "video", members: ["eldar"] },
  ] },
  { id: "mentorsEn", positions: [
    { role: "mathMentor", members: ["emmett"] },
    { role: "physicsMentor", members: ["owen"] },
    { role: "chemistryMentor", members: ["rilee"] },
    { role: "ictMentor", members: [] },
    { role: "biologyMentor", members: ["addison"] },
  ] },
  { id: "mentorsRu", positions: [
    { role: "biologyMentor", members: ["ashat"] },
    { role: "mathMentor", members: [] },
    { role: "physicsMentor", members: [] },
    { role: "chemistryMentor", members: [] },
    { role: "ictMentor", members: [] },
  ] },
] as const;
