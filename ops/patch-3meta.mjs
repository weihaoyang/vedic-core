import { readFileSync, writeFileSync } from "node:fs";

const qimenYearPatches = [
  ["lib/qimen/QimenChart.js", "(getYearByLiChun ? getYearByLiChun() : lunar.getYearInGanZhiExact())", "lunar.getYearInGanZhiExact()"],
  ["dist/3meta.esm.js", '="exact"===F?C?C():u.getYearInGanZhiExact()', '="exact"===F?u.getYearInGanZhiExact()'],
];
for (const [path, before, after] of qimenYearPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (!source.includes(before)) {
    if (!source.includes(after) && !source.includes("exactYearGZ")) throw new Error("Review 3meta exact year patch");
    continue;
  }
  writeFileSync(file, source.replace(before, after));
}

const qimenCalendarPatches = [
  ["lib/qimen/QimenChart.js", "lunar.getYearInGanZhiExact()", "(opts?.exactYearGZ ?? lunar.getYearInGanZhiExact())", "lunar.getMonthInGanZhiExact()", "(opts?.exactMonthGZ ?? lunar.getMonthInGanZhiExact())"],
  ["dist/3meta.esm.js", '?u.getYearInGanZhiExact():u.getYearInGanZhi()', '?(n?.exactYearGZ??u.getYearInGanZhiExact()):u.getYearInGanZhi()', 'd=u.getMonthInGanZhiExact()', 'd=(n?.exactMonthGZ??u.getMonthInGanZhiExact())'],
];

const qimenJuPatches = [
  ["lib/qimen/QimenChart.js", "(0, calculator_1.getJuShu)(solarTerm, yuan, isYangdun);", "((0, calculator_1.getJuShu)(solarTerm, yuan, isYangdun) || (0, calculator_1.getJuShu)(solarTerm, yuan, !isYangdun));"],
  ["dist/3meta.esm.js", "||me(B,x,m),p=", "||me(B,x,m)||me(B,x,!m),p="],
];
// 值使门取寄宫之门，但旬首在中五时仍从五宫起算；不能从寄宫二起算。
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "let position = constants_1.GATE_ORIGINAL_POSITIONS[zhiShiMen];", "let position = zhiFuGong;"],
  ["dist/3meta.esm.js", "h=(le(r)-le(s)+12)%12;let g=ie[a];", "h=(le(r)-le(s)+12)%12;let g=n;"],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta central palace gate counting patch");
  writeFileSync(file, source.replace(before, after));
}
// 选择《奇门遁甲统宗》阴阳均寄坤口径：中五落宫与寄干统一归坤二。
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "const rawPosition = position;\n    if (position === 5)\n        position = isYangdun ? 8 : 2;", "const rawPosition = position;\n    if (position === 5)\n        position = 2;"],
  ["lib/qimen/calculator.js", "const targetPos = isYangdun ? 8 : 2;", "const targetPos = 2;"],
  ["lib/qimen/calculator.js", "type: isYangdun ? '阳遁寄艮八' : '阴遁寄坤二'", "type: '中五寄坤二'"],
  ["dist/3meta.esm.js", "return 5===g&&(g=t?8:2),{gate:a,position:g,rawPosition:o}", "return 5===g&&(g=2),{gate:a,position:g,rawPosition:o}"],
  ["dist/3meta.esm.js", "const a=e?8:2,s=t.find(e=>e.position===a)", "const a=2,s=t.find(e=>e.position===a)"],
  ["dist/3meta.esm.js", 'type:e?"阳遁寄艮八":"阴遁寄坤二"', 'type:"中五寄坤二"'],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta Kun palace hosting patch");
  writeFileSync(file, source.replace(before, after));
}
for (const [path, before, after] of qimenJuPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta forced dun patch");
  writeFileSync(file, source.replace(before, after));
}
for (const [path, yearBefore, yearAfter, monthBefore, monthAfter] of qimenCalendarPatches) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(yearAfter) && source.includes(monthAfter)) continue;
  if (!source.includes(yearBefore) || !source.includes(monthBefore)) throw new Error("Review 3meta calendar patch");
  writeFileSync(file, source.replace(yearBefore, yearAfter).replace(monthBefore, monthAfter));
}


// 天禽寄宫 can leave two heavenly stems on one palace.
for (const [path, before, after] of [
  ["lib/qimen/calculator.js", "tianGan === cond.tianGan && position === cond.gong", "(Array.isArray(tianGan) ? tianGan.includes(cond.tianGan) : tianGan === cond.tianGan) && position === cond.gong"],
  ["dist/3meta.esm.js", "n===t.tianGan&&e===t.gong", "(Array.isArray(n)?n.includes(t.tianGan):n===t.tianGan)&&e===t.gong"],
]) {
  const file = new URL("../node_modules/3meta/" + path, import.meta.url);
  const source = readFileSync(file, "utf8");
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review 3meta hosted-stem punishment patch");
  writeFileSync(file, source.replace(before, after));
}

