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

        const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret);

        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token || !refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    });
};

exports.logout = (req, res) => {
    refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
    res.sendStatus(204);
};
