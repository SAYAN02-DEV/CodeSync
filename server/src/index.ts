import express from 'express'
import dotenv from 'dotenv'



dotenv.config();
const app = express();


const PORT = process.env.PORT || 4000;
const userRoutes = require('./routes/userRoutes');


app.use(express.json());
app.use('/user', userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});