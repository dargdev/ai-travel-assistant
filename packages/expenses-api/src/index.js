import express from 'express';
import expenses from './routes/expenses.js';

const app = express();

app.use(express.json());

app.use('/expenses', expenses);

app.listen(3000, () => {
  console.log(`Server listening at port ${3000}`);
})


