const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(function (req, res, next) {
  if (req.get('x-amz-sns-message-type')) {
    req.headers['content-type'] = 'application/json';
  }
  next();
})
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({strict: false}))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const lista_produtos = {
  produtos: [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
    { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
    { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
    { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
  ]
}

app.get('/produtos', (req, res) => {
  res.status(200).send(lista_produtos);
})

app.post('/produtos', (req, res) => {
  const newProduct = req.body;
  if(!newProduct.descricao || !newProduct.valor || !newProduct.marca){
    res.status(400).send('Produto inválido. Um produto deve possuir descrição, valor e marca');
  }
  newProduct.id = lista_produtos.produtos.length + 1;
  lista_produtos.produtos.push(newProduct);
  res.status(200).send(lista_produtos);
})

app.get('/produtos/:id', (req, res) => {
  const id = req.params.id
  const product = lista_produtos.produtos.find(p => p.id == id);

  if(!product){
    res.status(404).send('Produto não encontrado');
  }

  res.status(200).send(product);
})

app.put('/produtos/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const product = lista_produtos.produtos.find(p => p.id == id);

  if(!product){
    res.status(404).send('Produto não encontrado');
  }

  Object.keys(body).forEach(key => {
    if(key !== 'id'){
      product[`${key}`] = body[`${key}`];
    }else{
      res.status(400).send('Não é permitido alterar a ID de um produto');
    }
  })

  res.status(200).send(product);
})

app.delete('/produtos/:id', (req, res) => {
  const id = req.params.id;
  const productIndex = lista_produtos.produtos.findIndex(p => p.id == id);

  if(productIndex === undefined){
    res.status(404).send('Produto não encontrado');
  }
  lista_produtos.produtos.splice(productIndex, 1)
  res.status(200).send(lista_produtos.produtos);
})