for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = "const pluto = plutoHeliocentric(jd);";
  const after = `// Meeus chapter 21: rotate Pluto's J2000 ecliptic into Earth's ecliptic of date.
  const pluto = plutoHeliocentric(jd);
  const t = (jd - J2000_EPOCH) / DAYS_PER_JULIAN_CENTURY;
  const eta = (47.0029 * t - 0.03302 * t ** 2 + 0.00006 * t ** 3) / 3600 * DEG_TO_RAD;
  const pi = (174.876384 + (-869.8089 * t + 0.03536 * t ** 2) / 3600) * DEG_TO_RAD;
  const p = (5029.0966 * t + 1.11113 * t ** 2 - 0.000006 * t ** 3) / 3600 * DEG_TO_RAD;
  const a = Math.cos(eta) * Math.cos(pluto.B) * Math.sin(pi - pluto.L) - Math.sin(eta) * Math.sin(pluto.B);
  const b = Math.cos(pluto.B) * Math.cos(pi - pluto.L);
  const c = Math.cos(eta) * Math.sin(pluto.B) + Math.sin(eta) * Math.cos(pluto.B) * Math.sin(pi - pluto.L);
  pluto.L = p + pi - Math.atan2(a, b);
  pluto.B = Math.asin(c);`;
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review celestine Pluto frame patch");
  writeFileSync(file, source.replace(before, after));
}

for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const references = ["timeData", "calculatedData"];
  const calendarBefore = "  const julianDate2 = toJulianDate(utcDateTime);";
  const calendarAfter = `  // The product's datetime-local input uses a proleptic Gregorian calendar.
  const utc = new Date(0);
  utc.setUTCFullYear(utcDateTime.year, utcDateTime.month - 1, utcDateTime.day);
  utc.setUTCHours(utcDateTime.hour, utcDateTime.minute, utcDateTime.second, 0);
  const julianDate2 = utc.getTime() / 86400000 + 2440587.5;`;
  if (!source.includes(calendarAfter) && source.split(calendarBefore).length !== 2) {
    throw new Error("Review celestine civil calendar patch");
  }
  let patched = source.includes(calendarAfter) ? source : source.replace(calendarBefore, calendarAfter);
  for (const reference of references) {
    const before = `calculatePlanetPositions(${reference}.julianDate, mergedOptions)`;
    const after = `calculatePlanetPositions(utToTT(${reference}.julianDate, ${reference}.utcDateTime.year, ${reference}.utcDateTime.month), mergedOptions)`;
    if (patched.includes(after)) continue;
    if (patched.split(before).length !== 2) throw new Error("Review celestine planetary time scale patch");
    patched = patched.replace(before, after);
  }
  if (patched !== source) writeFileSync(file, patched);
}

for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const start = source.indexOf("function getTrueNodeLongitude(jd) {");
  const end = source.indexOf("function getTrueNode(jd) {", start);
  const replacement = `function getTrueNodeLongitude(jd) {
  // Ascending intersection of the instantaneous lunar orbital plane and ecliptic.
  const position = (epoch) => {
    const moon = getMoonPosition(epoch, { includeSpeed: false });
    const lon = moon.longitude * DEG_TO_RAD;
    const lat = moon.latitude * DEG_TO_RAD;
    const projected = moon.distance * Math.cos(lat);
    return [projected * Math.cos(lon), projected * Math.sin(lon), moon.distance * Math.sin(lat)];
  };
  const [x, y, z] = position(jd);
  const before = position(jd - 0.001);
  const after = position(jd + 0.001);
  const [dx, dy, dz] = after.map((value, i) => value - before[i]);
  const nodeX = x * dz - z * dx;
  const nodeY = y * dz - z * dy;
  return (Math.atan2(nodeY, nodeX) * RAD_TO_DEG + 360) % 360;
}
`;
  if (source.includes(replacement)) continue;
  if (start < 0 || end <= start || !source.slice(start, end).includes("const perturbations =")) {
    throw new Error("Review celestine true node patch");
  }
  writeFileSync(file, source.slice(0, start) + replacement + source.slice(end));
}

