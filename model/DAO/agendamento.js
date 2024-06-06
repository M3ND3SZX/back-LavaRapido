/************************************************************************************************************
 * Objetivo: Arquivo responsavel pelo acesso ao Banco de dados MySQL, aqui faremos o CRUD na tabela Agendamentos
 * 
 * Data: 02/06/2024
 * Autor: Julia Mendes
 * Versão: 1.0
 * 
************************************************************************************************************/

const { PrismaClient } =  require('@prisma/client');

const prisma = new PrismaClient();
