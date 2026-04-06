    import jwt from "jsonwebtoken";

    const auth = (requiredRole=null) => {


        return async (req, res, next) => {
            let token = req.header("Authorization"); 
            if (!token) {
                return res.status(401).json({ message: "No token, authorization denied" });
            }
            token = token.replace("Bearer ", "");
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded);
            req.user = decoded;
            if( requiredRole && req.user.role !== requiredRole){
                return res.status(403).json({ message: "Unauthorized" });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Token is not valid" });
        }
    };
    }

    export default auth;