import {Router} from 'express';
import userModel from '../models/userModel.js';
const router = Router();


router.get('/',(req,res)=>{
    res.render('index',{})
});

//Session management:
router.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!");
    }
});

//Login
router.get('/login', (req, res) => {
    res.render('login');
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email:email, password:password })//Ya que el password no está hasheado, podemos buscarlo directamente
    let status=false;
    if (!user) return res.status(401).send({ status: "error", error: "Incorrect credentials" })
    email ==='adminCoder@coder.com'? status=true : status=false;
    // damos de alta la session
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        admin:status
    }
    console.log(req.session.user);
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
});

//Register
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    console.log("Registrando user");
    console.log(req.body);

    const exists = await userModel.findOne({ email })
    if (exists) {
        return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password // se ecripta despues
    }
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario creado con exito con ID: " + result.id })
});


router.get('/register', (req, res) => {
    res.render('register');
});
//profile

router.get('/profile', (req, res) => {
    res.render('profile');
});

//private

function auth(req, res, next) {
    if (req.session.user.email === 'adminCoder@coder.com' && req.session.user.admin) {
        return next();
    } else {
        return res.status(403).send('Usuario no autorizado para ingresar a este recurso..')
    }
}

router.get('/private', auth, (req, res) => {
    res.render('private');
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
});



export default router;