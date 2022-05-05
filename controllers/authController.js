const loginForm = (req, res) => {
    res.render('login');

}

const registerForm = (req, res) => {
    res.render('Register');
}

module.exports = { loginForm, registerForm}