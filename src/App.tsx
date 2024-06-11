import "./App.scss";
import Header from "./components/header/Header";
import QueryBuilder from "./pages/Querybuilder/QueryBuilder";


function App() {
  return (
    <>
      <header>
        <Header/>
      </header>
      <main>
        <QueryBuilder />
      </main>
    </>
  );
}

export default App;
