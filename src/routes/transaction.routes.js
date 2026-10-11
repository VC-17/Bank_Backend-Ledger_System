import {Router} from "express"
import {authMiddleware, authSystemUserMiddleware} from '../middleware/auth.middleware.js'
import { createInitialFundsTransaction, createTransaction } from "../controllers/transaction.controller.js"

const transactionRoutes = Router()


transactionRoutes.post('/' , authMiddleware , createTransaction )

transactionRoutes.post('/sytem/intitial-funds' , authSystemUserMiddleware , createInitialFundsTransaction )

export default transactionRoutes