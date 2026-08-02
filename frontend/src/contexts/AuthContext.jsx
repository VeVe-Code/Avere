import axios from "../helper/axios"
import { createContext, useEffect, useReducer } from "react"

let AuthContext = createContext()

let initialState = {
  user: null,
  isAuth: false,
  authReady: false,
}

let AuthReducer = (state, action) => {
  switch (action.type) {

    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
        authReady: true,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuth: false,
        authReady: true,
      }

    case "AUTH_READY":
      return {
        ...state,
        authReady: true,
      }

    default:
      return state
  }
}

let AuthContextProvider = ({ children }) => {

  let [state, dispatch] = useReducer(AuthReducer, initialState)

  useEffect(() => {
    axios.get('/api/users/me')
      .then(res => {
        if (res.data) {
          dispatch({ type: 'LOGIN', payload: res.data })
        } else {
          dispatch({ type: "LOGOUT" })
        }
      })
      .catch(() => {
        dispatch({ type: "LOGOUT" })
      })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthContextProvider }
