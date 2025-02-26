// contexts/AuthContext.jsx
import studentApi from "@/api/student.api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (localStorage.getItem("studentToken")) {
          const { data } = await studentApi.getProfile();
          setStudent(data);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        localStorage.removeItem("studentToken");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const logout = () => {
    localStorage.removeItem("studentToken");
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
