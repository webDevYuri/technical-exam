import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '../validators/auth.js'

export default class AuthController {
    async login ({ request, response}: HttpContext){
        const { email, password} = await request.validateUsing(loginValidator)
        
        const user = await User.verifyCredentials(email, password)
        const token = await User.accessTokens.create(user)

        return response.ok({
            success: true,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                token: token.value!.release(),
            },
            message: 'Login successful',
        })
    }

    async logout ({ auth, response}: HttpContext) {
        const user = auth.user!
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)

        return response.ok({
            success: true,
            message: 'Logout successful',
        })
    }

    async me ({ auth, response}: HttpContext) {
        const user = auth.user!

        return response.ok({
            success: true,
            data:{
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        })
    }
}