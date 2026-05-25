const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3000';

const orders = [
  { id: 101, userId: 1, items: ['Keyboard', 'Mouse'], total: 79.98 },
  { id: 102, userId: 2, items: ['Monitor'], total: 199.99 },
  { id: 103, userId: 3, items: ['Desk lamp'], total: 24.5 }
];

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'order-service' });
});

app.get('/orders', async (req, res) => {
  const payload = await Promise.all(
    orders.map(async order => {
      const response = await fetch(`${userServiceUrl}/users/${order.userId}`);
      const user = response.ok ? await response.json() : { id: order.userId, name: 'unknown' };
      return { ...order, user };
    })
  );
  res.json(payload);
});

app.get('/orders/:id', async (req, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const response = await fetch(`${userServiceUrl}/users/${order.userId}`);
  const user = response.ok ? await response.json() : { id: order.userId, name: 'unknown' };
  res.json({ ...order, user });
});

app.listen(port, () => {
  console.log(`order-service listening on port ${port}`);
});
