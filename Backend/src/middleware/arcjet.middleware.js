import aj from "../lib/arcjet.js";
import {isSpoofedBot} from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        
        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
            }
          else  if (decision.reason.isBot()){
            return res.status(403).json({ message: "Bot detected" });

         } else {
            return res.status(403).json({ message: "Access denied due to security restrictions." }); 
         }
        };

        //check for spoofed bots
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({error: "spoofed_bot detected", message: "Spoofed bot detected" })
        };

        next();
    } catch (error) {
        console.error("Error in Arcjet middleware:", error);
        next();
    }
}
