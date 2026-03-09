import axios from "axios"
import { createContext, useEffect, useReducer } from "react"

/* =======================
   Context
======================= */
let AuthContext = createContext()

/* =======================
   Initial State
======================= */
let initialState = {
  user: null,
  isAuth: false
}

/* =======================
   Reducer
======================= */
let AuthReducer = (state, action) => {
  switch (action.type) {

    case "LOGIN":
      localStorage.setItem('user', JSON.stringify(action.payload))
      return {
        user: action.payload,
        isAuth: true
      }

    case "LOGOUT":
      localStorage.removeItem('user')
      return {
        user: null,
        isAuth: false
      }

    default:
      return state
  }
}

/* =======================
   Provider
======================= */
let AuthContextProvider = ({ children }) => {

  let [state, dispatch] = useReducer(AuthReducer, initialState)
  useEffect(()=>{
 try {
  axios.get('/api/users/me').then(res => {
    let user = res.data
    if(user){
  dispatch({type : 'LOGIN',payload : user})
 }else{
  dispatch({type : "LOGOUT"})
 }
  })
 
 } catch (error) {
   dispatch({type : "LOGOUT"})
 }
  },[])


  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

/* =======================
   Exports
======================= */
export { AuthContext, AuthContextProvider }
