## PROJETO WIRECARD - BACKEND CASE

- Este é um projeto básico de Backend, utilizando Typescript, MySQL, além das bibliotecas knexJs e expressJs, desenvolvido para atender aos modelos REST API.

---
## DESCRIÇÃO DO PROJETO

- O projeto consiste em simular a metodologia CRUD na estruturação de Plataforma de Pagamentos WIRECARD,criando e acessando informações de pagamentos, nas formas de boleto e cartão de crédito, e sendo criado endpoints `GET` e `POST` para alimentar as demandas.

---
## DOCUMENTAÇÃO DE FUNCIONAMENTO

### ENTITIES
- Considerando a multiplicidade de entidades do projeto, será listo informações básicas sobre as mesmas abaixo:
    * boleto: registra as informações de geração do boleto, armazenando `id`, `code` e `expirationDate`. Todas as informações são geradas internamente no código, sendo o `expirationDate` lançado para 7 dias após a data de criação.
    * buyer: registra e capta informações de comprador de serviço/produto, captando `id`, `name`, `email` e `cpf` do mesmo.
    * client: fornece informações de fornecedor de serviço/produto, captando seu `id` e `name`. Esta entidade deve ser mockada no banco de dados para a execução dos endpoints.
    * creditCard: registra (opcional) e capta informações do cartão de crédito de um dono, armazenando `id`, `holderName`, `brand`, `cardNumber`, `expirationDate` e `cvv`.
    * holder: registra e capta informações do dono do cartão de crédito, captando `id`, `name`, `birthDate` e `documentNumber` do mesmo.
    * payment: registra e capta informações do pagamento de uma compra, armazenando `id`, `amount`, `method`, `status`, `buyerId` e `clientId` do mesmo.

---
### LINK DA DOCUMENTAÇÃO NO POSTMAN: https://documenter.getpostman.com/view/15825773/U16gQTDp

---
### `GET` Payment

`https://wirecard-projeto.herokuapp.com/purchase/:paymentId`

- Este endpoint retorna o pagamento desejado pelo seu `id`.
- São exibidos do pagamento seus `id`,`amount`, `method`, `status`, `buyerId` e respectivos `clientId` como resposta.

### Body
- `No Content`

### Headers
- `No Content`

### Path Variables
- paymentId     59e566d2-54e8-4e9b-8b2a-cdbdeab7dba3

### Response Example
```
{
    "payment": {
        "id": "59e566d2-54e8-4e9b-8b2a-cdbdeab7dba3",
        "amount": 100,
        "method": "BOLETO",
        "status": "CREATED",
        "buyerId": "c99e74f7-99af-4261-8a1c-e39c8d66fbd3",
        "clientId": "1"
    }
}
```
### Validation Restrictions
- Não há restrições.

---
### `POST` Create Payment

`https://wirecard-projeto.herokuapp.com/purchase/:clientId`

- Este endpoint cria um novo pagamento, que será recebido pelo `clientId`.
- Este método fornece duas respostas distintas, a depender do método de pagamento escolhido:
    * Se o pagamento for `BOLETO`, é exibido o `code` do boleto como resposta.
    * Se o pagamento for `CREDIT_CARD`, é exibido uma resposta aleatória contendo uma dos status possíveis
    para uma compra em cartão (se `AUTHORIZED` -`Transaction has been successfully!`, demais status - 
    `Transaction has been failed! 'CANCELLED/CREATED/IN_ANALYSIS/SETTLED' status`).
- Por ser um método integrado de formulário, este endpoint também cria outras entidades necessárias ao propósito, como cadastra automaticamente novos `buyer`, `holder` e `creditCard` (opcional, se passado a variável `saveCreditCard` como `true`), além de cadastrar novos `boleto` e `payment`.
- Observação: Este método requer a existência de `clientId` no banco de dados cadastrados.

