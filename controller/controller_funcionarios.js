/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de funcionarios
 * Data: 02/05
 * Autor: Julia Mendes
 * Versão: 1.0
 * //para conversar direto com o banco
************************************************************************************************************/

//Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//Import do arquivo DAO que fará a comunicação com o Banco de Dados
const funcionarioDAO = require('../model/DAO/funcionario.js')

const enderecoDAO = require('../model/DAO/endereco.js')

const getListarFuncionarios = async function (){

    try{

    let funcionarioJSON = {}

    let dadosfuncionario = await funcionarioDAO.selectAllFuncionarios()

    if (dadosfuncionario){

        if(dadosfuncionario.length > 0 ){

             for (let funcionario of dadosfuncionario){
                    let enderecoFuncionario = await enderecoDAO.selectEnderecoById(funcionario.id_endereco)
                    delete funcionario.id_endereco
                    funcionario.endereco = enderecoFuncionario
             }

            funcionarioJSON.funcionarios = dadosfuncionario
            funcionarioJSON.quantidade = dadosfuncionario.length
            funcionarioJSON.status_code = 200
            

            return funcionarioJSON
        

        }else{
            return message.ERROR_NOT_FOUND
        }
    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }
    
}catch(error){
    return message.ERROR_INTERNAL_SERVER
}
    
}

