import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { speakEvangel } from "../services/evangelVoice";
import { CSS2DObject, CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import ConvertNoteActions from "./ConvertNoteActions";

export const NEIGHBORHOODS = {
  verse: { center: [-5.4, 1.8, 0], color: 0xf5c542, label: "Scripture" },
  highlight: { center: [-4.1, -2.5, 0.8], color: 0xeacb67, label: "Highlights" },
  prayer: { center: [0, 3.8, -0.4], color: 0xf0a7bd, label: "Prayer" },
  answered_prayer: { center: [2.7, 3.5, -0.6], color: 0xffd67a, label: "Answered" },
  journal: { center: [4.7, 1.4, 0.4], color: 0x8fc8ff, label: "Journal" },
  note: { center: [5.1, -1.7, 0.2], color: 0xa9bdd4, label: "Notes" },
  drive_reflection: { center: [4.2, 2.5, 0.4], color: 0x8fc8ff, label: "Reflection" },
  study: { center: [1.8, -3.6, -0.4], color: 0x74d5c1, label: "Study" },
  word_study: { center: [-1.2, -3.9, -0.2], color: 0x74d5c1, label: "Word Study" },
  sermon: { center: [-3.3, -1.2, -1.2], color: 0xb9a5ff, label: "Sermons" },
  collection: { center: [0, 0, -2.2], color: 0xf5c542, label: "Collections" },
  voice_note: { center: [2.8, 0, -0.5], color: 0x9fd6ff, label: "Voice Note" },
  lesson: { center: [-2.2, -2.6, 1.0], color: 0xc9b6ff, label: "Lessons" },
};

const FALLBACK = { center: [0, 0, -1], color: 0xf5c542, label: "Memory" };

function kindMeta(item) {
  return NEIGHBORHOODS[item.kind] || FALLBACK;
}

function shortText(value, max = 76) {
  const text = String(value || "A saved moment from your journey.");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function deterministicOffset(index) {
  const ring = Math.floor(index / 6);
  const angle = (index % 6) * (Math.PI * 2 / 6) + ring * 0.38;
  const radius = 0.75 + ring * 0.5;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, Math.sin(angle * 1.7) * 0.52];
}

function appendText(parent, tagName, value) {
  const node = document.createElement(tagName);
  node.textContent = value;
  parent.appendChild(node);
  return node;
}

function makeLabel(item, meta, onActivate) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `faith-node-card faith-node-${item.kind || "memory"}`;
  el.setAttribute("aria-label", `Open ${item.title || item.ref || meta.label}`);
  appendText(el, "span", meta.label);
  appendText(el, "strong", shortText(item.title || item.ref || "Saved moment", 34));
  appendText(el, "p", shortText(item.text || item.ref, 72));
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    onActivate(item);
  });
  return el;
}


