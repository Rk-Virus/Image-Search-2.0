//basic express app
import express from 'express';
import { connectDB } from './db.js';
import passport from 'passport';
import initializePassport from './passportConfig.js';
import session from 'express-session'; // Import express-session
import userRoutes from './routes/userRoutes.js'; // Import userRoutes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

// connecting database
connectDB();

// initializing passport
initializePassport(passport);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// registering routers
app.use('/api/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});