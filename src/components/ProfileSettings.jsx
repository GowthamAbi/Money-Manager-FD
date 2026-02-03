const login = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", userData.token);
  setUser(userData);
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  setUser(null);
};
