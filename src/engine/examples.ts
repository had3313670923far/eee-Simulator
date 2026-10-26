import type { Placed, Wire } from "../components/Canvas";
import type { Inputs } from "./solver";
import { STARTER_SIZE } from "../data/starDeltaLayout";
import { getTerminals, termPos } from "../data/terminals";
import { normalizeSensorWires } from "../data/sensorContacts";

const R = "#ef4444";
const Y = "#eab308";
const B = "#3b82f6";
const N = "#60a5fa";
const W = "#cbd5e1";

export type StepCtx = {
  inputs: Inputs;
  onItems: Set<string>;
  hotItems?: Set<string>;
};

export type Step = {
  en: string;
  ar: string;
  check: (c: StepCtx) => boolean;
};

export type Example = {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  steps: Step[];
  build: () => { items: Placed[]; wires: Wire[] };
};

function builder() {
  let n = 0;
  const items: Placed[] = [];
  const wires: Wire[] = [];
  const item = (
    uid: string,
    id: string,
    x: number,
    y: number,
    color?: string,
    size?: { w: number; h: number },
    skin?: Placed["skin"]
  ) => items.push({ uid, id, x, y, color, w: size?.w, h: size?.h, skin });
  const wire = (
    a: string,
    b: string,
    color?: string,
    routing?: Pick<Wire, "via" | "routeMode" | "previewColor" | "hidden">
  ) => wires.push(...normalizeSensorWires(items, [{ uid: `exw-${n++}`, a, b, color, ...routing }]));
  return { items, wires, item, wire };
}

