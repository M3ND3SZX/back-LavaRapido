/************************************************************************************************************
 * Objetivo: Arquivo responsavel pelo acesso ao Banco de dados MySQL, aqui faremos o CRUD na tabela FUNCIONÁRIOS
 * 
 * Data: 28/05/2024
 * Autor: Julia Mendes
 * Versão: 1.0
 * 
************************************************************************************************************/

const { PrismaClient } =  require('@prisma/client');

const prisma = new PrismaClient();



const selectAllFuncionarios = async function(){

    let sql = `select * from tbl_funcionarios`;
        
    let rsFuncionario = await prisma.$queryRawUnsafe(sql);

    if( rsFuncionario.length > 0) {
       return rsFuncionario;
       
    }else{
       return false;
    }

} 

const insertFuncionario = async function(dadosFuncionario){

try{
    let sql = `insert into tbl_funcionarios (
        nome,
        email,
        senha,
        cargo,
        telefone,
        id_endereco
    ) values (
        '${dadosFuncionario.nome}',
        '${dadosFuncionario.email}',
        '${dadosFuncionario.senha}',
        '${dadosFuncionario.cargo}',
        '${dadosFuncionario.telefone}',
         ${dadosFuncionario.id_endereco}
    )`
    
    let rsFuncionario = await prisma.$executeRawUnsafe(sql)
        
        if(rsFuncionario)
            return true
        }catch(error){
            return false
        }
    
}

const insertFuncionarioEndereco = async function (dadosFuncionario) {

    try{

        let sql = `CALL inserir_funcionario_com_endereco(
            '${dadosFuncionario.p_nome}', 
            '${dadosFuncionario.p_email}',
            '${dadosFuncionario.p_senha}',
            '${dadosFuncionario.p_cargo}', 
            '${dadosFuncionario.p_telefone}',
            '${dadosFuncionario.p_rua}',
            '${dadosFuncionario.p_cep}',
            '${dadosFuncionario.p_numero}',
            '${dadosFuncionario.p_bairro}',
            '${dadosFuncionario.p_estado}',
            '${dadosFuncionario.p_cidade}'
        )`

        let rsFuncionario = await prisma.$executeRawUnsafe(sql)

         
        if(rsFuncionario)
            return true
        }catch(error){
            return false
        }
}


const updateFuncionario = async function (id, dadosFuncionario) {

    try{

         let sql =  ` CALL p_atualizar_funcionario_com_endereco(
            '${id}'
            '${dadosFuncionario.p_nome}',  
            '${dadosFuncionario.p_email}',
            '${dadosFuncionario.p_senha}',  
            '${dadosFuncionario.p_cargo}', 
            '${dadosFuncionario.p_telefone}',  
            '${dadosFuncionario.p_rua}',  
            '${dadosFuncionario.p_cep}', 
            '${dadosFuncionario.p_numero}',
            '${dadosFuncionario.p_bairro}',
            '${dadosFuncionario.p_estado}',
            '${dadosFuncionario.p_cidade}'
        ); `
       
        console.log(sql);
    
        let rsFuncionario = await prisma.$executeRawUnsafe(sql)
    
    
         if (rsFuncionario)
         return true
         else
         return false 

    }
    catch(error){
        console.log(error);
        return false
    }

}


const selectFuncionarioById = async function (id){

    try{
        let sql = `select * from tbl_funcionarios where id_funcionario = ${id}`

        let rsFuncionario = await prisma.$queryRawUnsafe(sql)

        return rsFuncionario
       

    } catch (error){
        return false
    }

 }





const deleteFuncionario = async function (id){
        try {
       
            let sql = ` DELETE FROM tbl_funcionarios WHERE (id_funcionario = ${id});`
     
            console.log(sql);
        
            let rsFuncionario = await prisma.$executeRawUnsafe(sql);  
           
            if(rsFuncionario)
            return true
           
          } catch (error) {
             
            return false
            }
        
       
     }


     const selectUltimoIdFuncionario = async function (){
        try{
           let sql = ` select cast(last_insert_id()as DECIMAL) as id from tbl_funcionarios limit 1;`
    
           let rsFuncionario = await prisma.$queryRawUnsafe(sql)
    
           return rsFuncionario
    
           
        } catch (error) {
           return false
       }
    }

    const selectAgendamentosByNomeFuncionario = async function (nome){
 
        try {
    
        let sql = `SELECT * FROM vw_agendamentos_por_funcionario WHERE nome_funcionario like  '%${nome}%'`
        let rsFuncionario = await prisma.$queryRawUnsafe(sql);
    
            return rsFuncionario;
        } catch (error) {
            return false
        }
        
    }


    const selectAllAgendamentosFuncionarios = async function (){
 
        try {
    
        let sql = `SELECT * FROM vw_agendamentos_por_funcionario`
        
        let rsFuncionario = await prisma.$queryRawUnsafe(sql);

      
        
    
            return rsFuncionario;
        } catch (error) {
            return false
        }
        
    }

    const selectEnderecoFuncionariobyNome = async function (nome){
 
        try {
    
        let sql = `select * from vw_selecionar_endereco_funcionario where nome LIKE '%${nome}%';`
        
        let rsFuncionario = await prisma.$queryRawUnsafe(sql);
            return rsFuncionario;
        } catch (error) {
            return false
        }
        
    }

    const selectEnderecoFuncionariobyId = async function (id){
 
        try {
    
        let sql = `select * from vw_selecionar_endereco_funcionario where id_funcionario = ${id}';`
        
        let rsFuncionario = await prisma.$queryRawUnsafe(sql);
            return rsFuncionario;
        } catch (error) {
            return false
        }
        
    }
    
    








module.exports = {
    selectAllFuncionarios,
    deleteFuncionario,
    updateFuncionario,
    insertFuncionario,
    insertFuncionarioEndereco,
    selectUltimoIdFuncionario,
    selectFuncionarioById,
    selectAgendamentosByNomeFuncionario,
    selectAllAgendamentosFuncionarios,
    selectEnderecoFuncionariobyId,
    selectEnderecoFuncionariobyNome
}
