export function renderDetailPage(params) {
  const section = document.createElement("section");
  section.textContent = `Detail Page - ID: ${params.id}`;

  return section;
}