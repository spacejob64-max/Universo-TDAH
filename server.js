import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;

// Catálogo controlado pelo servidor: o navegador não escolhe o preço.
const PRODUCTS = {
  planner: {
    title: 'Planner de Organização — Universo TDAH',
    price: 19.90,
    description: 'Material educativo digital. Não substitui acompanhamento profissional.'
  }
};

function getMercadoPago() {
  if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN não configurado no servidor.');
  }
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  return {
    preference: new Preference(client),
    payment: new Payment(client)
  };
}

app.post('/api/create-checkout', async (req, res) => {
  try {
    const { productId } = req.body || {};
    const product = PRODUCTS[productId];
    if (!product) return res.status(400).json({ error: 'Produto inválido.' });

    const { preference } = getMercadoPago();
    const result = await preference.create({
      body: {
        items: [{
          id: productId,
          title: product.title,
          description: product.description,
          quantity: 1,
          unit_price: product.price,
          currency_id: 'BRL'
        }],
        back_urls: {
          success: `${SITE_URL}/?pagamento=sucesso`,
          failure: `${SITE_URL}/?pagamento=falhou`,
          pending: `${SITE_URL}/?pagamento=pendente`
        },
        notification_url: `${SITE_URL}/api/webhook`,
        external_reference: `universo-tdah-${productId}-${Date.now()}`
      }
    });

    if (!result.init_point) throw new Error('O checkout não retornou um link.');
    return res.json({ checkoutUrl: result.init_point });
  } catch (error) {
    console.error('Erro ao criar checkout:', error.message);
    return res.status(500).json({
      error: 'Não foi possível iniciar o pagamento. Confira a configuração do servidor.'
    });
  }
});

// Recebe notificações. O retorno do navegador NÃO confirma pagamento.
// Em produção, configure a assinatura secreta do webhook no painel do Mercado Pago,
// valide o cabeçalho x-signature conforme a documentação e consulte o pagamento
// pela API antes de liberar qualquer produto. Este exemplo apenas consulta e registra.
app.post('/api/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const paymentId = req.body?.data?.id || req.query?.['data.id'];
    const eventType = req.body?.type || req.query?.type;
    if (eventType !== 'payment' || !paymentId || !process.env.MP_ACCESS_TOKEN) return;

    const { payment } = getMercadoPago();
    const details = await payment.get({ id: String(paymentId) });
    console.log('Notificação consultada:', {
      id: details.id,
      status: details.status,
      external_reference: details.external_reference
    });
    // Próximo passo de produção: validar assinatura do webhook, conferir pedido
    // no banco de dados e liberar o arquivo SOMENTE após status "approved".
  } catch (error) {
    console.error('Falha ao consultar notificação:', error.message);
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, paymentsConfigured: Boolean(process.env.MP_ACCESS_TOKEN) }));

app.listen(PORT, () => console.log(`Universo TDAH disponível em ${SITE_URL}`));
