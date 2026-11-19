# Universo TDAH — projeto inicial

Portal educativo responsivo com área de artigos, ferramenta simples de tarefas, questionário reflexivo não diagnóstico, espaço reservado para anúncios e checkout Mercado Pago preparado para configuração.

## Requisitos
- Node.js 18 ou superior
- Conta comercial do provedor de pagamentos pertencente ao responsável adulto
- Hospedagem com HTTPS para produção

## Executar localmente
1. Descompacte o projeto.
2. Abra a pasta no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env`.
5. Para visualizar o site sem pagamentos, deixe o token vazio e execute `npm start`.
6. Acesse `http://localhost:3000`.

## Configurar checkout em ambiente de teste
1. O responsável adulto deve criar/administrar a aplicação de integração e obter credenciais de teste.
2. Preencha `MP_ACCESS_TOKEN` no arquivo `.env` do servidor. Nunca coloque o Access Token em arquivos dentro de `public/`, no navegador ou em repositório público.
3. Defina `SITE_URL` com a URL pública HTTPS do site quando estiver hospedado.
4. Configure o endpoint HTTPS `/api/webhook` no painel do provedor e habilite notificações de pagamento.
5. Teste todo o fluxo com credenciais e compradores de teste antes de pensar em produção.

## Atenção: ainda não é uma loja pronta para vender
- O item “Planner de Organização” e o preço são demonstração. Substitua pelo produto real e entregue o arquivo final somente após confirmação do pagamento.
- O webhook desta base recebe o evento e consulta o pagamento, mas **não libera produtos**. Antes de produção, implemente validação criptográfica da assinatura `x-signature`, banco de dados de pedidos, conciliação por `external_reference`, proteção contra notificações repetidas e entrega segura após status confirmado `approved`.
- Não confie nas páginas de retorno do navegador para confirmar pagamento.
- O exemplo não possui cadastro de clientes, gestão de pedidos, emissão fiscal, reembolso, política de entrega ou suporte.
- Configure termos de uso, política de privacidade real, contato do responsável, política de reembolso e informações comerciais exigidas pela legislação.
- A área de anúncios é apenas um espaço visual. É necessário solicitar aprovação na rede de anúncios e inserir o código oficial fornecido após aprovação.
- O formulário de newsletter é demonstrativo e não coleta e-mails.
- O questionário é apenas uma reflexão educativa, não é instrumento clínico, não calcula risco e não diagnostica TDAH.

## Segurança e responsabilidade
O responsável adulto deve revisar conteúdo, operação comercial, impostos, privacidade, credenciais e regras do provedor. Não publique segredos no GitHub nem envie credenciais por mensagem. Use primeiro o ambiente de teste.

## Documentação oficial
- Checkout Pro: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- Notificações/Webhooks: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/payment-notifications
- Referência de preferências: https://www.mercadopago.com.br/developers/pt/reference/online-payments/checkout-pro-preferences/overview
