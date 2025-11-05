const hasPassport = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect(process.env.CLIENT_URL);
};
export default hasPassport;