// Keep Porphyry quadrants in zodiac order where the horizon axis reverses.
// Placidus is valid below the polar circle, not merely below 66 degrees. Defer
// that check until the chart date supplies its obliquity; signal failed
// convergence so the chart layer can label its actual Porphyry fallback.
for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  let source = readFileSync(file, "utf8");
  const validationBefore = `  if (LATITUDE_SENSITIVE_SYSTEMS.includes(requestedSystem)) {
    if (absLatitude > MAX_LATITUDE_PLACIDUS2) {`;
  const validationAfter = `  if (LATITUDE_SENSITIVE_SYSTEMS.includes(requestedSystem)) {
    if (requestedSystem !== "placidus" && absLatitude > MAX_LATITUDE_PLACIDUS2) {`;
  const calculationAfter = `  if (LATITUDE_SENSITIVE_SYSTEMS.includes(requestedSystem)) {
    if (requestedSystem === "placidus" ? absLatitude >= 90 - meanObliquity(T) : absLatitude > MAX_LATITUDE_PLACIDUS2) {`;
  const chartMarker = "function calculateChartHouses(location, lst, T, requestedSystem) {";
  const validationMarker = "function validateChartOptions(options, latitude) {";
  const replaceWithin = (marker, before, after) => {
    const start = source.indexOf(marker);
    if (start < 0) throw new Error(`Missing celestine section: ${marker}`);
    const index = source.indexOf(before, start);
    if (source.startsWith(after, index)) return;
    if (index < 0 || index - start > 1000) {
      if (source.indexOf(after, start) >= start && source.indexOf(after, start) - start < 1000) return;
      throw new Error(`Review celestine Placidus latitude patch: ${marker}`);
    }
    source = source.slice(0, index) + after + source.slice(index + before.length);
  };
  replaceWithin(chartMarker, validationBefore, calculationAfter);
  replaceWithin(validationMarker, validationBefore, validationAfter);
  const placidusStart = source.indexOf("function placidusHouses(ascendant, midheaven, latitude, obliquity) {");
  const placidusEnd = source.indexOf("// src/houses/house-systems/regiomontanus.ts", placidusStart);
  if (placidusStart < 0 || placidusEnd < 0) throw new Error("Missing celestine Placidus section");
  let section = source.slice(placidusStart, placidusEnd);
  const beforeFallback = "return porphyryHouses(asc, mc);";
  const afterFallback = 'throw new Error("Placidus unavailable; use chart-level fallback");';
  if (section.includes(beforeFallback)) {
    if (section.split(beforeFallback).length !== 3) throw new Error("Review celestine Placidus fallback patch");
    section = section.replaceAll(beforeFallback, afterFallback);
    source = source.slice(0, placidusStart) + section + source.slice(placidusEnd);
  } else if (section.split(afterFallback).length !== 3) throw new Error("Missing celestine Placidus fallback patch");
  writeFileSync(file, source);
}
for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = `    case "porphyry":
      cusps = porphyryHouses(angles.ascendant, angles.midheaven);`;
  const after = `    case "porphyry":
      if (normalizeAngle8(angles.ascendant - angles.midheaven) > 180) {
        [angles.ascendant, angles.descendant] = [angles.descendant, angles.ascendant];
      }
      cusps = porphyryHouses(angles.ascendant, angles.midheaven);`;
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review celestine polar Porphyry patch");
  writeFileSync(file, source.replace(before, after));
}
// Keep sect tied to the horizon intersection before the Porphyry axis adjustment.
for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = "  const isDaytime = sunPos ? calculateIsDaytime(sunPos.longitude, houseResult.angles.ascendant.longitude) : timeData.isDaytime;";
  const after = `  const horizonAscendant = calculateAscendant(timeData.localSiderealTime, meanObliquity(timeData.julianCenturies), birth.latitude);
  const isDaytime = sunPos ? calculateIsDaytime(sunPos.longitude, horizonAscendant) : timeData.isDaytime;`;
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review celestine polar sect patch");
  writeFileSync(file, source.replace(before, after));
}
// Use the same polar axis convention for the Whole Sign fallback.
for (const format of ["js", "cjs"]) {
  const file = new URL("../node_modules/celestine/dist/index." + format, import.meta.url);
  const source = readFileSync(file, "utf8");
  const before = `    case "whole-sign":
      cusps = wholeSignHouses(angles.ascendant);`;
  const after = `    case "whole-sign":
      if (normalizeAngle8(angles.ascendant - angles.midheaven) > 180) {
        [angles.ascendant, angles.descendant] = [angles.descendant, angles.ascendant];
      }
      cusps = wholeSignHouses(angles.ascendant);`;
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error("Review celestine polar Whole Sign patch");
  writeFileSync(file, source.replace(before, after));
}
