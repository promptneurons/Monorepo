// Help links to Virtuoso WebDAV
const VIRTUOSO_BASE = "http://66.228.53.216:8890/DAV/home/index";

const helpLinks = {
  // Specs
  "SPEC-001": `${VIRTUOSO_BASE}/specs/SPEC-001-governance-raci.md`,
  "SPEC-KLFS": `${VIRTUOSO_BASE}/specs/SPEC-KLFS-001-archivist-prototypes.md`,
  "SPEC-SLASH": `${VIRTUOSO_BASE}/specs/SPEC-SLASH-HARMONY.md`,
  
  // Playbooks
  "PLAY-morning": `${VIRTUOSO_BASE}/playbooks/PLAY-morning-workflow.md`,
  "PLAY-ingestion": `${VIRTUOSO_BASE}/playbooks/PLAY-ingestion-queue.md`,
  
  // TTPs
  "TTP-AM-ARCHIVE": `${VIRTUOSO_BASE}/ttps/TTP-AM-ARCHIVE-FLOW.md`,
  
  // Index
  "index": `${VIRTUOSO_BASE}/`,
  "rss": `${VIRTUOSO_BASE}/?a=rss`
};

function getHelpUrl(topic) {
  return helpLinks[topic] || `${VIRTUOSO_BASE}/?q=${encodeURIComponent(topic)}`;
}

module.exports = { helpLinks, getHelpUrl, VIRTUOSO_BASE };