const setInserirFuncionarioEndereco = async function (dadosFuncionario, contentType){
        try{
          
            if (String(contentType).toLowerCase() == 'application/json'){
               
                let novoFuncionarioJson = {}
    
                if(dadosFuncionario.p_nome == ''          || dadosFuncionario.p_nome == undefined         || dadosFuncionario.p_nome == null            || dadosFuncionario.p_nome.length > 100  ||
                  dadosFuncionario.p_email == ''          || dadosFuncionario.p_email == undefined        || dadosFuncionario.p_email == null           || dadosFuncionario.p_email.length >150  ||
                  dadosFuncionario.p_senha == ''          || dadosFuncionario.p_senha == undefined        || dadosFuncionario.p_senha == null           || dadosFuncionario.p_senha.length > 100 ||  
                  dadosFuncionario.p_cargo == ''          || dadosFuncionario.p_cargo == undefined        || dadosFuncionario.p_cargo == null           || dadosFuncionario.p_cargo.length > 30  ||
                  dadosFuncionario.p_telefone == ''       || dadosFuncionario.p_telefone == undefined     || dadosFuncionario.p_telefone == null        || dadosFuncionario.p_telefone.length > 18  ||
                  dadosFuncionario.p_rua == ''            || dadosFuncionario.p_rua == undefined          || dadosFuncionario.p_rua == null             || dadosFuncionario.p_rua.length > 45    ||
                  dadosFuncionario.p_cep == ''            || dadosFuncionario.p_cep == undefined          || dadosFuncionario.p_cep == null             || isNaN(dadosFuncionario.p_cep)   ||
                  dadosFuncionario.p_numero == ''         || dadosFuncionario.p_numero == undefined       || dadosFuncionario.p_numero == null          || isNaN(dadosFuncionario.p_numero)   ||
                  dadosFuncionario.p_complemento == ''    || dadosFuncionario.p_complemento == undefined  || dadosFuncionario.p_complemento == null     || dadosFuncionario.p_complemento.length > 100 ||
                  dadosFuncionario.p_bairro == ''         || dadosFuncionario.p_bairro == undefined       || dadosFuncionario.p_bairro == null          || dadosFuncionario.p_bairro.length > 150   ||
                  dadosFuncionario.p_estado == ''         || dadosFuncionario.p_estado == undefined       || dadosFuncionario.p_estado == null          || dadosFuncionario.p_estado.length > 80   ||
                  dadosFuncionario.p_cidade == ''         || dadosFuncionario.p_cidade == undefined       || dadosFuncionario.p_cidade == null          || dadosFuncionario.p_estado.length > 80   

                ){
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                   
                    let novoFuncionario = await funcionarioDAO.insertFuncionarioEndereco(dadosFuncionario)
                   
                    if (novoFuncionario){
                    
                        let ultimoID = await funcionarioDAO.selectUltimoIdFuncionario()
                       
                        dadosFuncionario.id = Number(ultimoID[0].id)
                        
                    }
                    
                    if (novoFuncionario){
                        novoFuncionarioJson.funcionario = dadosFuncionario
                        novoFuncionarioJson.status = message.SUCESS_CREATED_ITEM.status
                        novoFuncionarioJson.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novoFuncionarioJson.message = message.SUCESS_CREATED_ITEM.message
                        
                        return novoFuncionarioJson //201
                    }else {
                        return message.ERROR_INTERNAL_SERVER_DB // 500 
                    }
                }
                
            
            }else{
                return message.ERROR_CONTENT_TYPE//415
            }
            
        }catch(error){
            return message.ERROR_INTERNAL_SERVER //500 erro na controller
        }
    }


    const getBuscarFuncionarioById = async function (id) {

        
        let idFuncionario = id;
        //Cria o objeto JSON
        let funcionarioJSON = {};

        //Validação para vereficar se o ID é valido (vazio, indefinido ou não númerico)
        if (idFuncionario == '' || idFuncionario == undefined || isNaN(idFuncionario)) {
            return message.ERROR_INVALID_ID; //400
        } else {

            //Encaminha o ID para o DAO buscar no Banco de Dados 
            let dadosFuncionario = await funcionarioDAO.selectFuncionarioById(idFuncionario);

            //Verifica se o DAO retornou dados
            if (dadosFuncionario) {

                //Validação para vereficar a quantidade de itens retornados
                if (dadosFuncionario.length > 0) {

                    for (let funcionario of dadosFuncionario){
                        let enderecoFuncionario = await enderecoDAO.selectEnderecoById(funcionario.id_endereco)
                        delete funcionario.id_endereco
                        funcionario.endereco = enderecoFuncionario
                    }
                   
    

                    //Cria o JSON para retorno
                    funcionarioJSON.funcionario = dadosFuncionario;
                    funcionarioJSON.status_code = 200;

                    return funcionarioJSON;

                } else {
                    return message.ERROR_NOT_FOUND; //404
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB; //500
            }
        }

    }

    const setAtualizarFuncionario = async function (id, dadosFuncionario, contentType){

   
        let idFuncionario = id
    
    
    
        if (idFuncionario== '' || idFuncionario == undefined || isNaN(idFuncionario)) {
            return message.ERROR_INVALID_ID; 
            }else {
              
                let result = await funcionarioDAO.selectFuncionarioById(idFuncionario);
                let verificarId = result.length
                if (verificarId > 0) {
                    
                    try{
    
                        if (String(contentType).toLowerCase() == 'application/json'){
    
                            let updateFuncionarioJson = {}
    
                            if(dadosFuncionario.nome == ''          || dadosFuncionario.nome == undefined         || dadosFuncionario.nome == null            || dadosFuncionario.nome.length > 100  ||
                            dadosFuncionario.email == ''          || dadosFuncionario.email == undefined        || dadosFuncionario.email == null           || dadosFuncionario.email.length >150  ||
                            dadosFuncionario.senha == ''          || dadosFuncionario.senha == undefined        || dadosFuncionario.senha == null           || dadosFuncionario.senha.length > 100 ||  
                            dadosFuncionario.cargo == ''          || dadosFuncionario.cargo == undefined        || dadosFuncionario.cargo == null           || dadosFuncionario.cargo.length > 30  ||
                            dadosFuncionario.telefone == ''       || dadosFuncionario.telefone == undefined     || dadosFuncionario.telefone == null        || dadosFuncionario.telefone.length > 18 ||
                            dadosFuncionario.id_endereco == ''    || dadosFuncionario.id_endereco == undefined  || dadosFuncionario.id_endereco == null     || isNaN(dadosFuncionario.id_endereco)
                             ){
                                return message.ERROR_REQUIRED_FIELDS
                            } else {
    
                                let funcionarioAtualizado = await funcionarioDAO.updateFuncionario(id, dadosFuncionario)
                
                                
                                if (funcionarioAtualizado){
                                   updateFuncionarioJson.funcionario = dadosFuncionario
                                   updateFuncionarioJson.status = message.SUCESS_UPDATED_ITEM.status
                                   updateFuncionarioJson.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                   updateFuncionarioJson.message = message.SUCESS_UPDATED_ITEM.message
                                    
                                    return updateFuncionarioJson //201
                                }else {
                                    return message.ERROR_INTERNAL_SERVER_DB // 500 
                                }
    
    
                            }
    
                        }else{
                            return message.ERROR_CONTENT_TYPE
                        }
                    }catch(error){
                        return message.ERROR_INTERNAL_SERVER
                    }
                }else{
                    return message.ERROR_NOT_FOUND_ID
                }
    
            
    
            }
        

        }

        const getBuscarAgendamentoByNomeFuncionario = async (nome) => {
            // Cria o objeto JSON
    
            let nomeFuncionario = nome
            let funcionarioJson = {};
    
            if (nomeFuncionario == '' || nomeFuncionario == undefined) {
                return message.ERROR_INVALID_ID
            } else {
                //Chama a funcão do DAO para retornar os dados da tabela de filmes
                let dadosFuncionario = await funcionarioDAO.selectAgendamentosByNomeFuncionario(nome)
    
    
                if (dadosFuncionario) {
                    if (dadosFuncionario.length > 0) {
                        funcionarioJson.Agendamento = dadosFuncionario;
                        funcionarioJson.status_code = 200;
    
                        // console.log(filmesJSON)
    
                        return funcionarioJson;
                    } else {
                        return message.ERROR_NOT_FOUND;
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
    
            }
        }

        const getListarAgendamentosFuncionarios = async () => {
            // Cria o objeto JSON
    
            let funcionarioJson = {};
    
                //Chama a funcão do DAO para retornar os dados da tabela de filmes
                let dadosFuncionario = await funcionarioDAO.selectAllAgendamentosFuncionarios()
    
    
                if (dadosFuncionario) {
                    if (dadosFuncionario.length > 0) {
                        funcionarioJson.Agendamento = dadosFuncionario;
                        funcionarioJson.status_code = 200;
    
                        // console.log(filmesJSON)
    
                        return funcionarioJson
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
    
            }


            const getEnderecoFuncionarioByNome = async (nome) => {
                // Cria o objeto JSON
        
                let nomeFuncionario = nome
                let funcionarioJson = {};
        
                if (nomeFuncionario == '' || nomeFuncionario == undefined) {
                    return message.ERROR_INVALID_ID
                } else {
                    //Chama a funcão do DAO para retornar os dados da tabela de filmes
                    let dadosFuncionario = await funcionarioDAO.selectEnderecoFuncionariobyNome(nome)
        
        
                    if (dadosFuncionario) {
                        if (dadosFuncionario.length > 0) {
                            funcionarioJson.Endereço = dadosFuncionario;
                            funcionarioJson.status_code = 200;
        
                            // console.log(filmesJSON)
        
                            return funcionarioJson;
                        } else {
                            return message.ERROR_NOT_FOUND;
                        }
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
        
                }
            }
        
    
    
        



module.exports = {
    getListarFuncionarios,
    getBuscarFuncionarioById,
    setInserirFuncionarioEndereco,
    setAtualizarFuncionario,
    getBuscarAgendamentoByNomeFuncionario,
    getListarAgendamentosFuncionarios,
    getEnderecoFuncionarioByNome
}
