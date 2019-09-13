# Boilerplate-Hazel-Serverless [![Build Status](https://travis-ci.org/huaying/ins-crawler.svg?branch=master)](https://travis-ci.org/huaying/ins-crawler)

Boilerplate com o propósito dar suporte na implementação dos testes dos serviços fornecidos atualmente pela Hazel. Esse Boilerplate, além de auxiliar na implementação dos testes automatizados de integração, também fornece uma estrutura base em Serverless com log e controle dos erros, uma cama de validação dos dados recebidos e um repositório de acesso as funcionalidades do DynamoDB.

# Tecnologias

1. Node JS
2. Jest - https://jestjs.io/docs/en/expect#tobetruthy.
3. Hapi/joi - https://hapi.dev/family/joi/?v=15.1.1#validatevalue-schema-options-callback
4. Serverless Framework - https://serverless.com/
5. DynamoDB

## Dependencias da aplicação

1. Instalar o Node JS - https://nodejs.org/en/download/
2. Instalar o Serverless Framework - https://serverless.com/framework/
3. Ter/Criar uma conta na Amazon Web Services - https://aws.amazon.com/pt/free/activate-your-free-tier-account/
4. Criar um usuário do IAM na AWS - https://docs.aws.amazon.com/pt_br/polly/latest/dg/setting-up.html
5. Adicionar as credencias da AWS do IAM no Serverless Framework - https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/

## Start os testes

1. Instalar as dependencias do projeto via: `npm install`
2. Implantar a aplicação na cloud: `serverless deploy -s test`
3. Executar os testes via: `npm test`

## Envs

Criar um arquivo `.env` e inserir variáveis de ambiente a esse arquivo da seguinte forma:

```
DYNAMO_TABLE=<NOME DA TABELA QUE SERÁ USADA>
SERVICES_DOMAIN=<NOME DO DOMINIO QUE SERÁ REQUISITADO>
```
