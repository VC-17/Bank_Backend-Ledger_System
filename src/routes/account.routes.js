import express from 'express'
import {authMiddleware} from '../middleware/auth.middleware.js'
import {createAccountController, getUserAccountBalanceController, getUserAccountController} from '../controllers/account.controller.js'

const router = express.Router()

router.post("/" , authMiddleware , createAccountController)

router.get('/' , authMiddleware , getUserAccountController )

router.get('/balance/:accountId' , authMiddleware , getUserAccountBalanceController )

export default router