### Body
- Se método `BOLETO`
```
{
    "buyer": {
        "name": "TESTE 5",
        "email": "teste5@teste.com",
        "cpf": "33377788811"
    },
    "payment": {
        "amount": 100,
        "method": "BOLETO"
    },
    "holder": {
        "name": "HOLDER",
        "birthDate": "01/10/2000",
        "documentNumber": "111111111"
    },
    "creditCard": {
        "holderName": "holderName",
        "brand": "ELO",
        "cardNumber": "1111111111111111",
        "expirationDate": "01/08/2022",
        "cvv": "666"
    }
}
```

- Se método `CREDIT_CARD`
```
{
    "buyer": {
        "name": "TESTE 1",
        "email": "teste1@teste.com",
        "cpf": "11122233355"
    },
    "payment": {
        "amount": 100.00,
        "method": "CREDIT_CARD"
    },
    "holder": {
        "name": "HOLDER 2",
        "birthDate": "01/10/1995",
        "documentNumber": "111111122"
    },
    "creditCard": {
        "holderName": "HOLDER NAME 2",
        "brand": "ELO",
        "cardNumber": "1111111111122111",
        "expirationDate": "01/08/2031",
        "cvv": "555"
    },
    "saveCreditCard": true
}
```

### Headers
- `No Content`

### Path Variables
- clientId      1

### Response Example
- Se método `BOLETO`:
```
{
    "message": "74256459798.4.2851316997.170.76080738663.8.56897040474.2"
}
```

- Se método `CREDIT_CARD`:
```
{
    "message": "Transaction has been failed! 'SETTLED' status"
}
```
### Validation Restrictions
#### Gerais (para os dois métodos de pagamento):
- `name`, `email` e `cpf` do `buyer` são obrigatórios e devem ser `string type`.
- `name` do `buyer` deve ter ao menos 3 letras.
- `email` do `buyer` deve ser um e-mail válido, do tipo `xxxx@yyyyy.zzz.www`.
- `cpf` do `buyer` deve ser composto por 11 dígitos numéricos no formato `string type`.
- `amount` e `method` do `payment` são obrigatórios.
- `amount` do `payment` deve ser `number type`, com valor positivo e não-nulo (maior que 0).
- `method` do `payment` só é válido para 2 valores: `BOLETO` ou `CREDIT_CARD`.
- `clientId` deve ser um `client` válido.

#### Válidos para o método BOLETO:
- Não há restrições específicas.

#### Válidos para o método CREDIT_CARD:
- `name`, `birthDate` e `documentNumber` do `holder` são obrigatórios e devem ser `string type`.
- `name` do `holder` deve ter ao menos 3 letras.
- `birthDate` deve ser uma string no formato `DD/MM/YYYY`.
- `documentNumber` deve ser composto por 11 dígitos numéricos no formato `string type`.
- `holderName`, `cardNumber`, `expirationDate`, `cvv` do `creditCard` são obrigatórios e devem ser `string type`.
- `brand` do `creditCard` é obrigatório e só é válido para as seguintes bandeiras: `AMERICAN_EXPRESS`, `ELO`, `HIPERCARD`, `MASTERCARD` e `VISA`.
- `holderName` deve ser exatamente o nome do dono do cartão que está descrito no corpo do cartão.
- `cardNumber` deve ser composto por 13 a 16 dígitos numéricos no formato `string type`.
- `expirationDate` deve ser passado no formato `DD/MM/YYYY`. Porém, qualquer valor de `DD` é válido (visto que cartões de crédito só olham para `MM/YYYY`).
- `cvv` deve ter exatamente 3 dígitos numéricos no formato `string type`.
- Caso queira salvar as informações do `creditCard` e vinculá-lo ao `holder` no banco, é necessário passar
a variável booleana `saveCreditCard` (opcional) com o valor `true`.

---
### POSSIBLE FAILURES UPON ENDPOINT
- Mesmo que seja selecionado o método `BOLETO` de pagamento, ainda é necessário passar as informações do `holder` e `creditCard`, apesar de não serem utilizadas (erro está sendo avaliado).