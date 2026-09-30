// index.html contains one empty placeholder div per section. This module
// fetches each section's own HTML file and swaps it in, so the form's
// markup can live in separate files without needing a build step.
//
// Note: this uses fetch() on local files, which browsers only allow over
// http/https — not the file:// protocol. Use a local server (e.g. VS Code's
// Live Server) or GitHub Pages itself; both already work this way since
// the JS modules elsewhere in this app have the same requirement.

const sectionsToLoad = [
  { placeholderId: "section-requester", url: "sections/requester-details.html" },
  { placeholderId: "section-tabling", url: "sections/tabling-branch.html" },
  { placeholderId: "section-tour", url: "sections/tour-branch.html" },
  { placeholderId: "section-notes", url: "sections/notes-and-submit.html" },
];

async function loadSectionIntoPlaceholder({ placeholderId, url }) {
  const response = await fetch(url);
  const sectionHtml = await response.text();
  const placeholder = document.getElementById(placeholderId);
  // outerHTML replaces the placeholder div itself with the section's real
  // markup, so no extra wrapper div is left behind in the final page.
  placeholder.outerHTML = sectionHtml;
}

export async function loadFormSections() {
  await Promise.all(sectionsToLoad.map(loadSectionIntoPlaceholder));
}
