import Header from "@/components/Header";
import { Route, Routes } from 'react-router-dom'
import Login from "@/pages/Login";
import Votar from "@/pages/Votar";
import NotFound from "@/pages/NotFound";

const App = () => {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/votar" element={<Votar />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
