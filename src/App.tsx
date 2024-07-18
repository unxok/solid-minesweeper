import type { Component } from "solid-js";
import { Game } from "./components/Game";

const App: Component = () => {
  return (
    <div class="px-10 py-4">
      <h1 class="text-4xl font-bold tracking-wide">Minesweeper</h1>
      <Game />
    </div>
  );
};

export default App;
