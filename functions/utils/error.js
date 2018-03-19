//=======================================================================//
//     ERROR functions                                                   //
//=======================================================================//

module.exports = {

	page404: (req, res) => res.status(404).send(`[${config.env.toUpperCase()}] hihihi y'a rien ici, tu peux aller faire un tour ici : <a href="https://twitelo.me">https://twitelo.me</a>`)

};