import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class AdminUsersController {

    async index({ request, response}: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)

        const users = await User.query()
        .select('id', 'fullName', 'email', 'role', 'createdAt')
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

        return response.ok({
            success: true,
            data: users.all(),
            meta: users.getMeta(),
        })
    }

    async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(createUserValidator)

        const existingUser = await User.findBy('email', data.email)
        if (existingUser){
            return response.conflict({
                success: false,
                message: 'Email already exists',
            })
        }

        const user = await User.create({
            fullName: data.fullname || null,
            email: data.email,
            password: data.password,
            role: data.role,
        })

        return response.created({
            success: true,
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            message: 'User created successfully',
        })
        
    }

    async show({ params, response }: HttpContext) {
        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                success: false,
                message: 'User not found',
            })
        }

        return response.ok({
            success: true, 
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
        })
    }

    async update({ params, request, response }: HttpContext) {
        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                success: false,
                message: 'User not found',
            })
        }

        const data = await request.validateUsing(updateUserValidator)

        if (data.email && data.email !== user.email){
            const existingUser = await User.findBy('email', data.email)
            if (existingUser){
                return response.conflict({
                    success: false,
                    message: 'Email already exists',
                })
            }
        }

        user.merge(data)
        await user.save()

        return response.ok({
            success: true, 
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            message: 'User created successfully',
        })
    }

    async destroy({ auth, params, response }: HttpContext) {
        const currentUser = auth.user!
        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                success: false,
                message: 'User not found',
            })
        }

        if (user.id === currentUser.id) {
            return response.badRequest({
                success: false,
                message: 'Cannot delete your account',
            })
        }

        await user.delete()

        return response.ok({
            success: true,
            message: 'User deleted successfully'
        })
    }
}