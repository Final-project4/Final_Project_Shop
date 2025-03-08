export const getAuthToken = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find(row => row.startsWith("authToken="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };
  