import "./App.css";
import { MovieSplitter } from "./classes/movie-splitter";

function App() {
  const ms = new MovieSplitter();
  ms.uploadMovie();

  return <h1 className="text-3xl font-bold underline text-black">Hello world!</h1>;
}

export default App;
