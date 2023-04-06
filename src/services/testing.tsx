import { createContext, useContext } from "react";
const NameContext = createContext("");

function App() {
  return (
    <NameContext.Provider value="John Doe">
      <Body />
    </NameContext.Provider>
  );
}

function Body() {
  return <Greeting />;
}

function Greeting() {
  return <NameContext.Consumer>{(name) => <h1>Welcome, {name}</h1>}</NameContext.Consumer>;
  // ... OR ...

  const name = useContext(NameContext);
  return <h1>Welcome, {name}</h1>;
}
