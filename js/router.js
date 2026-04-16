export function currentRoute() {
  const hash = location.hash || "#/dashboard";
  const route = hash.replace("#/", "").split("?")[0];
  return route || "dashboard";
}

export function setActiveNav(route) {
  document.querySelectorAll(".navItem").forEach(a => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}
