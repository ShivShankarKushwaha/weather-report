import './App.css'
import { NavBar } from './Components/NavBar'
import { BrowserRouter as Router , Routes,Route} from 'react-router-dom';
import { HomeScreen } from './Screens/Home';
import { Forecast } from './Screens/Forecast';
import { Bounce, ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
    <Router>
    <div className='w-full min-h-screen relative'>
      <NavBar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
    </div>
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        />
    </Router>
    </>
  )
}

export default App
