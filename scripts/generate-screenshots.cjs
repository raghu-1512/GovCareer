const sharp = require('sharp');
const fs = require('fs');

async function createScreenshots() {
  const wideSvg = `
  <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#090d16"/>
    <rect x="40" y="40" width="1200" height="70" rx="16" fill="#1e293b"/>
    <text x="80" y="85" fill="#38bdf8" font-family="sans-serif" font-size="24" font-weight="bold">GovCareer AI</text>
    <rect x="40" y="140" width="380" height="540" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <rect x="440" y="140" width="780" height="540" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="480" y="200" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="bold">Government Recruitment &amp; Eligibility Engine</text>
    <text x="480" y="240" fill="#94a3b8" font-family="sans-serif" font-size="16">Real-time match scoring, syllabus breakdowns, and verified portal access.</text>
  </svg>`;
  
  await sharp(Buffer.from(wideSvg)).png().toFile('public/screenshot-wide.png');

  const narrowSvg = `
  <svg width="540" height="960" xmlns="http://www.w3.org/2000/svg">
    <rect width="540" height="960" fill="#090d16"/>
    <rect x="20" y="30" width="500" height="60" rx="16" fill="#1e293b"/>
    <text x="50" y="70" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="bold">GovCareer AI</text>
    <rect x="20" y="110" width="500" height="220" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <rect x="20" y="350" width="500" height="220" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="50" y="160" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">SSC CGL 2026</text>
    <text x="50" y="190" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold">92% Match • Eligible</text>
    <rect x="50" y="230" width="200" height="40" rx="10" fill="#2563eb"/>
    <text x="110" y="255" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">View &amp; Apply</text>
  </svg>`;
  
  await sharp(Buffer.from(narrowSvg)).png().toFile('public/screenshot-narrow.png');

  console.log('Screenshots generated successfully!');
}

createScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
