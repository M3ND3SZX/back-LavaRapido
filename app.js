/*************************************************************************************************************************************
 *
 * Objetivo: Arquivo para realizar as requisiçõe das necessidade do lava Rápido 
 * data: 24/05/2024
 * Autor: Julia Mendes
 * Versão: 1.0
 * 
 **************************************************************************************************************************************/

/**************************************************************************************************************
 * Para realizar a integração com o Banco de Dados devemos utilizar 
 * uma das seguintes bibliotecas;
 *      - SEQUELIZE = Mais antiga , mais documentação umas das primeiras porém temos bibliotecas mais evoluídas
 *      - PRISMA ORM = É a biblioteca mais atual (a que vamos utilizar)
 *      - FASTIFY ORM = É a bibliteca mais atual 
 * 
 * 
 * 
 * 
 *      npm install express --save
    é a biblioteca que vai gerenciar as requisições da API

    npm install body-parser --save
    É a biblioteca que vai manipular dados do corpo da requisição (POST, PUT)

    npm install cors --save
    É a bbiblioteca responsável pelas permissões (HEADER) de acesso das requisições 

     const bodyParser = require('body-parser')
            const cors = require ('cors')
    const {request} = require('http')


    const {access} = require('fs')

 *     Para a instalação do PRISMA ORM: 
 *        npm install prisma --save   (É responsável pela cpnexão com o BD)  
 *        npm install @prisma/client --save  (É responsável por executar Scripts SQl)
 * 
 *      Para iniciar o prisma no projeto, devemos:
 *      - npx prisma init
 *      - npx prisma generate para fazer a conexão com o banco novamente
 ****************************************************************************************************************/

const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')

const app = express()

app.use((request, response, next) => {
    
    response.header('Access-Control-Allow-Origin', "*") 
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS')

    app.use(cors())
    next()
})

//criando um objeto para controlar a chegada dos dados da rquisição em formato JSON (apenas post e put)
const bodyParserJson = bodyParser.json()


const controllerFuncionarios = require('./controller/controller_funcionarios')


app.get('/v1/lavaRapido/funcionarios', cors(), async function(request, response){

    //Chama a função da controller para retorNAR FILMES
    let dadosFuncionarios = await controllerFuncionarios.getListarFuncionarios()

    //Validação para retornar o JSON dos filmes ou retornar o 404
    if(dadosFuncionarios){
        response.json(dadosFuncionarios);
        response.status(200);
    }else{
        response.json({message: 'Nnehum registro foi encontrado'})
        response.status(404);
    }

})

app.get('/v1/lavaRapido/funcionario/:id', cors(), async function(request,response,next){

    //Recebe o ID da requisição
    let idFuncionario = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosFuncionario = await controllerFuncionarios.getBuscarFuncionarioById(idFuncionario);

    response.status(dadosFuncionario.status_code);
    response.json(dadosFuncionario);

});

app.post('/v1/lavaRapido/funcionario', cors(), bodyParserJson, async function(request,response){

    let contentType = request.headers['content-type']
    
    //recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body

    //Encaminha os dados para cocntroller enviar ao DAO
    let resultadoDadosNovoFuncionario = await controllerFuncionarios.setInserirFuncionarioEndereco(dadosBody,contentType)

    response.status(resultadoDadosNovoFuncionario.status_code)
    response.json(resultadoDadosNovoFuncionario)

})

app.put('/v1/lavaRapido/funcionario/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idFuncionario = request.params.id

    let dadosBody = request.body
    console.log(dadosBody);
    let novosDadosFuncionario = await controllerFuncionarios.setAtualizarFuncionario( idFuncionario, dadosBody,contentType )

    response.status(novosDadosFuncionario.status_code)
    response.json(novosDadosFuncionario)
})

app.get('/v1/lavaRapido/funcionario/agendamento/:nome', cors(), async function(request,response,next){

         let nomeFuncionario = request.query.nome
         let agendamento = await controllerFuncionarios.getBuscarAgendamentoByNomeFuncionario(nomeFuncionario)
    
             response.json(agendamento);
             response.status(agendamento.status_code)
    })


    app.get('/v1/lavaRapido/funcionario/endereco/:nome', cors(), async function(request,response,next){

        let nomeFuncionario = request.query.nome
        let endereco = await controllerFuncionarios.getEnderecoFuncionarioByNome(nomeFuncionario)
   
            response.json(endereco);
            response.status(endereco.status_code)
   })


app.listen('8080', function(){
    console.log("API funcionando e aguardando requisições");
})