/* ============================================================
   icons.js — ชุด SVG line icon กลาง (แทน emoji)
   ใช้ได้ทั้ง index และ lab: icon("name") คืน string SVG
   สไตล์: stroke line icon, currentColor, 24x24
   ============================================================ */

(function (global) {
  "use strict";

  const P = 'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"';

  const ICONS = {
    // Actors
    developer:
      '<path ' + P + ' d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 6l-2 12"/>',
    reviewer:
      '<circle cx="11" cy="11" r="6" ' + P + '/><path ' + P + ' d="M20 20l-4.3-4.3"/>',
    product:
      '<rect x="5" y="4" width="14" height="16" rx="2" ' + P + '/><path ' + P + ' d="M9 8h6M9 12h6M9 16h4"/>',
    admin:
      '<path ' + P + ' d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path ' + P + ' d="M9.5 12l1.8 1.8 3.2-3.6"/>',
    agent:
      '<rect x="5" y="8" width="14" height="10" rx="2.5" ' + P + '/><path ' + P + ' d="M12 4v4M9 13h.01M15 13h.01"/><path ' + P + ' d="M3 12v2M21 12v2"/>',
    cloud:
      '<path ' + P + ' d="M7 18a4 4 0 010-8 5 5 0 019.6-1.3A3.5 3.5 0 0117 18z"/>',
    plug:
      '<path ' + P + ' d="M9 7V4M15 7V4M8 7h8v4a4 4 0 01-8 0z"/><path ' + P + ' d="M12 15v5"/>',

    // Value props / features
    spec:
      '<path ' + P + ' d="M7 4h7l4 4v12H7z"/><path ' + P + ' d="M14 4v4h4M9.5 13h5M9.5 16h5"/>',
    bolt:
      '<path ' + P + ' d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    link:
      '<path ' + P + ' d="M9 15l6-6M10.5 6.5l1.8-1.8a3.5 3.5 0 015 5l-1.8 1.8M13.5 17.5l-1.8 1.8a3.5 3.5 0 01-5-5l1.8-1.8"/>',

    // Misc UI
    user:
      '<circle cx="12" cy="8" r="3.2" ' + P + '/><path ' + P + ' d="M5.5 20a6.5 6.5 0 0113 0"/>',
    arrowRight:
      '<path ' + P + ' d="M5 12h13M13 6l6 6-6 6"/>',
    check:
      '<path ' + P + ' d="M5 12.5l4.5 4.5L19 7"/>',
    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2" ' + P + '/><path ' + P + ' d="M4 7l8 6 8-6"/>',
    phone:
      '<path ' + P + ' d="M6 3h3l2 5-2.5 1.5a11 11 0 005 5L14 12l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 013-3z"/>',

    // Lab
    target:
      '<circle cx="12" cy="12" r="8" ' + P + '/><circle cx="12" cy="12" r="4" ' + P + '/><circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none"/>',
    brain:
      '<path ' + P + ' d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5 3 3 0 003 4h1V4z"/><path ' + P + ' d="M15 4a3 3 0 013 3 3 3 0 011 5 3 3 0 01-3 4h-1V4z"/>',
    keyboard:
      '<rect x="3" y="7" width="18" height="10" rx="2" ' + P + '/><path ' + P + ' d="M7 11h.01M11 11h.01M15 11h.01M8 14h8"/>',
    timer:
      '<circle cx="12" cy="13" r="7" ' + P + '/><path ' + P + ' d="M12 13V9M10 3h4"/>',
    moon:
      '<path ' + P + ' d="M20 14A8 8 0 019.5 4 7 7 0 1020 14z"/>',
    sliders:
      '<path ' + P + ' d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2" ' + P + '/><circle cx="9" cy="16" r="2" ' + P + '/>',
    chart:
      '<path ' + P + ' d="M4 20V4M4 20h16"/><path ' + P + ' d="M8 16v-3M12 16V8M16 16v-6"/>',
    bell:
      '<path ' + P + ' d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z"/><path ' + P + ' d="M10 21h4"/>'
  };

  function icon(name, cls) {
    const body = ICONS[name] || "";
    return (
      '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" ' +
      'width="24" height="24" aria-hidden="true" focusable="false">' + body + "</svg>"
    );
  }

  global.icon = icon;
  global.ICONS = ICONS;
})(window);
