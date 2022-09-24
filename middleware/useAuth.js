import jwt from "jsonwebtoken";

const useAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) throw new Error("Unauthenticated!!!");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) throw new Error("Unauthenticated!!!");
    req.isAuth = true;
    req.userId = decodedToken._id;
  } catch (error) {
    req.isAuth = false;
  }
  next();
};
export default useAuth;
