import React, { createContext, useState, useEffect, useContext } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem("USER");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [token, _setToken] = useState(() => localStorage.getItem('ACCESS_TOKEN'));

    useEffect(() => {
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        if (storedToken) {
            _setToken(storedToken);
        }
    }, []);

    const setToken = (token) => {
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
        _setToken(token);
    };

    const setUser = (user) => {
        if (user) {
            localStorage.setItem("USER", JSON.stringify(user));
        } else {
            localStorage.removeItem("USER");
        }
        _setUser(user);
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
