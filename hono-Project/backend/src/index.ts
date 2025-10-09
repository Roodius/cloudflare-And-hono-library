import { Env, Hono } from 'hono'
  import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from "hono/jwt"

const app = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        SECRET:string
        // id:string,
        // email:string,
        // name:string,
        // password:string
      }
}>()  


// middlerware 
app.use('/message/*', async (c,next) => {
  
  const header = c.req.header("authorization") || "";  // bearer toekn or token 

  const token = header.split("")[1];

  const response = await verify(token,c.env.SECRET);

  if(response.id){
    next()
  } else {
    return c.json({
      error:"unauthorized"
    })
  } 
})

// signUp  route
app.post('/api/v1/signup', async (c) => {
  // connnection pooling with prisma Accelerate 
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json();

    const user = await prisma.user.create({
       data:{
          email:body.email,
          name:body.name,
          password:body.password
       } 
    })
  
        // token
    const token = await sign({id:user.id}, c.env.SECRET)   // secret sign on user id 
    return c.json({token});
})




app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where:{
      email:body.email,
      password:body.password
    }
  })

  if(!user){
    c.status(403);
    return c.json({
      "error":"user not found"
    })
  }

  const jwt = await sign({id:user.id}, c.env.SECRET);
  return c.json({
    jwt,
  })

})




app.post('/api/v1/blog', async (c) => {

  return c.json('Hello Hono!')
})


app.put('/api/v1/blog', async (c) => {

  return c.json('Hello Hono!')
})                                                    


app.get('/api/v1/blog/:id', async (c) => {

  return c.json('Hello Hono!')
})

export default app
