import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./services/PrivateRoute";
import Profile from "./pages/Profile";
import ProtectedAdmin from "./services/ProtectedAdmin";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import UpdateUser from "./pages/UpdateUser";
import AddUser from "./pages/AddUser";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
        <Route element={<ProtectedAdmin />}>
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/updateuser/:userId" element={<UpdateUser />} />
          <Route path="/adduser/:userId" element={<AddUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
