/************************************************************************************************************
 * Objetivo: Arquivo responsavel pelo acesso ao Banco de dados MySQL, aqui faremos o CRUD na tabela Endereço
 * 
 * Data: 03/06/2024
 * Autor: Julia Mendes
 * Versão: 1.0
 * 
************************************************************************************************************/

const { PrismaClient } =  require('@prisma/client');

const prisma = new PrismaClient();

const selectAllEnderecos = async function (){

    let sql = 'select * from tbl_enderecos_funcionarios'    
    let rsEndereco = await prisma.$queryRawUnsafe(sql)


  if( rsEndereco.length > 0) 
      return rsEndereco;
   else
      return false;

}

const insertEndereco = async function (dadosEndereco){

    try{

    
        let sql 
     
            sql = `INSERT INTO tbl_enderecos_funcionarios (id_endereco,
            rua,
            cep,
            numero,
            complemento,
            bairro,
            estado,
            cidade
            ) VALUES 
            (
                '${dadosEndereco.rua}',
                '${dadosEndereco.cep}',
                '${dadosEndereco.numero}',
                '${dadosEndereco.complemento}',
                '${dadosEndereco.bairro}',
                '${dadosEndereco.estado}',
                '${dadosEndereco.cidade}')`
    
        
    
        let rsEndereco = await prisma.$executeRawUnsafe(sql)
        
        if(rsEndereco)
            return true
        }catch(error){
            return false
        }
            
}

const updateEndereco = async function (id, dadosEndereco) {

    try{

         let sql =  ` UPDATE tbl_enderecos_funcionarios SET 
        rua = '${dadosEndereco.rua}', 
        cep = '${dadosEndereco.cep}',
        numero = '${dadosEndereco.numero}',
        complemento = '${dadosEndereco.complemento}',
        bairro = '${dadosEndereco.bairro}',
        estado = '${dadosEndereco.estado}',
        cidade = '${dadosEndereco.cidade}'
        WHERE (id_endereco = ${id}) `
       
    
        let rsEndereco = await prisma.$executeRawUnsafe(sql)
    
    
         if (rsEndereco)
         return true
         else
         return false 
    }catch(error){
        return false
    }

}

 const deleteEndereco = async function (id){
    try {
   
        let sql = ` DELETE FROM tbl_enderecos WHERE (id_endereco = ${id});`
 
        console.log(sql);
    
        let rsEndereco= await prisma.$executeRawUnsafe(sql);  
       
        if(rsEndereco)
        return true
       
      } catch (error) {
         
        return false
        }
    
   
 }

 const selectEnderecoById = async function (id){

    try{
        let sql = `select * from tbl_enderecos_funcionarios where id_endereco = ${id}`

        let rsEndereco = await prisma.$queryRawUnsafe(sql)

        return rsEndereco
       

    } catch (error){
        return false
    }

 }

 const selectUltimoIdEndereco = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id_endereco from tbl_enderecos_funcionarios limit 1;`

       let rsEndereco = await prisma.$queryRawUnsafe(sql)

       return rsEndereco

       
    } catch (error) {
       return false
   }
}

module.exports = {
    selectAllEnderecos,
    insertEndereco,
    updateEndereco,
    deleteEndereco,
    selectUltimoIdEndereco,
    selectEnderecoById
}