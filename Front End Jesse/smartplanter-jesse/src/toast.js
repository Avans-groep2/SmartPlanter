let container;

export function toast(message, type = "info") {
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    error: '<i class="fa-solid fa-xmark"></i>',
    warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
    info: '<i class="fa-solid fa-info-circle"></i>',
  };

  const colors = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
  };

  const t = document.createElement("div");
  t.className = "toast";
  t.style.backgroundColor = colors[type] || colors.info;
  t.innerHTML = `${icons[type] || icons.info} ${message}`;
  container.appendChild(t);

  setTimeout(() => t.remove(), 3000);
}
