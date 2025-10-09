import {email, z} from "zod";

const inputRoutes = z.object({
    email:z.string().max(20, "please enter valid email"),
    password:z.string().max(50, "enter valid password"),
    
})