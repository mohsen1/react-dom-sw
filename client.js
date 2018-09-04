const root = document.getElementById("root");

// In first render without SW root is empty
if (root.innerHTML !== "") {
  ReactDOM.hydrate(App(), root);
} else {
  ReactDOM.render(App(), root);
}
