import React, { createContext, useState, useEffect, useContext } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    theme: 'light',
    setTheme: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem("USER");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [token, _setToken] = useState(() => localStorage.getItem('ACCESS_TOKEN'));

    const [theme, _setTheme] = useState(() => {
        return localStorage.getItem('APP_THEME') || 'light';
    });

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

    const setTheme = (theme) => {
        _setTheme(theme);
        localStorage.setItem('APP_THEME', theme);
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                theme,
                setTheme
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
