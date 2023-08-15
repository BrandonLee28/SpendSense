const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
var cors = require('cors')


const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend's origin
    credentials: true, 
}));

const authenticateToken = (req,res,next) => {
    const token = req.cookies.token;
    if (!token){
        return res.status(401).json({'error':'No Token Found'})
    }
    try{
        decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decodedToken
        next();
    }catch(err){
        return res.status(403).json({"error": "Invalid Token"})
    };
};


app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const saltRounds = 10;
        if (!password) {
            return res.status(400).json({ error: 'Password is required.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await prisma.user.findFirst({where: {
            email: email,
        }})
        const newUser = await prisma.user.create({
            data: {
                role: 'user',
                email: email,
                password: hashedPassword,
            },
        });
        
        const accessToken = jwt.sign({'email':newUser.email, 'id':newUser._id},process.env.SECRET_TOKEN)
        res.cookie('token', accessToken, {
            httpOnly: true, 
            maxAge: 1200000,
            secure: true, 
            sameSite: 'None',
        });
        return res.status(201).json({message:"User Authenticated"});

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.get('/home', authenticateToken, async (req,res) => {
    try{
        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            },
        });
        const budgets = await prisma.budget.findMany({
            where: {
                User: user,
            }
        })
        return res.status(202).json({id:user.id, email:user.email,role:user.role, budgets:budgets})
    }catch(err){
        return res.json(err)
    }
})
app.get('/logout',authenticateToken, async (req,res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'None', // Set to 'None' if using cross-site requests
        expires: new Date(0), // Expire the cookie immediately
      });
    return res.json({message: 'Cookie Cleared'})
})


app.post('/login', async (req,res) => {
    try{
    const {email,password} = req.body;
    const user = await prisma.user.findFirst({where: {
        email: email,
    }})
    const hashedPassword = user.password
    await bcrypt.compare(password, hashedPassword, (err,result) => {
        const accessToken = jwt.sign({'email':user.email, 'id':user._id},process.env.SECRET_TOKEN)
        res.cookie('token', accessToken, {
            httpOnly: true, 
            maxAge: 1200000,
            secure: true, 
            sameSite: 'None',
        });
        return res.status(200).json({message: 'User Logged in'})
    })

    }catch(err){
        return res.json(err)

    }

})

app.post('/budget/:id', authenticateToken, async (req,res) => {
    try {
        findUser = await prisma.user.findFirst({where: {
            userId: req.user.id
        }})
        findBudget = await prisma.budget.findFirst({where: {
            id: req.params.id
        }})
        transaction = await prisma.transaction.create({data: {
            name: req.body.name,
            category: req.body.category,
            amount: req.body.amount,
            Budget: {
                connect: { id: findBudget.id}
            }
        }})
        return res.status(201).json({ message: 'Transaction created successfully', transaction });
    }catch(err){
        console.error(err)
    }
})

app.post('/budget', authenticateToken, async (req, res) => {
    try {
        findUser = await prisma.user.findFirst({where:
        {
            email: req.user.email
        }})
        const createdBudget = await prisma.budget.create({
            data: {
                name: req.body.name,
                User: {
                    connect: { id: findUser.id },
                },
            },
        });
        return res.status(200).json({message: 'Created Budget ' + createdBudget.id});
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create budget' });
    }
})


app.get('/budget/:id', authenticateToken, async (req,res) => {
    try{
        const findUser = await prisma.user.findFirst({where:
            {
                email: req.user.email
            }})  
        const Budget = await prisma.budget.findFirst({where: {
            id: req.params.id,
            userId: findUser.id
        }});
        const Transactions = await prisma.transaction.findMany({where: {
            budgetId: Budget.id
        }});
            
        return res.status(200).json({
            id: findUser.id, 
            email: findUser.email, 
            role: findUser.role, 
            budget: {
                budget: Budget,
                transactions: Transactions
            }
        }
        );

    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/budget/:budid/transaction/:transid', authenticateToken, async (req,res) => {
    try{
        findBudget = await prisma.budget.findFirst({where: {
            id: req.params.budid
        }})

        await prisma.transaction.delete({where: {
            id: req.params.transid,
            budgetId: findBudget.id
        }})
        return res.status(200).json({message: 'Transaction deleted'})
    }catch(err){
        console.error(err)
    }
})

app.delete('/budget/:id', authenticateToken, async (req,res) => {
    try{
        await prisma.budget.delete({ where: {
            id: req.params.id
        }})
        return res.status(200).json({message: 'Budget deleted'})
    }catch(err){
        console.error(err)
    }
})

app.patch('/budget/:id', authenticateToken, async (req,res) => {
    try{
        const findBudget = await prisma.budget.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name
            }
        });
        if (!findBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        return res.status(200).json({message: 'Budget name updated'})
    }catch(err){
        console.error(err)
    }
})

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.patch('/budget/:budid/transaction/:transid', authenticateToken, async (req, res) => {
    try {
        const findBudget = await prisma.budget.findFirst({
            where: {
                id: req.params.budid,
            },
        });

        if (!findBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        await prisma.transaction.update({
            where: {
                id: req.params.transid,
            },
            data: {
                name: req.body.name,        
                category: req.body.category, 
                amount: req.body.amount,     
            },
        });

        return res.status(200).json({ message: 'Transaction updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Close the Prisma connection when the server is closed
server.on('close', () => {
    prisma.$disconnect();
});
