const indexCtrl = {};
const okCode = 200;

indexCtrl.renderIndex = (request, response) => { // Renders the Index Page
  const requestMethod = request.method
  
  if(requestMethod === 'GET') {
    return response.status(okCode).render('index');
  }
  
};

indexCtrl.renderAbout = (request, response) => { // Renders the About Page
  const requestMethod = request.method;
  
  if(requestMethod === 'GET') {
    return response.status(okCode).render('about');
  }
  
};

module.exports = indexCtrl;