/* 1 — DOL direct-on-line starter with seal-in + overload NC */
const dol = (): Example => ({
  id: "dol",
  nameEn: "DOL Direct Starter",
  nameAr: "تشغيل مباشر DOL",
  descEn: "3-phase source → MCB → contactor → overload → motor, with START/STOP seal-in control circuit.",
  descAr: "مصدر 3 فاز → قاطع → كونتاكتور → أوفرلود → موتور، مع زراري تشغيل/إيقاف وتثبيت (سيل-إن).",
  steps: [
    { en: "Press Run, then hold the green START button", ar: "اضغط Run ثم زر التشغيل الأخضر", check: (c) => c.inputs.pressed.has("start") },
    { en: "Contactor pulls in and the motor starts spinning", ar: "الكونتاكتور يكبس والموتور يدور", check: (c) => c.onItems.has("km") && c.onItems.has("mot") },
    { en: "Release START — the 13-14 auxiliary keeps it sealed", ar: "اترك الزر — نقطة 13-14 تثبّت الدائرة", check: (c) => !c.inputs.pressed.has("start") && c.onItems.has("mot") },
    { en: "Press red STOP — the motor halts", ar: "اضغط الإيقاف الأحمر — يتوقف الموتور", check: (c) => c.inputs.pressed.has("stop") && !c.onItems.has("mot") },
    { en: "Start again, then click the overload to TEST-trip it", ar: "شغّل ثم اضغط الأوفرلود للتجربة", check: (c) => c.inputs.tripped.has("ol") && !c.onItems.has("mot") },
  ],
  build: () => {
    const c = builder();
    c.item("src", "src-3ph", 60, 60);
    c.item("mcb", "mcb-3", 250, 60, R);
    c.item("km", "ct1", 440, 60);
    c.item("ol", "overload", 630, 60);
    c.item("mot", "motor3", 820, 64);
    c.item("neu", "n", 60, 340);
    c.item("stop", "pb-nc", 250, 340);
    c.item("start", "pb-no", 430, 340);

    c.wire("src::B1", "mcb::T1", R);
    c.wire("src::B2", "mcb::T2", Y);
    c.wire("src::B3", "mcb::T3", B);
    c.wire("mcb::B1", "km::T1", R);
    c.wire("mcb::B2", "km::T2", Y);
    c.wire("mcb::B3", "km::T3", B);
    c.wire("km::B1", "ol::T1", R);
    c.wire("km::B2", "ol::T2", Y);
    c.wire("km::B3", "ol::T3", B);
    c.wire("ol::B1", "mot::T1", R);
    c.wire("ol::B2", "mot::T2", Y);
    c.wire("ol::B3", "mot::T3", B);

    c.wire("mcb::B1", "stop::T1", R);
    c.wire("stop::B1", "start::T1", W);
    c.wire("km::S13", "stop::B1", W);
    c.wire("start::B1", "ol::NC1", W);
    c.wire("km::S14", "ol::NC1", W);
    c.wire("ol::NC2", "km::A1", W);
    c.wire("km::A2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 2 — Forward / Reverse with electrical interlock */
const reverse = (): Example => ({
  id: "reverse",
  nameEn: "Forward / Reverse",
  nameAr: "عكس اتجاه المحرك",
  descEn: "Two contactors swap two phases; NC auxiliary contacts electrically interlock both directions.",
  descAr: "كونتاكتوران يبدّلان فازين، مع قفل كهربائي متبادل بنقاط NC.",
  steps: [
    { en: "Hold FORWARD — motor runs forward", ar: "اضغط أمامي — يدور الموتور", check: (c) => c.inputs.pressed.has("fwd") && c.onItems.has("km1") },
    { en: "Release — forward stays sealed in", ar: "اترك — يستمر الأمامي بالتثبيت", check: (c) => c.onItems.has("km1") && !c.inputs.pressed.has("fwd") },
    { en: "Press STOP first", ar: "اضغط إيقاف أولاً", check: (c) => c.inputs.pressed.has("stop") && !c.onItems.has("mot") },
    { en: "Now hold REVERSE — phase order swaps", ar: "اضغط خلفي — يتبادل الفازان", check: (c) => c.inputs.pressed.has("rev") && c.onItems.has("km2") },
  ],
  build: () => {
    const c = builder();
    c.item("src", "src-3ph", 60, 60);
    c.item("mcb", "mcb-3", 230, 60, R);
    c.item("km1", "ct1", 400, 60);
    c.item("ol", "overload", 640, 60);
    c.item("mot", "motor3", 830, 64);
    c.item("km2", "ct1", 400, 250);
    c.item("neu", "n", 60, 470);
    c.item("stop", "pb-nc", 190, 470);
    c.item("fwd", "pb-no", 330, 470);
    c.item("rev", "pb-no", 470, 470);

    c.wire("src::B1", "mcb::T1", R);
    c.wire("src::B2", "mcb::T2", Y);
    c.wire("src::B3", "mcb::T3", B);
    [1, 2, 3].forEach((i) => {
      c.wire(`mcb::B${i}`, `km1::T${i}`, [R, Y, B][i - 1]);
      c.wire(`mcb::B${i}`, `km2::T${i}`, [R, Y, B][i - 1]);
    });
    c.wire("km1::B1", "ol::T1", R);
    c.wire("km1::B2", "ol::T2", Y);
    c.wire("km1::B3", "ol::T3", B);
    c.wire("km2::B1", "ol::T3", R);
    c.wire("km2::B2", "ol::T2", Y);
    c.wire("km2::B3", "ol::T1", B);
    c.wire("ol::B1", "mot::T1", R);
    c.wire("ol::B2", "mot::T2", Y);
    c.wire("ol::B3", "mot::T3", B);

    c.wire("mcb::B1", "stop::T1", R);
    c.wire("stop::B1", "fwd::T1", W);
    c.wire("stop::B1", "rev::T1", W);
    c.wire("km1::S13", "stop::B1", W);
    c.wire("km2::S13", "stop::B1", W);
    c.wire("fwd::B1", "km2::S11", W);
    c.wire("km2::S12", "km1::A1", W);
    c.wire("rev::B1", "km1::S11", W);
    c.wire("km1::S12", "km2::A1", W);
    c.wire("km1::S14", "fwd::B1", W);
    c.wire("km2::S14", "rev::B1", W);
    c.wire("km1::A2", "neu::B1", N);
    c.wire("km2::A2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 3 — Automatic Star-Delta with on-delay timer */
const starDelta = (): Example => ({
  id: "stardelta",
  nameEn: "Automatic Star-Delta",
  nameAr: "ستار دلتا أوتوماتيك",
  descEn: "Main contactor seals in, the motor starts in star, and a timer switches it to delta ~2.5 s later.",
  descAr: "الكونتاكتور الرئيسي يثبت، الموتور يبدأ ستار، ثم المؤقت يحوّله دلتا بعد 2.5 ثانية.",
  steps: [
    { en: "Hold START — main + star contactors pull in", ar: "اضغط التشغيل — الرئيسي والستار يكبسان", check: (c) => c.onItems.has("km") && c.onItems.has("ky") && !c.onItems.has("kd") },
    { en: "Motor runs in STAR (reduced current)", ar: "الموتور يعمل ستار (تيار أقل)", check: (c) => c.onItems.has("mot") && c.onItems.has("ky") },
    { en: "After ~2.5 s the timer switches to DELTA", ar: "بعد 2.5 ثانية يحوّل المؤقت إلى دلتا", check: (c) => c.onItems.has("kd") && !c.onItems.has("ky") },
    { en: "Press STOP — sequence ends", ar: "اضغط إيقاف — تنتهي الدورة", check: (c) => c.inputs.pressed.has("stop") && !c.onItems.has("mot") },
  ],
  build: () => {
    const c = builder();
    c.item("src", "src-3ph", 40, 40);
    c.item("mcb", "mcb-3", 210, 40, R);
    c.item("km", "ct1", 380, 40);
    c.item("ol", "overload", 570, 40);
    c.item("mot", "motor3", 760, 44);
    c.item("kd", "ct1", 380, 210);
    c.item("ky", "ct1", 570, 210);
    c.item("jun", "junction", 760, 220);
    c.item("tm", "timer-on", 210, 210);
    c.item("neu", "n", 40, 450);
    c.item("stop", "pb-nc", 210, 450);
    c.item("start", "pb-no", 380, 450);

    [1, 2, 3].forEach((i, k) => {
      const col = [R, Y, B][k];
      c.wire(`src::B${i}`, `mcb::T${i}`, col);
      c.wire(`mcb::B${i}`, `km::T${i}`, col);
      c.wire(`mcb::B${i}`, `kd::T${i}`, col); // delta contactor in parallel
      c.wire(`km::B${i}`, `ol::T${i}`, col);
      c.wire(`kd::B${i}`, `ol::T${i}`, col);
      c.wire(`ol::B${i}`, `mot::T${i}`, col);
      c.wire(`mot::T${i}`, `ky::T${i}`, col); // star shorting contactor
      c.wire(`ky::B${i}`, `jun::P${i + 2}`, W);
    });
    c.wire("jun::P1", "jun::P4", W);

    // control sequence
    c.wire("mcb::B1", "stop::T1", R);
    c.wire("stop::B1", "start::T1", W);
    c.wire("km::S13", "stop::B1", W);
    c.wire("km::S14", "start::B1", W);
    c.wire("start::B1", "km::A1", W);
    c.wire("km::A2", "neu::B1", N);
    c.wire("start::B1", "tm::A1", W);
    c.wire("tm::A2", "neu::B1", N);
    c.wire("tm::C1", "start::B1", W);
    c.wire("tm::C2", "kd::A1", W);
    c.wire("kd::A2", "neu::B1", N);
    c.wire("start::B1", "kd::S11", W); // delta NC gates the star coil
    c.wire("kd::S12", "ky::A1", W);
    c.wire("ky::A2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 4 — ON-delay timer switching a lamp */
const timerLamp = (): Example => ({
  id: "timer-lamp",
  nameEn: "Timer-Delayed Lamp",
  nameAr: "مصباح بمؤقت تأخير",
  descEn: "Turn the selector ON: the timer coil energizes and its NO contact closes ~2.5 s later, lighting the lamp.",
  descAr: "أدر المفتاح: يتغذى الملف، وتغلق نقطة NO بعد 2.5 ثانية فيضيء المصباح.",
  steps: [
    { en: "Click the selector switch to close it", ar: "اضغط مفتاح السيلكتور", check: (c) => c.inputs.on.has("sw") },
    { en: "The timer coil energizes (wait ~2.5 s)", ar: "يتغذى ملف المؤقت (انتظر 2.5 ثانية)", check: (c) => c.inputs.on.has("sw") && !c.onItems.has("lp") },
    { en: "The lamp switches ON automatically", ar: "يضيء المصباح تلقائياً", check: (c) => c.onItems.has("lp") },
    { en: "Click the selector again — lamp goes off", ar: "أوقف المفتاح — ينطفئ المصباح", check: (c) => !c.inputs.on.has("sw") && !c.onItems.has("lp") },
  ],
  build: () => {
    const c = builder();
    c.item("ph", "src-1ph", 60, 80);
    c.item("neu", "n", 60, 340);
    c.item("sw", "sel-onoff", 260, 80);
    c.item("tm", "timer-on", 460, 80);
    c.item("lp", "lamp", 660, 80);

    c.wire("ph::B1", "sw::T1", R);
    c.wire("sw::B1", "tm::A1", W);
    c.wire("tm::A2", "neu::B1", N);
    c.wire("ph::B1", "tm::C1", R);
    c.wire("tm::C2", "lp::B1", Y);
    c.wire("lp::B2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 5 — momentary push button lighting a lamp */
const pushLamp = (): Example => ({
  id: "push-lamp",
  nameEn: "Push-to-Light",
  nameAr: "زرار مع لمبة",
  descEn: "The simplest circuit: hold the green NO button and the lamp stays lit; release and it turns off.",
  descAr: "أبسط دائرة: اضغط الزرار الأخضر فيضيء المصباح، واتركه ينطفئ.",
  steps: [
    { en: "Press and hold the green button", ar: "اضغط وابقَ على الزرار الأخضر", check: (c) => c.inputs.pressed.has("btn") },
    { en: "The lamp lights while held", ar: "المصباح مضيء أثناء الضغط", check: (c) => c.onItems.has("lp") },
    { en: "Release — the lamp switches off", ar: "اترك الزرار — ينطفئ المصباح", check: (c) => !c.inputs.pressed.has("btn") && !c.onItems.has("lp") },
  ],
  build: () => {
    const c = builder();
    c.item("ph", "src-1ph", 60, 120);
    c.item("neu", "n", 60, 360);
    c.item("btn", "pb-no", 280, 120);
    c.item("lp", "lamp", 500, 120);

    c.wire("ph::B1", "btn::T1", R);
    c.wire("btn::B1", "lp::B1", Y);
    c.wire("lp::B2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 6 — start/stop from multiple locations */
const multiStart = (): Example => ({
  id: "multi-start",
  nameEn: "Start from Two Places",
  nameAr: "تشغيل من عدة أماكن",
  descEn: "Two NO start buttons wired in parallel and two NC stops in series control one contactor.",
  descAr: "زراران NO على التوازي للتشغيل وزراران NC على التوالي للإيقاف، تتحكم بكونتاكتور واحد.",
  steps: [
    { en: "Hold START at location 1 — motor runs", ar: "اضغط تشغيل من المكان 1", check: (c) => c.inputs.pressed.has("st1") && c.onItems.has("mot") },
    { en: "It stays sealed after release", ar: "يبقى ثابتاً بعد الإفلات", check: (c) => c.onItems.has("mot") && !c.inputs.pressed.has("st1") },
    { en: "Hold START at location 2 — still runs", ar: "جرّب تشغيل المكان 2", check: (c) => c.inputs.pressed.has("st2") && c.onItems.has("mot") },
    { en: "Either STOP button halts the motor", ar: "أي زر إيقاف يوقف الموتور", check: (c) => (c.inputs.pressed.has("sp1") || c.inputs.pressed.has("sp2")) && !c.onItems.has("mot") },
  ],
  build: () => {
    const c = builder();
    c.item("src", "src-3ph", 60, 40);
    c.item("mcb", "mcb-3", 240, 40, R);
    c.item("km", "ct1", 430, 40);
    c.item("ol", "overload", 620, 40);
    c.item("mot", "motor3", 810, 44);
    c.item("neu", "n", 60, 400);
    c.item("sp1", "pb-nc", 200, 400);
    c.item("sp2", "pb-nc", 330, 400);
    c.item("st1", "pb-no", 470, 400);
    c.item("st2", "pb-no", 600, 400);

    [1, 2, 3].forEach((i, k) => {
      const col = [R, Y, B][k];
      c.wire(`src::B${i}`, `mcb::T${i}`, col);
      c.wire(`mcb::B${i}`, `km::T${i}`, col);
      c.wire(`km::B${i}`, `ol::T${i}`, col);
      c.wire(`ol::B${i}`, `mot::T${i}`, col);
    });

    c.wire("mcb::B1", "sp1::T1", R);
    c.wire("sp1::B1", "sp2::T1", W); // stops in series
    c.wire("sp2::B1", "st1::T1", W);
    c.wire("sp2::B1", "st2::T1", W);
    c.wire("km::S13", "sp2::B1", W);
    c.wire("st1::B1", "ol::NC1", W); // starts in parallel
    c.wire("st2::B1", "ol::NC1", W);
    c.wire("km::S14", "ol::NC1", W);
    c.wire("ol::NC2", "km::A1", W);
    c.wire("km::A2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 7 — water tank level control with float switch */
const levelControl = (): Example => ({
  id: "level",
  nameEn: "Water Level Control",
  nameAr: "تحكم بمستوى السائل",
  descEn: "When the tank fills, the float switch closes and the pump contactor runs; when it drops, the pump stops.",
  descAr: "عند امتلاء الخزان يغلق العوام فيعمل كونتاكتور الطلمبة، وعند انخفاض المستوى يتوقف.",
  steps: [
    { en: "Click the float switch: COM moves to NO", ar: "اضغط العوامة: تنتقل COM إلى NO", check: (c) => c.inputs.on.has("fl") },
    { en: "Contactor pulls in and the pump runs", ar: "الكونتاكتور يكبس والطلمبة تعمل", check: (c) => c.inputs.on.has("fl") && c.onItems.has("pump") },
    { en: "Click again: COM returns to NC and the pump stops", ar: "اضغط مرة أخرى: تعود COM إلى NC وتتوقف المضخة", check: (c) => !c.inputs.on.has("fl") && !c.onItems.has("pump") },
  ],
  build: () => {
    const c = builder();
    c.item("ph", "src-1ph", 60, 80);
    c.item("neu", "n", 60, 360);
    c.item("mcb", "mcb-2", 230, 80, B);
    c.item("fl", "float", 430, 300);
    c.item("km", "ct2", 430, 80);
    c.item("pump", "motor1", 640, 80);

    c.wire("ph::B1", "mcb::T1", R);
    c.wire("neu::B1", "mcb::T2", N);
    c.wire("mcb::B1", "km::T1", R);
    c.wire("mcb::B2", "km::T2", N);
    c.wire("km::B1", "pump::T1", R);
    c.wire("km::B2", "pump::T2", N);

    c.wire("mcb::B1", "fl::COM", R);
    c.wire("fl::NO", "km::A1", W);
    c.wire("km::A2", "mcb::B2", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 8 — temperature alarm: red light + buzzer */
const alarm = (): Example => ({
  id: "alarm",
  nameEn: "Over-Temperature Alarm",
  nameAr: "إنذار ارتفاع الحرارة",
  descEn: "When the temperature switch closes, the red beacon flashes and the buzzer sounds together.",
  descAr: "عند إغلاق مفتاح الحرارة يعمل الضوء الأحمر الوامض والبيزر معاً.",
  steps: [
    { en: "Click the temperature switch to simulate overheat", ar: "اضغط مفتاح الحرارة", check: (c) => c.inputs.on.has("ts") },
    { en: "Red beacon AND buzzer activate", ar: "الضوء الأحمر والبيزر يعملان", check: (c) => c.onItems.has("lp") && c.onItems.has("bz") },
    { en: "Click it again — alarm silences", ar: "اضغط مرة أخرى — يسكت الإنذار", check: (c) => !c.inputs.on.has("ts") && !c.onItems.has("lp") },
  ],
  build: () => {
    const c = builder();
    c.item("ph", "src-1ph", 80, 120);
    c.item("neu", "n", 80, 380);
    c.item("ts", "temp", 300, 120);
    c.item("lp", "light-red", 520, 60);
    c.item("bz", "buzzer", 520, 220);

    c.wire("ph::B1", "ts::COM", R);
    c.wire("ts::NO", "lp::B1", Y);
    c.wire("ts::NO", "bz::B1", Y);
    c.wire("lp::B2", "neu::B1", N);
    c.wire("bz::B2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 9 — manual source/generator changeover with interlock */
const changeover = (): Example => ({
  id: "changeover",
  nameEn: "Source / Generator Changeover",
  nameAr: "تبديل المصدر والمولّد",
  descEn: "Two interlocked contactors select either the grid or the generator — both can never close together.",
  descAr: "كونتاكتوران متشابكان يختاران الشبكة أو المولّد، ولا يمكن أن يعملا معاً.",
  steps: [
    { en: "Hold GRID — the motor runs from the mains", ar: "اضغط الشبكة — يعمل من المصدر الرئيسي", check: (c) => c.inputs.pressed.has("b1") && c.onItems.has("k1") },
    { en: "Press STOP before changing source", ar: "أوقف قبل تبديل المصدر", check: (c) => c.inputs.pressed.has("stop") && !c.onItems.has("mot") },
    { en: "Hold GENERATOR — it runs from the generator", ar: "اضغط المولّد — يعمل من المولّد", check: (c) => c.inputs.pressed.has("b2") && c.onItems.has("k2") },
  ],
  build: () => {
    const c = builder();
    c.item("grid", "src-3ph", 40, 40);
    c.item("gen", "gen", 40, 210);
    c.item("c1", "mcb-3", 220, 40, R);
    c.item("c2", "mcb-3", 220, 210, Y);
    c.item("k1", "ct1", 410, 40);
    c.item("k2", "ct1", 410, 210);
    c.item("ol", "overload", 630, 40);
    c.item("mot", "motor3", 820, 44);
    c.item("neu", "n", 40, 470);
    c.item("stop", "pb-nc", 190, 470);
    c.item("b1", "pb-no", 330, 470);
    c.item("b2", "pb-no", 470, 470);

    [1, 2, 3].forEach((i, k) => {
      const col = [R, Y, B][k];
      c.wire(`grid::B${i}`, `c1::T${i}`, col);
      c.wire(`gen::B${i}`, `c2::T${i}`, col);
      c.wire(`c1::B${i}`, `k1::T${i}`, col);
      c.wire(`c2::B${i}`, `k2::T${i}`, col);
      c.wire(`k1::B${i}`, `ol::T${i}`, col);
      c.wire(`k2::B${i}`, `ol::T${i}`, col);
    });
    c.wire("ol::B1", "mot::T1", R);
    c.wire("ol::B2", "mot::T2", Y);
    c.wire("ol::B3", "mot::T3", B);

    c.wire("c1::B1", "stop::T1", R);
    c.wire("stop::B1", "b1::T1", W);
    c.wire("stop::B1", "b2::T1", W);
    c.wire("k1::S13", "stop::B1", W);
    c.wire("k2::S13", "stop::B1", W);
    c.wire("b1::B1", "k2::S11", W);
    c.wire("k2::S12", "k1::A1", W);
    c.wire("b2::B1", "k1::S11", W);
    c.wire("k1::S12", "k2::A1", W);
    c.wire("k1::S14", "b1::B1", W);
    c.wire("k2::S14", "b2::B1", W);
    c.wire("k1::A2", "neu::B1", N);
    c.wire("k2::A2", "neu::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

/* 0 — realistic distribution box with main C63, RCD 40A and six MCBs */
const distribution = (): Example => ({
  id: "distribution",
  nameEn: "Distribution Box",
  nameAr: "صندوق توزيع",
  descEn: "Photo-style consumer unit: C63 main → RCD 40A → A/B screw busbars → six MCB circuits fed through coloured terminal blocks.",
  descAr: "لوحة توزيع واقعية: قاطع رئيسي C63 → RCD 40A → بسبارات A/B بمسامير → ست قواطع عبر ترمنالات ملونة.",
  steps: [
    { en: "Press Run — the board energizes and sky-blue current flows", ar: "اضغط Run — تتغذى اللوحة ويسري التيار", check: () => true },
    { en: "Click any C10/C16/C25 breaker to open that circuit", ar: "اضغط أي قاطع C ليفصل التيار", check: (c) => c.inputs.off.size > 0 },
    { en: "Click it again to close and restore the circuit", ar: "اضغطه مرة أخرى لإعادة التيار", check: (c) => c.inputs.off.size === 0 },
    { en: "Open the main C63 breaker — every circuit goes cold", ar: "افصل القاطع الرئيسي C63 — تنطفئ كل الدوائر", check: (c) => c.inputs.off.has("m63") },
  ],
  build: () => {
    const c = builder();
    const SKY = "#6cc6ff";

    /* backplate */
    c.item("panel", "dist-panel", 80, 150, undefined, { w: 720, h: 430 });

    /* busbars A (top) and B (bottom) */
    c.item("railA", "rail-bar", 200, 235, undefined, { w: 520, h: 56 });
    c.item("railB", "rail-bar", 170, 480, undefined, { w: 560, h: 56 });

    /* incoming N / L / PE (N to left pole, L1 to right pole) */
    c.item("inL", "src-1ph", 196, 108);
    c.item("inN", "n", 110, 108);
    c.item("inPE", "pe", 282, 108);

    /* main 2P C63 and RCD */
    c.item("m63", "mcb-2", 150, 300, undefined, { w: 92, h: 120 });
    c.item("rcd", "rcd-40", 262, 300, undefined, { w: 150, h: 120 });

    /* six branch MCBs */
    const mcbIds = ["b1", "b2", "b3", "b4", "b5", "b6"];
    mcbIds.forEach((id, i) => c.item(id, "mcb-1", 440 + i * 58, 300, undefined, { w: 58, h: 120 }));

    /* coloured terminal blocks above the box */
    const tbIds = ["tbN", "tbG", "tbA", "tbR", "tbB", "tbY"];
    const tbParts = ["tb-blue", "tb-green", "tb-amber", "tb-red", "tb-blue", "tb-amber"];
    tbIds.forEach((id, i) => c.item(id, tbParts[i], 442 + i * 58, 8, undefined, { w: 54, h: 88 }));

    /* incoming to main (N left pole, L right pole) */
    c.wire("inN::B1", "m63::T1", SKY);
    c.wire("inL::B1", "m63::T2", SKY);
    c.wire("inPE::B1", "railA::T2", SKY);

    /* main to RCD */
    c.wire("m63::B1", "rcd::T1", SKY);
    c.wire("m63::B2", "rcd::T2", SKY);

    /* RCD to bars */
    c.wire("rcd::B1", "railA::T3", SKY);
    c.wire("rcd::B2", "railB::T3", SKY);

    /* A bar feeds each coloured block; blocks feed MCB tops */
    const aScrews = ["T6", "T7", "T8", "T9", "T10", "T11"];
    tbIds.forEach((tb, i) => {
      c.wire(`railA::${aScrews[i]}`, `${tb}::B1`, SKY);
      c.wire(`${tb}::B1`, `${mcbIds[i]}::T1`, SKY);
    });

    /* MCB bottoms to B bar */
    const bScrews = ["T6", "T7", "T8", "T9", "T10", "T11"];
    mcbIds.forEach((m, i) => {
      c.wire(`${m}::B1`, `railB::${bScrews[i]}`, SKY);
    });

    return { items: c.items, wires: c.wires };
  },
});

/* 10 — automatic water pump: float switch drives a contactor, pilot shows run */
const pumpAuto = (): Example => ({
  id: "pump-auto",
  nameEn: "Automatic Water Pump",
  nameAr: "طلمبة مياه أوتوماتيك",
  descEn: "A float switch energizes a 2-pole contactor that runs the pump; a green pilot mirrors the coil while current flows through every cable.",
  descAr: "عوامة تُغذّي كونتاكتور 2P يُشغّل الطلمبة، ولمبة خضراء تتابع الملف ويظهر التيار في كل كابل.",
  steps: [
    { en: "Press Run — power reaches the main breaker", ar: "اضغط Run — التيار يصل القاطع", check: (c) => !!c.hotItems?.size },
    { en: "Click the float switch (water level reached)", ar: "اضغط العوامة (وصل المستوى)", check: (c) => c.inputs.on.has("fl") },
    { en: "Contactor pulls in, pump spins and pilot lights", ar: "الكونتاكتور يكبس، الطلمبة تدور واللمبة تضيء", check: (c) => c.onItems.has("km") && c.onItems.has("pump") && c.onItems.has("run") },
    { en: "Click again — everything stops", ar: "اضغط مرة أخرى — يتوقف كل شيء", check: (c) => !c.inputs.on.has("fl") && !c.onItems.has("pump") },
  ],
  build: () => {
    const c = builder();
    const SKY = "#6cc6ff";
    c.item("ph", "src-1ph", 60, 60);
    c.item("neu", "n", 60, 330);
    c.item("m2", "mcb-2", 250, 60, B);
    c.item("km", "ct2", 440, 60);
    c.item("pump", "motor1", 640, 64);
    c.item("fl", "float", 250, 300);
    c.item("run", "light-green", 440, 300);

    // power path
    c.wire("ph::B1", "m2::T1", SKY);
    c.wire("neu::B1", "m2::T2", SKY);
    c.wire("m2::B1", "km::T1", SKY);
    c.wire("m2::B2", "km::T2", SKY);
    c.wire("km::B1", "pump::T1", SKY);
    c.wire("km::B2", "pump::T2", SKY);

    // control: L → float → coil → N
    c.wire("m2::B1", "fl::COM", SKY);
    c.wire("fl::NO", "km::A1", SKY);
    c.wire("km::A2", "m2::B2", SKY);

    // run lamp mirrors the coil
    c.wire("fl::NO", "run::B1", SKY);
    c.wire("run::B2", "m2::B2", SKY);
    return { items: c.items, wires: c.wires };
  },
});

/* Panel-M assembly in the supplied reference: live six-lead star/delta wiring. */
const starDeltaPanel = (): Example => ({
  id: "three-phase-star-delta-starter",
  nameEn: "Three Phase Star Delta Starter",
  nameAr: "تشغيل ستار دلتا ثلاثي الطور",
  descEn: "A wired panel with main, star and delta contactors, timer, overload and door-mounted START/STOP controls.",
  descAr: "لوحة تشغيل كاملة: كونتاكتور رئيسي وستار ودلتا، مؤقت، أوفرلود وأزرار تشغيل وإيقاف.",
  steps: [
    { en: "Run: three phases reach the main breaker", ar: "اضغط Run حتى تصل الفازات إلى القاطع", check: (s) => !!s.hotItems?.has("breaker") },
    { en: "Hold the green START button on the door", ar: "اضغط زر START الأخضر", check: (s) => s.inputs.pressed.has("start") && s.onItems.has("km") },
    { en: "Release START: main and STAR remain latched", ar: "اترك الزر: الرئيسي والستار يستمران", check: (s) => !s.inputs.pressed.has("start") && s.onItems.has("km") && s.onItems.has("ky") },
    { en: "After 2.5 seconds, STAR releases and DELTA takes over", ar: "بعد 2.5 ثانية يفصل ستار ويعمل دلتا", check: (s) => s.onItems.has("kd") && !s.onItems.has("ky") && s.onItems.has("mot") },
    { en: "Hold STOP to open the control circuit", ar: "اضغط STOP لقطع دائرة التحكم", check: (s) => s.inputs.pressed.has("stop") && !s.onItems.has("mot") },
    { en: "Trip the overload to sound the alarm", ar: "اضغط الأوفرلود لتشغيل الإنذار", check: (s) => s.inputs.tripped.has("ol") && s.onItems.has("alarm") },
  ],
  build: () => {
    const c = builder();
    const r = "#ee454c";
    const y = "#f7ce39";
    const b = "#328fe9";
    const n = "#53caff";
    const phases = [r, y, b];
    const component = (uid: string, id: string, x: number, y: number, label?: string) => {
      c.item(uid, id, x, y, undefined, STARTER_SIZE[id], "starter");
      if (label) c.items[c.items.length - 1].name = label;
    };

    component("backdrop", "sd-panel", 0, 0);
    component("neutral", "n", 70, 48);
    component("source", "src-3ph", 114, 46);
    component("feed", "term4", 84, 190);
    component("neutralBus", "neutral-link", 337, 213);
    component("breaker", "mcb-3", 130, 316, "C63");
    component("phaseMonitor", "phasefail", 239, 318);
    component("timer", "timer-on", 300, 317);
    component("controlFuse", "fuse", 428, 320, "C6");
    component("ol", "overload", 81, 509);
    component("km", "ct1", 206, 509, "MAIN");
    component("ky", "ct1", 310, 509, "STAR");
    component("kd", "ct1", 414, 509, "DELTA");
    component("mot", "stardelta", 271, 778);
    component("supplyLamp", "light-green", 578, 340);
    component("runLamp", "light-red", 640, 340);
    component("alarm", "light-orange", 703, 340);
    component("alarmBuzzer", "buzzer", 765, 340);
    component("start", "pb-no", 612, 492);
    component("stop", "pb-nc", 679, 492);

    const position = (key: string) => {
      const [uid, port] = key.split("::");
      const item = c.items.find((it) => it.uid === uid)!;
      const def = getTerminals(item.id).find((t) => t.id === port)!;
      return termPos(item, def);
    };
    const join = (a: string, dest: string, color: string, lane?: number) => {
      const p = position(a);
      const q = position(dest);
      c.wire(a, dest, color, {
        previewColor: color,
        routeMode: lane === undefined ? undefined : "row",
        via: lane === undefined ? undefined : [{ x: p.x, y: lane }, { x: q.x, y: lane }],
      });
    };
    const around = (a: string, dest: string, color: string, laneX: number) => {
      const p = position(a);
      const q = position(dest);
      c.wire(a, dest, color, {
        previewColor: color,
        routeMode: "column",
        via: [{ x: laneX, y: p.y }, { x: laneX, y: q.y }],
      });
    };

    // Incoming four-way distribution and protective earth.
    join("neutral::B1", "feed::T1", n, 177);
    for (let i = 1; i <= 3; i++) join(`source::B${i}`, `feed::T${i + 1}`, phases[i - 1], 179 + i * 4);
    join("feed::B1", "neutralBus::T1", n, 270);
    for (let i = 1; i <= 3; i++) join(`feed::B${i + 1}`, `breaker::T${i}`, phases[i - 1], 269 + i * 7);

    // Main and delta each receive a three-phase power feed.
    for (let i = 1; i <= 3; i++) {
      join(`breaker::B${i}`, `km::T${i}`, phases[i - 1], 465 + i * 8);
      join(`breaker::B${i}`, `kd::T${i}`, phases[i - 1], 445 + i * 9);
      join(`km::B${i}`, `ol::T${i}`, phases[i - 1], 691 + i * 5);
      join(`ol::B${i}`, `mot::T${i}`, phases[i - 1], 744 + i * 6);
      around(`mot::B${i}`, `ky::T${i}`, phases[i - 1], 519 + i * 9);
      join(`kd::B${i}`, `mot::B${(i % 3) + 1}`, phases[i - 1], 737 + i * 5);
    }
    // Copper links across the STAR output poles are inside the contactor body.
    c.wire("ky::B1", "ky::B2", undefined, { hidden: true });
    c.wire("ky::B2", "ky::B3", undefined, { hidden: true });

    // Fused, phase-monitored START/STOP control and main-contactor seal-in.
    join("breaker::B1", "controlFuse::T1", r, 310);
    join("controlFuse::B1", "phaseMonitor::T1", r, 470);
    join("phaseMonitor::B1", "stop::T1", r, 480);
    join("stop::B1", "start::T1", r, 600);
    join("start::B1", "ol::NC1", r, 604);
    join("ol::NC2", "km::A1", r, 681);
    join("km::S13", "stop::B1", r, 592);
    join("km::S14", "ol::NC1", r, 619);
    join("km::A2", "neutralBus::B2", n, 494);

    // Timer NC opens STAR at 2.5 s; NO closes DELTA via the STAR NC interlock.
    join("ol::NC2", "timer::A1", r, 469);
    join("timer::A2", "neutralBus::B3", n, 276);
    join("ol::NC2", "timer::NC1", r, 296);
    join("timer::NC2", "kd::S11", r, 489);
    join("kd::S12", "ky::A1", r, 679);
    join("ky::A2", "neutralBus::B4", n, 505);
    join("ol::NC2", "timer::C1", r, 291);
    join("timer::C2", "ky::S11", r, 496);
    join("ky::S12", "kd::A1", r, 690);
    join("kd::A2", "neutralBus::B1", n, 499);

    // Door-mounted pilot lamps, overload alarm, buzzer and return bus.
    join("breaker::B1", "supplyLamp::B1", r, 296);
    join("km::S14", "runLamp::B1", r, 302);
    join("breaker::B1", "ol::NO1", r, 482);
    join("ol::NO2", "alarm::B1", r, 485);
    join("ol::NO2", "alarmBuzzer::B1", r, 476);
    ["supplyLamp", "runLamp", "alarm", "alarmBuzzer"].forEach((uid, i) => {
      join("neutralBus::B4", `${uid}::B2`, n, 438 + i * 4);
    });

    return { items: c.items, wires: c.wires };
  },
});

const floatlessPump = (): Example => ({
  id: "floatless-pump",
  nameEn: "Floatless Pump Control",
  nameAr: "تحكم مضخة بمستوى الماء بدون عوامة",
  descEn: "C61F-GP-style 110V controller with grounded E3, high/low probes, a filling contactor and dry NO full-level indicator.",
  descAr: "متحكم مستوى C61F-GP يعمل على 110 فولت مع مجسات E1/E2 و E3 مؤرّض، وكونتاكتور مضخة وبيان امتلاء.",
  steps: [
    {
      en: "Press Run: the controller receives 110V and E3 is grounded",
      ar: "اضغط Run: المتحكم يتلقى 110 فولت و E3 مؤرّض",
      check: (ctx) => !!ctx.hotItems?.has("level"),
    },
    {
      en: "LOW: the NC filling contact runs the pump",
      ar: "المستوى منخفض: نقطة NC تشغل المضخة",
      check: (ctx) => (ctx.inputs.levels.get("level") ?? 0) === 0 && ctx.onItems.has("pump"),
    },
    {
      en: "Tap the controller: RISING holds the pump on",
      ar: "اضغط الجهاز: عند الارتفاع تستمر المضخة",
      check: (ctx) => ctx.inputs.levels.get("level") === 1 && ctx.onItems.has("pump"),
    },
    {
      en: "Tap again: HIGH opens NC and lights the NO full indicator",
      ar: "اضغط ثانية: عند الامتلاء تتوقف المضخة ويضيء البيان",
      check: (ctx) => ctx.inputs.levels.get("level") === 2 && !ctx.onItems.has("pump") && ctx.onItems.has("full"),
    },
    {
      en: "Tap through FALLING: pump remains off until LOW",
      ar: "عند الانخفاض تبقى المضخة متوقفة حتى تصل LOW",
      check: (ctx) => ctx.inputs.levels.get("level") === 3 && !ctx.onItems.has("pump"),
    },
    {
      en: "Tap to LOW: the filling cycle restarts",
      ar: "اضغط حتى LOW: تعود المضخة للعمل",
      check: (ctx) => ctx.inputs.levels.has("level") && ctx.inputs.levels.get("level") === 0 && ctx.onItems.has("pump"),
    },
  ],
  build: () => {
    const c = builder();
    c.item("ac", "src-110", 60, 100);
    c.item("neutral", "n", 60, 290);
    c.item("earth", "pe", 60, 485);
    c.item("breaker", "mcb-2", 255, 102);
    c.item("level", "floatless-level", 430, 140, undefined, { w: 168, h: 168 });
    c.item("high", "level-probe", 615, 35);
    c.item("low", "level-probe", 710, 35);
    c.item("common", "level-probe", 805, 35);
    c.items.find((it) => it.uid === "high")!.name = "E1 HIGH";
    c.items.find((it) => it.uid === "low")!.name = "E2 LOW";
    c.items.find((it) => it.uid === "common")!.name = "E3 COM";
    c.item("km", "ct2", 610, 292);
    c.item("pump", "motor1", 805, 300);
    c.item("fill", "light-green", 475, 415);
    c.item("full", "light-blue", 635, 415);

    c.wire("ac::B1", "breaker::T1", R);
    c.wire("neutral::B1", "breaker::T2", N);
    c.wire("breaker::B1", "level::S1", R);
    c.wire("breaker::B2", "level::S0", N);
    c.wire("level::E1", "high::T1", W);
    c.wire("level::E2", "low::T1", W);
    c.wire("level::E3", "common::T1", W);
    c.wire("common::B1", "earth::B1", "#16a34a");

    // The dry COM/NC contact closes at low level; the relay opens it at E1.
    c.wire("breaker::B1", "level::COM", R);
    c.wire("level::NC", "km::A1", W);
    c.wire("km::A2", "breaker::B2", N);
    c.wire("breaker::B1", "km::T1", R);
    c.wire("breaker::B2", "km::T2", N);
    c.wire("km::B1", "pump::T1", R);
    c.wire("km::B2", "pump::T2", N);
    c.wire("level::NC", "fill::B1", W);
    c.wire("fill::B2", "breaker::B2", N);
    c.wire("level::NO", "full::B1", W);
    c.wire("full::B2", "breaker::B2", N);
    return { items: c.items, wires: c.wires };
  },
});

const sensorChangeover = (): Example => ({
  id: "sensor-changeover",
  nameEn: "COM / NC / NO Sensor Test",
  nameAr: "تجربة أطراف الحساس COM / NC / NO",
  descEn: "A limit switch changes the live feed from its red NC indicator to its green NO indicator when clicked in Run.",
  descAr: "مفتاح حد ينقل التغذية من لمبة NC الحمراء إلى لمبة NO الخضراء عند الضغط عليه في المحاكاة.",
  steps: [
    {
      en: "Press Run: COM connects to NC and the red pilot lights",
      ar: "اضغط Run: تصل COM إلى NC فتضيء اللمبة الحمراء",
      check: (ctx) => !ctx.inputs.on.has("sensor") && ctx.onItems.has("normal"),
    },
    {
      en: "Click the limit switch: COM moves to NO and green lights",
      ar: "اضغط الحساس: تنتقل COM إلى NO فتضيء الخضراء",
      check: (ctx) => ctx.inputs.on.has("sensor") && ctx.onItems.has("detected") && !ctx.onItems.has("normal"),
    },
    {
      en: "Click again to restore the NC circuit",
      ar: "اضغط مرة أخرى لاستعادة دائرة NC",
      check: (ctx) => !ctx.inputs.on.has("sensor") && ctx.onItems.has("normal") && !ctx.onItems.has("detected"),
    },
  ],
  build: () => {
    const c = builder();
    c.item("phase", "src-1ph", 65, 110);
    c.item("neutral", "n", 65, 330);
    c.item("sensor", "limit", 280, 145, undefined, { w: 102, h: 100 });
    c.item("normal", "light-red", 495, 90);
    c.item("detected", "light-green", 495, 285);

    c.wire("phase::B1", "sensor::COM", R);
    c.wire("sensor::NC", "normal::B1", R);
    c.wire("sensor::NO", "detected::B1", W);
    c.wire("normal::B2", "neutral::B1", N);
    c.wire("detected::B2", "neutral::B1", N);
    return { items: c.items, wires: c.wires };
  },
});

export const EXAMPLES: Example[] = [
  starDeltaPanel(),
  distribution(),
  dol(),
  pumpAuto(),
  reverse(),
  starDelta(),
  timerLamp(),
  pushLamp(),
  multiStart(),
  levelControl(),
  alarm(),
  changeover(),
  floatlessPump(),
  sensorChangeover(),
];
