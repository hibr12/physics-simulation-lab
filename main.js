// Simulation state
const state = {
  running: false,
  objects: [],
  selectedIndex: -1,
  friction: 0.1,
  gravityEnabled: true,
  force: { x: 0, y: 0 },
  lastTimestamp: 0,
};

const canvas = document.getElementById('glCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('labelOverlay');

// ---------------- Physics ----------------
function addObject() {
  const id = state.objects.length + 1;
  const o = {
    id: `${id}`,
    name: `Object${id}`,   // 👈 name now includes the ID
    x: canvas.width * 0.25 + Math.random() * canvas.width * 0.5,
    y: canvas.height * 0.25 + Math.random() * canvas.height * 0.5,
    vx: 0,
    vy: 0,
    mass: parseFloat(document.getElementById('massInput').value),
    color: [
      Math.floor(Math.random() * 200 + 55),
      Math.floor(Math.random() * 200 + 55),
      Math.floor(Math.random() * 200 + 55),
      1
    ],
    trail: [],
    appliedFx: 0,
    appliedFy: 0,
  };
  state.objects.push(o);
  refreshObjectSelect();
  selectObject(state.objects.length - 1);
}


function updatePhysics(dt) {
  const g = state.gravityEnabled ? 350 : 0;
  state.objects.forEach((obj) => {
    const fx = obj.appliedFx;
    const fy = obj.appliedFy + obj.mass * g;
    const dragX = -state.friction * obj.vx;
    const dragY = -state.friction * obj.vy;
    const ax = (fx + dragX) / obj.mass;
    const ay = (fy + dragY) / obj.mass;
    obj.vx += ax * dt;
    obj.vy += ay * dt;
    obj.x += obj.vx * dt;
    obj.y += obj.vy * dt;

    // Bounce
    if (obj.x < 0) { obj.x = 0; obj.vx *= -0.46; }
    if (obj.x > canvas.width) { obj.x = canvas.width; obj.vx *= -0.46; }
    if (obj.y < 0) { obj.y = 0; obj.vy *= -0.46; }
    if (obj.y > canvas.height) { obj.y = canvas.height; obj.vy *= -0.46; }

    obj.trail.push({ x: obj.x, y: obj.y });
    if (obj.trail.length > 300) obj.trail.shift();
  });
  updateObjectInfo();
}

// ---------------- Rendering ----------------
function drawObject(obj) {
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, Math.max(10, 50 - obj.mass * 3), 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${obj.color[0]}, ${obj.color[1]}, ${obj.color[2]}, ${obj.color[3]})`;
  ctx.fill();
}

function drawTrail(obj) {
  if (obj.trail.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(obj.trail[0].x, obj.trail[0].y);
  for (let i = 1; i < obj.trail.length; i++) {
    ctx.lineTo(obj.trail[i].x, obj.trail[i].y);
  }
  ctx.strokeStyle = 'rgba(100,180,255,0.45)';
  ctx.stroke();
}

function drawVector(x, y, vx, vy, color) {
  if (Math.abs(vx) < 1 && Math.abs(vy) < 1) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx, y + vy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  const angle = Math.atan2(vy, vx);
  ctx.beginPath();
  ctx.moveTo(x + vx, y + vy);
  ctx.lineTo(x + vx - 10 * Math.cos(angle - Math.PI / 6),
             y + vy - 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x + vx - 10 * Math.cos(angle + Math.PI / 6),
             y + vy - 10 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function renderLabels() {
  overlay.innerHTML = '';
  state.objects.forEach((obj) => {
    const label = document.createElement('div');
    label.className = 'object-label';
    label.textContent = `${obj.name} (${obj.id})`;
    label.style.left = `${obj.x}px`;
    label.style.top = `${obj.y}px`;
    overlay.appendChild(label);
  });
}

function render2D() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.objects.forEach(obj => {
    drawTrail(obj);
    drawObject(obj);
    // Velocity vector (green)
    drawVector(obj.x, obj.y, obj.vx * 1.2, obj.vy * 1.2, 'rgba(0,255,100,0.9)');
    // Force vector (orange)
    drawVector(obj.x, obj.y, obj.appliedFx * 0.45, obj.appliedFy * 0.45, 'rgba(255,140,50,1)');
  });
  renderLabels();
}

function step(timestamp) {
  if (!state.lastTimestamp) state.lastTimestamp = timestamp;
  const dt = Math.min(0.033, (timestamp - state.lastTimestamp) / 1000);
  state.lastTimestamp = timestamp;

  if (state.running) {
    updatePhysics(dt);
  }

  render2D();
  requestAnimationFrame(step);
}

// ---------------- UI Wiring ----------------
function refreshObjectSelect() {
  const sel = document.getElementById('objectSelect');
  sel.innerHTML = '';
  state.objects.forEach((obj, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = `${obj.name} (m=${obj.mass.toFixed(2)})`;
    sel.appendChild(opt);
  });
  sel.value = state.selectedIndex >= 0 ? String(state.selectedIndex) : '';
}

function selectObject(index) {
  state.selectedIndex = index;
  document.getElementById('objectSelect').value = String(index);
  updateObjectInfo();
}

function updateObjectInfo() {
  const info = document.getElementById('objectInfo');
  if (state.selectedIndex < 0 || !state.objects[state.selectedIndex]) {
    info.textContent = 'No object selected';
    return;
  }
  const obj = state.objects[state.selectedIndex];
  info.textContent =
    `ID: ${obj.id}\nName: ${obj.name}\nPosition: (${obj.x.toFixed(1)}, ${obj.y.toFixed(1)})\n` +
    `Velocity: (${obj.vx.toFixed(2)}, ${obj.vy.toFixed(2)})\nMass: ${obj.mass.toFixed(2)}\n` +
    `Friction: ${state.friction.toFixed(2)}\nApplied Force (last): (${obj.appliedFx.toFixed(1)}, ${obj.appliedFy.toFixed(1)})`;
}

// ---------------- Event Listeners ----------------
document.getElementById('startBtn').addEventListener('click', () => {
  state.running = true;
});
document.getElementById('pauseBtn').addEventListener('click', () => {
  state.running = false;
});
document.getElementById('resetBtn').addEventListener('click', () => {
  state.objects = [];
  state.selectedIndex = -1;
  state.running = false;
  refreshObjectSelect();
  updateObjectInfo();
});
document.getElementById('newObjBtn').addEventListener('click', () => addObject());

document.getElementById('objectSelect').addEventListener('change', (e) => {
  const idx = Number(e.target.value);
  selectObject(idx);
});

document.getElementById('massInput').addEventListener('input', (e) => {
  const mass = parseFloat(e.target.value);
  document.getElementById('massValue').textContent = mass.toFixed(1);
  if (state.selectedIndex >= 0 && state.objects[state.selectedIndex]) {
    state.objects[state.selectedIndex].mass = mass;
    refreshObjectSelect();
    updateObjectInfo();
  }
});

document.getElementById('frictionInput').addEventListener('input', (e) => {
  state.friction = parseFloat(e.target.value);
  document.getElementById('frictionValue').textContent = state.friction.toFixed(2);
  updateObjectInfo();
});

document.getElementById('gravityToggle').addEventListener('change', (e) => {
  state.gravityEnabled = e.target.checked;
});

document.getElementById('forceX').addEventListener('input', (e) => {
  state.force.x = parseFloat(e.target.value);
  document.getElementById('forceXValue').textContent = state.force.x;
});
document.getElementById('forceY').addEventListener('input', (e) => {
  state.force.y = parseFloat(e.target.value);
  document.getElementById('forceYValue').textContent = state.force.y;
});

document.getElementById('applyForceBtn').addEventListener('click', () => {
  if (state.selectedIndex < 0) return;
  state.objects[state.selectedIndex].appliedFx = state.force.x;
  state.objects[state.selectedIndex].appliedFy = state.force.y;
  updateObjectInfo();
});

// ---------------- Bootstrap ----------------
addObject();
requestAnimationFrame(step);


function generateSummary() {
  const summary = document.getElementById('summary');
  summary.innerHTML = '<h3>Simulation Summary</h3>';

  if (state.objects.length === 0) {
    summary.innerHTML += '<p>No objects in simulation.</p>';
    return;
  }

  state.objects.forEach(obj => {
    // Recalculate acceleration from last applied forces
    const dragX = -state.friction * obj.vx;
    const dragY = -state.friction * obj.vy;
    const g = state.gravityEnabled ? 350 : 0;
    const fx = obj.appliedFx;
    const fy = obj.appliedFy + obj.mass * g;
    const ax = (fx + dragX) / obj.mass;
    const ay = (fy + dragY) / obj.mass;

    // Distance traveled (approx from trail)
    const distance = obj.trail.length > 1 
      ? Math.hypot(
          obj.trail[obj.trail.length-1].x - obj.trail[0].x,
          obj.trail[obj.trail.length-1].y - obj.trail[0].y
        ).toFixed(1)
      : 0;

    summary.innerHTML += `<p>
      ${obj.name} (ID ${obj.id}):<br>
      Final Position → (${obj.x.toFixed(1)}, ${obj.y.toFixed(1)})<br>
      Final Velocity → (${obj.vx.toFixed(2)}, ${obj.vy.toFixed(2)})<br>
      Final Acceleration → (${ax.toFixed(2)}, ${ay.toFixed(2)})<br>
      Mass → ${obj.mass.toFixed(2)}<br>
      Friction → ${state.friction.toFixed(2)}<br>
      Last Applied Force → (${obj.appliedFx.toFixed(1)}, ${obj.appliedFy.toFixed(1)})<br>
      Distance Traveled ≈ ${distance}px
    </p>`;
  });
}

document.getElementById('pauseBtn').addEventListener('click', () => {
  state.running = false;
  generateSummary();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state.objects = [];
  state.selectedIndex = -1;
  state.running = false;
  refreshObjectSelect();
  updateObjectInfo();
  generateSummary();
});

