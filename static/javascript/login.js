window.addEventListener("load", () => {
  NProgress.start();
  NProgress.done();
});

document.addEventListener("submit", () => {
  NProgress.start();
  const interval = setInterval(() => {
    NProgress.inc();
  }, 600);
});
