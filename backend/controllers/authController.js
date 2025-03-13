const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const saltRounds = 10;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
let refreshTokens = [];

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Usuário registrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Incluindo o username no payload do token
        const accessToken = jwt.sign(
            { id: user._id, username: user.username },
            accessTokenSecret,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { id: user._id, username: user.username },
            refreshTokenSecret
        );

        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token || !refreshTokens.includes(token)) return res.status(403).json({ message: 'Token inválido ou não encontrado.' });

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Erro ao verificar o refresh token.' });
        
        // Se o refreshToken for válido, gere um novo accessToken
        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            accessTokenSecret,
            { expiresIn: "15m" }
        );
        res.json({ accessToken: newAccessToken });
    });
};


exports.logout = (req, res) => {
    try {
        const { token } = req.body;

        // Verifica se o token está na lista
        if (!refreshTokens.includes(token)) {
            return res.status(400).json({ message: 'Token não encontrado na lista.' });
        }

        // Remove o token da lista
        refreshTokens = refreshTokens.filter((t) => t !== token);

        // Responde com status 204 (sem conteúdo)
        res.sendStatus(204);
    } catch (error) {
        console.error('Erro no logout:', error);  // Log de erro
        res.status(500).json({ message: 'Erro no servidor ao tentar fazer logout.' });
    }
};
