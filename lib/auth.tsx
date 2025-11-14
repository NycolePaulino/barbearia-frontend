"use client";


import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useSearchParams } from "next/navigation";

interface User {
	email: string;
	name: string;
	picture: string;
}

interface CustomJwtPayload extends JwtPayload {
	sub: string;
	name: string;
	picture: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const searchParams = useSearchParams();


	const logout = useCallback(() => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("jwtToken");
	}, []); 

	const login = useCallback((token: string) => {
		try {
		const decodedToken = jwtDecode<CustomJwtPayload>(token);

		if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
			setToken(token);
			
			setUser({
			email: decodedToken.sub,
			name: decodedToken.name,
			picture: decodedToken.picture,
			});
			localStorage.setItem("jwtToken", token);
		} else {
			logout();
		}
		} catch (error) {
			console.error("Falha ao decodificar token:", error);
		logout(); 
		}
	}, [logout]);


	useEffect(() => {
		const initializeAuth = () => {
			const tokenFromUrl = searchParams.get("token");

			if (tokenFromUrl) {
				setTimeout(() => login(tokenFromUrl), 0);
				window.history.replaceState(null, "", "/");
			} else {
				const storedToken = localStorage.getItem("jwtToken");
				if (storedToken) {
					setTimeout(() => login(storedToken), 0);
				}
			}

			setIsLoading(false);
		};

		initializeAuth();
	}, [searchParams, login]);



	return (
		<AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};