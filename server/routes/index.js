const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Inicio.html`, (e) => {
    });
});

router.post('/validation', async (req, res, next) => {
    let username = req.body.Usuario;
    let password = req.body.Contraseña;
    if (password && username) {
        try {
            let all = await db.all();
            let exist = false;
            all.forEach(element => {
                if (element.user == username) {
                    exist = true;
                }
            });
            if (exist == true) {
                let results = await db.one(username);
                let passwordDB = results[0].password;
                if (password == passwordDB) {
                    res.redirect(`/chatroom/${username}`);
                } else {
                    console.log('Contraseña incorrecta');
                    res.redirect(`/`);
                }
            } else {
                console.log('El usuario no existe');
                res.redirect(`/`);
            }
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    } else {
        console.log('Faltan campos por llenar');
        res.redirect(`/`);
    }

});

router.get('/registro', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Registro.html`, (e) => {
    });
});

router.get('/create/:username/:password', async (req, res, next) => {
    let username = req.params.username;
    let password = req.params.password;
    let exist = false;
    try {
        let all = await db.all();
        let id;
        let exist = false;
        all.forEach(element => {
            if (element.user == username) {
                exist = true;
            }
            id = element.id;
        });
        if (exist) {
            console.log('El usuario ya existe');
            res.redirect(`/registro`);
        } else {
            id = id + 1;
            db.create(id, username, password);
            res.redirect(`/chatroom/${username}`);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

});

module.exports = router;