export default function FaithSpace({ items = [], onSelect, onOpenItem, premiumVoice = "marin", fallbackVoiceName = "", accent = "#f5c542", notify, onConverted }) {
  const mountRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const onOpenItemRef = useRef(onOpenItem);
  const [picked, setPicked] = useState(null);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onOpenItemRef.current = onOpenItem; }, [onOpenItem]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 620;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030812");
    scene.fog = new THREE.FogExp2(0x030812, 0.014);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.7, 17.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.className = "faith-label-layer";
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.inset = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    mount.appendChild(labelRenderer.domElement);

    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.AmbientLight(0x7891ad, 1.3));
    const key = new THREE.PointLight(Number.parseInt(accent.replace("#", ""), 16) || 0xf5c542, 3, 60);
    key.position.set(3, 7, 9);
    scene.add(key);

    const makeGlowTexture = (hex) => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const col = new THREE.Color(hex);
      const r = Math.round(col.r * 255), gg = Math.round(col.g * 255), b = Math.round(col.b * 255);
      g.addColorStop(0, `rgba(${r},${gg},${b},1)`);
      g.addColorStop(0.4, `rgba(${r},${gg},${b},0.35)`);
      g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
    };
    const goldGlow = makeGlowTexture(0xf5cf77);

    const makeSkyTexture = () => {
      const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
      const ctx = c.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, "#020713"); g.addColorStop(0.55, "#06182c"); g.addColorStop(1, "#02060e");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 512);
      const blob = (x, y, rr, col) => { const rg = ctx.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, col); rg.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = rg; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); };
      blob(220, 160, 260, "rgba(231,189,103,0.16)");
      blob(760, 300, 300, "rgba(40,110,170,0.16)");
      blob(540, 420, 200, "rgba(247,219,154,0.10)");
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
    };
    const skyGroup = new THREE.Group(); scene.add(skyGroup);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(70, 40, 32), new THREE.MeshBasicMaterial({ map: makeSkyTexture(), side: THREE.BackSide, depthWrite: false, fog: false }));
    skyGroup.add(sky);

    const shootingStars = [];
    const spawnShooter = () => {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.6, -1.2, 0)]);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.9 }));
      line.position.set((Math.random() * 2 - 1) * 22, 11 + Math.random() * 6, -10 + (Math.random() * 2 - 1) * 10);
      line.rotation.z = Math.atan2(-1.2, -2.6);
      const vel = new THREE.Vector3(-2.6, -1.2, 0).normalize().multiplyScalar(0.16 + Math.random() * 0.12);
      skyGroup.add(line);
      shootingStars.push({ line, vel, life: 0, max: 110 + Math.random() * 60, delay: Math.random() * 240 });
    };
    for (let i = 0; i < 4; i++) spawnShooter();

    const starLayers = [];
    const makeStars = (count, rMin, rMax, color, size, opacity) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = rMin + Math.random() * (rMax - rMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false });
      const points = new THREE.Points(geo, mat);
      points.userData = { baseOpacity: opacity };
      root.add(points);
      starLayers.push(points);
      return points;
    };
    makeStars(900, 24, 60, 0xdab865, 0.14, 0.72);
    makeStars(420, 12, 26, 0xf7e3a8, 0.09, 0.5);

    const nodeMeshes = [];
    const groupCounts = {};
    const centers = new Map();

    Object.entries(NEIGHBORHOODS).forEach(([kind, meta]) => {
      const center = new THREE.Vector3(...meta.center);
      centers.set(kind, center);
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 0.93, 64),
        new THREE.MeshBasicMaterial({ color: meta.color, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      halo.position.copy(center);
      halo.rotation.x = -0.18;
      root.add(halo);
    });

    const selectItem = (selected) => {
      setPicked(selected);
      nodeMeshes.forEach((node) => node.label.element.classList.toggle("selected", node.item.id === selected.id));
      onSelectRef.current?.(selected);
    };

    items.forEach((item, idx) => {
      const meta = kindMeta(item);
      const count = groupCounts[item.kind] || 0;
      groupCounts[item.kind] = count + 1;
      const [ox, oy, oz] = deterministicOffset(count);
      const anchor = new THREE.Vector3(meta.center[0] + ox, meta.center[1] + oy, meta.center[2] + oz);
      const ageScale = Math.max(0.72, 1 - idx * 0.018);
      const radius = item.kind === "answered_prayer" ? 0.34 : 0.26;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        new THREE.MeshStandardMaterial({ color: meta.color, emissive: meta.color, emissiveIntensity: 0.55, metalness: 0.35, roughness: 0.25 })
      );
      mesh.position.copy(anchor);
      mesh.scale.setScalar(ageScale);
      mesh.userData = { item, idx };
      root.add(mesh);

      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: goldGlow, color: meta.color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      glow.scale.setScalar(radius * 4.4);
      mesh.add(glow);
      mesh.userData.glow = glow;

      const label = new CSS2DObject(makeLabel(item, meta, selectItem));
      label.position.set(0, 0.52, 0);
      mesh.add(label);
      nodeMeshes.push({ mesh, label, anchor, phase: idx * 0.83, item });

      const center = centers.get(item.kind);
      if (center) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([center, anchor]);
        root.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: meta.color, transparent: true, opacity: 0.15 })));
      }
    });

    let rotX = 0.06, rotY = 0;
    let dragging = false, downX = 0, downY = 0, lastX = 0, lastY = 0;
    const onDown = (event) => { dragging = true; downX = lastX = event.clientX; downY = lastY = event.clientY; };
    const onMove = (event) => {
      if (!dragging) return;
      rotY += (event.clientX - lastX) * 0.006;
      rotX = THREE.MathUtils.clamp(rotX + (event.clientY - lastY) * 0.004, -0.65, 0.65);
      lastX = event.clientX; lastY = event.clientY;
    };
    const onUp = () => { dragging = false; };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPick = (event) => {
      if (Math.abs(event.clientX - downX) > 7 || Math.abs(event.clientY - downY) > 7) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes.map((node) => node.mesh));
      if (hits.length) selectItem(hits[0].object.userData.item);
    };
    renderer.domElement.addEventListener("pointerup", onPick);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      root.rotation.x += (rotX - root.rotation.x) * 0.07;
      root.rotation.y += (rotY - root.rotation.y) * 0.07;
      if (!dragging && !reducedMotion) rotY += 0.0009;
      if (!reducedMotion) skyGroup.rotation.y += 0.0003;
      camera.position.z = 17.5 + (reducedMotion ? 0 : Math.sin(t * 0.15) * 0.3);
      shootingStars.forEach((s) => {
        if (reducedMotion) return;
        if (s.delay > 0) { s.delay--; return; }
        s.life++;
        s.line.position.add(s.vel);
        s.line.material.opacity = 0.9 * (1 - s.life / s.max);
        if (s.life > s.max) { s.life = 0; s.line.position.set((Math.random() * 2 - 1) * 22, 11 + Math.random() * 6, -10 + (Math.random() * 2 - 1) * 10); s.delay = 140 + Math.random() * 380; }
      });
      starLayers.forEach((layer, idx) => {
        if (!reducedMotion) layer.rotation.y += 0.0004 * (idx === 0 ? 1 : -0.6);
        const base = layer.userData.baseOpacity || 0.6;
        layer.material.opacity = reducedMotion ? base : base + Math.sin(t * 0.8 + idx) * 0.12;
      });
      nodeMeshes.forEach((node, i) => {
        node.mesh.position.x = node.anchor.x + (reducedMotion ? 0 : Math.cos(t * 0.35 + node.phase) * 0.16);
        node.mesh.position.y = node.anchor.y + (reducedMotion ? 0 : Math.sin(t * 0.62 + node.phase) * 0.24);
        node.mesh.position.z = node.anchor.z + (reducedMotion ? 0 : Math.sin(t * 0.29 + i) * 0.12);
        if (!reducedMotion) node.mesh.rotation.y += 0.004;
        const gl = node.mesh.userData.glow;
        if (gl) gl.material.opacity = 0.45 + (reducedMotion ? 0 : Math.sin(t * 0.7 + node.phase) * 0.15);
      });
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onPick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.replaceChildren();
    };
  }, [items, accent]);

  const sharePicked = async () => {
    if (!picked) return;
    const text = `${picked.title || picked.ref || "EVANGEL Faith Space"}\n${picked.text || ""}`;
    if (navigator.share) await navigator.share({ title: picked.title || "EVANGEL", text }).catch(() => {});
    else await navigator.clipboard?.writeText(text);
  };

  return (
    <div className="faith-space-renderer">
      <div ref={mountRef} className="faith-space-webgl" aria-label="Interactive Faith Space with moving saved-item nodes" />
      <div className="faith-space-instructions">Drag the background to orbit · tap any visible card to select it</div>
      {picked && (
        <aside className="faith-node-detail glass" aria-live="polite">
          <small>{kindMeta(picked).label} · {picked.createdAt || "Saved"}</small>
          <strong>{picked.title || picked.ref || "Saved moment"}</strong>
          <p>{shortText(picked.text || picked.ref, 180)}</p>
          <div className="faith-node-actions">
            <button onClick={() => onOpenItemRef.current?.(picked)}>Open</button>
            <button onClick={() => speakEvangel({ text: `${picked.title || picked.ref || "Saved item"}. ${picked.text || ""}`, premiumVoice, fallbackVoiceName })}>Listen</button>
            <button onClick={sharePicked}>Share</button>
          </div>
          {picked.kind === "note" && (
            <div className="convert-block">
              <small>Turn this note into</small>
              <ConvertNoteActions item={picked} notify={notify} onConverted={onConverted} />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}