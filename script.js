
const sceneElement = document.getElementById("scene");

// ---------- 3D ENERGY CORE ----------
if (window.THREE && sceneElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    sceneElement.clientWidth / sceneElement.clientHeight,
    0.1,
    100
  );

  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(
    sceneElement.clientWidth,
    sceneElement.clientHeight
  );

  sceneElement.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x8899ff, 1.5));

  const cyanLight = new THREE.PointLight(0x78f7e4, 4);
  cyanLight.position.set(3, 2, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0xa28bff, 4);
  purpleLight.position.set(-3, -2, 3);
  scene.add(purpleLight);

  // Main rotating 3D object
  const core = new THREE.Group();
  scene.add(core);

  const outerGeometry = new THREE.IcosahedronGeometry(1.1, 3);

  const outerMaterial = new THREE.MeshStandardMaterial({
    color: 0x78f7e4,
    emissive: 0x164c54,
    metalness: 0.7,
    roughness: 0.25,
    wireframe: true
  });

  const outerSphere = new THREE.Mesh(
    outerGeometry,
    outerMaterial
  );

  core.add(outerSphere);

  // Inner glowing sphere
  const innerSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 2),
    new THREE.MeshStandardMaterial({
      color: 0x7562ff,
      emissive: 0x4532bd,
      emissiveIntensity: 1.5,
      metalness: 0.7,
      roughness: 0.2
    })
  );

  core.add(innerSphere);

  // Bright center
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xc2fff7
    })
  );

  core.add(center);

  // Orbit rings
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const ringColors = [
    0x78f7e4,
    0xa28bff,
    0xffb36b
  ];

  const rings = [];

  ringColors.forEach((color, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(
        1.55 + index * 0.16,
        0.009,
        8,
        180
      ),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9
      })
    );

    ring.rotation.x = 0.8 + index * 0.5;
    ring.rotation.y = index * 0.65;
    orbitGroup.add(ring);
    rings.push(ring);
  });

  // Floating particles
  const starPositions = [];

  for (let i = 0; i < 450; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 5
    );
  }

  const starGeometry = new THREE.BufferGeometry();

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0x9ba8d8,
      size: 0.018
    })
  );

  scene.add(stars);

  // Drag to rotate the object
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let rotationX = 0;
  let rotationY = 0;

  sceneElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    sceneElement.setPointerCapture(event.pointerId);
  });

  sceneElement.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    rotationY += (event.clientX - previousX) * 0.008;
    rotationX += (event.clientY - previousY) * 0.008;

    previousX = event.clientX;
    previousY = event.clientY;
  });

  function stopDragging() {
    dragging = false;
  }

  sceneElement.addEventListener("pointerup", stopDragging);
  sceneElement.addEventListener("pointercancel", stopDragging);

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (!dragging) {
      rotationY += 0.003;
      rotationX += 0.001;
    }

    core.rotation.x +=
      (rotationX - core.rotation.x) * 0.08;

    core.rotation.y +=
      (rotationY - core.rotation.y) * 0.08;

    core.position.y = Math.sin(time * 1.2) * 0.08;

    orbitGroup.rotation.y += 0.002;
    orbitGroup.rotation.z += 0.001;

    stars.rotation.y += 0.0004;

    renderer.render(scene, camera);
  }

  animate();

  // Keep the 3D scene responsive
  function resizeScene() {
    const width = sceneElement.clientWidth;
    const height = sceneElement.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(resizeScene).observe(sceneElement);
  } else {
    window.addEventListener("resize", resizeScene);
  }
} else {
  sceneElement.textContent =
    "Please connect to the internet to load the 3D experience.";
}

// ---------- SCROLL ANIMATIONS ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-copy > *", {
    opacity: 0,
    y: 25,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out"
  });

  gsap.to(".scene-wrap", {
    y: 90,
    opacity: 0.45,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".feature, .event-card").forEach((card) => {
    gsap.from(card, {
      y: 35,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true
      }
    });
  });

  gsap.from(".manifesto h2", {
    y: 45,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top 75%",
      once: true
    }
  });
}

// ---------- EVENT POPUPS ----------
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription =
  document.getElementById("modal-description");

const eventDetails = {
  "Code Rush":
    "A coding challenge concept. Add the official rules, team size, schedule and registration details here.",

  "Robo Arena":
    "A robotics challenge concept. Add the official robot specifications, competition rules and schedule here.",

  "Beyond Reality":
    "An immersive technology concept. Add official VR/XR experience details and participation information here."
};

document.querySelectorAll(".event-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;

    modalTitle.textContent = name;
    modalDescription.textContent = eventDetails[name];

    modal.classList.add("open");
  });
});

document.getElementById("close-modal").addEventListener(
  "click",
  () => modal.classList.remove("open")
);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("open");
  }
});

// ---------- DEMO REGISTRATION FORM ----------
document.getElementById("interest-form").addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const email = document.getElementById("email");
    const message = document.getElementById("message");

    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }

    message.textContent =
      "Thank you! This is a demo form. Connect a backend to collect registrations.";

    message.style.color = "#78f7e4";
    email.value = "";
  }
);
